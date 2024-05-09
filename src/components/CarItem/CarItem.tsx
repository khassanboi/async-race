import './CarItemStyles.css';
import { useState, useRef, useEffect } from 'react';
import { Button } from '../Button/Button';
import { deleteCar } from '../../redux/carsSlice';
import { deleteWinner } from '../../redux/winnersSlice';
import { Car, Winner } from '../../types';
import { startEngine, stopEngine, drive } from '../../api';
import { swalt } from '../../utilities/swalt';
import { RootState, useAppDispatch } from '../../redux/store';
import type { ThunkDispatch } from '@reduxjs/toolkit';

type CarItemProps = {
  carName: string;
  carColor: string;
  carId: number;
  setSelectedCar: (car: Car) => void;
  setContestants: (contestants: any) => void;
  setSuccessfulCarAmount: (successfulCarAmount: any) => void;
  setBrokenCarAmount: (brokenCarAmount: any) => void;
  driveMode?: DriveModeState;
  carIconRef?: React.MutableRefObject<HTMLDivElement | null>;
  setDriveMode?: React.Dispatch<React.SetStateAction<DriveModeState>>;
  dispatch?: ThunkDispatch<RootState, unknown, any>;
};

type EngineBrokenMessageProps = {
  driveMode: DriveModeState;
  carId: number;
};

type DriveModeState = 'initial' | 'drive' | 'paused' | 'broken' | 'completed';
let raceStartTime = new Date();

const handleAnimationEnd = (
  carIcon: HTMLDivElement | null,
  setDriveMode: React.Dispatch<React.SetStateAction<DriveModeState>>,
  props: CarItemProps,
) => {
  if (carIcon) {
    carIcon.onanimationend = () => {
      setDriveMode('completed');
      const raceEndTime = new Date();
      const INCREMENT_AMOUNT = 1;
      props.setSuccessfulCarAmount(
        (prevSuccessfulCarAmount: number) =>
          prevSuccessfulCarAmount + INCREMENT_AMOUNT,
      );

      if (raceEndTime && raceStartTime) {
        const MILLISECONDS_IN_SECOND = 1000;
        props.setContestants((prevContestants: Winner[]) => [
          ...prevContestants,
          {
            id: props.carId,
            time:
              (raceEndTime.getTime() - raceStartTime.getTime()) /
              MILLISECONDS_IN_SECOND,
          },
        ]);
      }
    };
  }
};

const handleStopEngine = async (
  props: CarItemProps,
  reason: DriveModeState,
) => {
  if (props.setDriveMode) {
    props.setDriveMode(reason);
  }
  const carIcon = props.carIconRef?.current;

  if (carIcon) {
    carIcon.style.animationPlayState = 'paused';
  }

  try {
    await stopEngine(props.carId);
  } catch (error: { message: string } | any) {
    swalt.fire({
      title: `Failed to stop the car engine!`,
      text: error.message,
      icon: 'error',
    });
    if (props.setDriveMode) {
      props.setDriveMode('broken');
    }
  }
};

const handleDriveCar = async (props: CarItemProps) => {
  if (props.setDriveMode) {
    props.setDriveMode('drive');
  }

  try {
    await drive(props.carId);
  } catch (error) {
    if (props.driveMode !== 'paused') {
      handleStopEngine(props, 'broken');
    }
    console.error(`Engine of car number ${props.carId} has broken!`, error);
    const INCREMENT_AMOUNT = 1;
    props.setBrokenCarAmount(
      (prevBrokenCarAmount: number) => prevBrokenCarAmount + INCREMENT_AMOUNT,
    );
  }
};

const handleStartEngine = async (props: CarItemProps) => {
  if (props.setDriveMode) {
    props.setDriveMode('drive');
  }
  raceStartTime = new Date();

  try {
    const MILLISECONDS_IN_SECOND = 1000;
    const response = await startEngine(props.carId);
    const time =
      response.data.distance /
      (response.data.velocity * MILLISECONDS_IN_SECOND);
    const carIcon = props.carIconRef?.current;
    if (carIcon) {
      if (props.driveMode === 'initial') {
        carIcon.style.animation = `move-car ${time}s ease-in-out`;
        carIcon.style.animationFillMode = 'forwards';
        handleDriveCar(props);
      } else if (props.driveMode === 'paused' || props.driveMode !== 'broken') {
        carIcon.style.animationPlayState = 'running';
        if (props.setDriveMode) {
          props.setDriveMode('drive');
        }
      }
    }
  } catch (error: { message: string } | any) {
    swalt.fire({
      title: `Failed to start the car engine!`,
      text: error.message,
      icon: 'error',
    });
    if (props.setDriveMode) {
      props.setDriveMode('broken');
    }
  }
};

const handleDeleteCar = async (
  id: number,
  dispatch: ThunkDispatch<RootState, unknown, any>,
) => {
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

const CarDeleteButton = ({
  carId,
  dispatch,
}: {
  carId: number;
  dispatch: ThunkDispatch<RootState, unknown, any>;
}) => {
  return (
    <Button
      className="btn--purple btn--small"
      onClick={() => {
        handleDeleteCar(carId, dispatch);
      }}
    >
      Remove
    </Button>
  );
};

const CarSelectButton = ({
  carId,
  carName,
  carColor,
  setSelectedCar,
}: {
  carId: number;
  carName: string;
  carColor: string;
  setSelectedCar: (car: Car) => void;
}) => {
  return (
    <Button
      className="btn--blue btn--small"
      onClick={() =>
        setSelectedCar({
          id: carId,
          name: carName,
          color: carColor,
        } as Car)
      }
    >
      Select
    </Button>
  );
};

const CarItemControl = ({ dispatch, ...props }: CarItemProps) => {
  return (
    <div className="cars__car-control">
      <CarDeleteButton
        carId={props.carId}
        dispatch={dispatch as ThunkDispatch<RootState, unknown, any>}
      />
      <Button
        className={`btn--small btn--green ${props.driveMode === 'initial' || props.driveMode === 'paused' ? 'btn--abled' : ''} ${props.driveMode === 'drive' ? 'btn--active' : ''} ${
          props.driveMode === 'completed' || props.driveMode === 'broken'
            ? 'btn--disabled'
            : ''
        }`}
        onClick={() => handleStartEngine(props)}
        id={`car-start-engine-${props.carId}`}
      >
        A
      </Button>
      <CarSelectButton
        carId={props.carId}
        carName={props.carName}
        carColor={props.carColor}
        setSelectedCar={props.setSelectedCar}
      />
      <Button
        className={`btn--small btn--red ${props.driveMode === 'initial' || props.driveMode === 'paused' ? 'btn--active' : ''} ${props.driveMode === 'drive' ? 'btn--abled' : ''} ${
          props.driveMode === 'completed' || props.driveMode === 'broken'
            ? 'btn--disabled'
            : ''
        }`}
        onClick={() => handleStopEngine(props, 'paused')}
        id={`car-stop-engine-${props.carId}`}
      >
        B
      </Button>
    </div>
  );
};

const EngineBrokenMessage = ({
  driveMode,
  carId,
}: EngineBrokenMessageProps) => {
  return driveMode == 'broken' ? (
    <span className="cars__car-road-message" id={`car-road-${carId}`}>
      Engine Broken !
    </span>
  ) : null;
};

export const CarItem = (props: CarItemProps) => {
  const [driveMode, setDriveMode] = useState<DriveModeState>('initial');
  const carIconRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    handleAnimationEnd(carIconRef.current, setDriveMode, props);
  }, []);

  return (
    <div className="cars">
      <CarItemControl
        {...props}
        carIconRef={carIconRef}
        driveMode={driveMode}
        setDriveMode={setDriveMode}
        dispatch={dispatch}
      />
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
        <EngineBrokenMessage driveMode={driveMode} carId={props.carId} />
      </div>
    </div>
  );
};
