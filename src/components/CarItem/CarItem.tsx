import './CarItemStyles.css';
import { useState, useRef, useEffect } from 'react';
import { Button } from '../Button/Button';
import { useDispatch } from 'react-redux';
import { deleteCar } from '../../redux/carsSlice';
import { deleteWinner } from '../../redux/winnersSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { Car, Winner } from '../../types';
import { startEngine, stopEngine, drive } from '../../api';
import { swalt } from '../../utilities/swalt';

type CarItemProps = {
  carName: string;
  carColor: string;
  carId: number;
  setSelectedCar: (car: Car) => void;
  setContestants: (contestants: any) => void;
  setSuccessfulCarAmount: (successfulCarAmount: any) => void;
  setBrokenCarAmount: (brokenCarAmount: any) => void;
};

type DriveModeState = 'initial' | 'drive' | 'paused' | 'broken' | 'completed';

export const CarItem = (props: CarItemProps) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [driveMode, setDriveMode] = useState<DriveModeState>('initial');
  const carIconRef = useRef<HTMLDivElement | null>(null);
  let raceStartTime = new Date();
  let raceEndTime = new Date();

  useEffect(() => {
    const carIcon = carIconRef.current;
    if (carIcon) {
      carIcon.onanimationend = () => {
        setDriveMode('completed');
        raceEndTime = new Date();
        props.setSuccessfulCarAmount(
          (prevSuccessfulCarAmount: number) => prevSuccessfulCarAmount + 1
        );

        if (raceEndTime && raceStartTime) {
          props.setContestants((prevContestants: Winner[]) => [
            ...prevContestants,
            {
              id: props.carId,
              time: (raceEndTime.getTime() - raceStartTime.getTime()) / 1000,
            },
          ]);
        }
      };
    }
  }, []);

  const driveCar = async (id: number) => {
    setDriveMode('drive');

    try {
      await drive(id);
    } catch (error) {
      if (driveMode !== 'paused') {
        handleStopEngine(id, 'broken');
      }
      console.error(`Engine of car number ${id} has broken!`, error);
      props.setBrokenCarAmount(
        (prevBrokenCarAmount: number) => prevBrokenCarAmount + 1
      );
    }
  };

  const handleStartEngine = async (id: number) => {
    setDriveMode('drive');
    raceStartTime = new Date();

    try {
      const response = await startEngine(id);
      const time = response.data.distance / (response.data.velocity * 1000);
      const carIcon = carIconRef.current;

      if (carIcon) {
        if (driveMode === 'initial') {
          carIcon.style.animation = `move-car ${time}s ease-in-out`;
          carIcon.style.animationFillMode = 'forwards';
          driveCar(id);
        } else if (driveMode === 'paused' || driveMode !== 'broken') {
          carIcon.style.animationPlayState = 'running';
          setDriveMode('drive');
        }
      }
    } catch (error: { message: string } | any) {
      swalt.fire({
        title: `Failed to start the car engine!`,
        text: error.message,
        icon: 'error',
      });
      setDriveMode('broken');
    }
  };

  const handleStopEngine = async (id: number, reason: 'paused' | 'broken') => {
    setDriveMode(reason);
    const carIcon = carIconRef.current;

    if (carIcon) {
      carIcon.style.animationPlayState = 'paused';
    }

    try {
      await stopEngine(id);
    } catch (error: { message: string } | any) {
      swalt.fire({
        title: `Failed to stop the car engine!`,
        text: error.message,
        icon: 'error',
      });
      setDriveMode('broken');
    }
  };

  const handleDeleteCar = async (id: number) => {
    swalt
      .fire({
        title: 'Are you sure?',
        text: 'You cannot revert this action',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        confirmButtonColor: '#d33',
        cancelButtonText: 'No, cancel!',
        cancelButtonColor: '#3085d6',
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await dispatch(deleteCar(id));
            await dispatch(deleteWinner(id));
          } catch (error: { message: string } | any) {
            swalt.fire({
              title: `Failed to delete the car! Try again later`,
              text: error.message,
              icon: 'error',
            });
          }
        }
      });
  };

  return (
    <div className="cars">
      <div className="cars__car">
        <div className="cars__car-control">
          <Button
            className="btn--purple btn--small"
            onClick={() => {
              handleDeleteCar(props.carId);
            }}
          >
            Remove
          </Button>
          <Button
            className={`btn--small btn--green ${
              driveMode === 'initial' || driveMode === 'paused'
                ? 'btn--abled'
                : ''
            } ${driveMode === 'drive' ? 'btn--active' : ''} ${
              driveMode === 'completed' || driveMode === 'broken'
                ? 'btn--disabled'
                : ''
            }`}
            onClick={() => handleStartEngine(props.carId)}
            id={`car-start-engine-${props.carId}`}
          >
            A
          </Button>
          <Button
            className="btn--blue btn--small"
            onClick={() =>
              props.setSelectedCar({
                id: props.carId,
                name: props.carName,
                color: props.carColor,
              } as Car)
            }
          >
            Select
          </Button>
          <Button
            className={`btn--small btn--red ${
              driveMode === 'initial' || driveMode === 'paused'
                ? 'btn--active'
                : ''
            } ${driveMode === 'drive' ? 'btn--abled' : ''} ${
              driveMode === 'completed' || driveMode === 'broken'
                ? 'btn--disabled'
                : ''
            }`}
            onClick={() => handleStopEngine(props.carId, 'paused')}
            id={`car-stop-engine-${props.carId}`}
          >
            B
          </Button>
        </div>
      </div>
      <div className="cars__car-road">
        <div
          className="cars__car-icon"
          style={{ backgroundColor: props.carColor }}
          id={`car-icon-${props.carId}`}
          ref={carIconRef}
        >
          Car
        </div>
        <h3 className="cars__car-name">{props.carName}</h3>
        {driveMode == 'broken' ? (
          <span
            className="cars__car-road-message"
            id={`car-road-${props.carId}`}
          >
            Engine Broken !
          </span>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
