import './CarItemStyles.css';
import React, { useState } from 'react';
import { Button } from '../Button/Button';
import { useDispatch } from 'react-redux';
import { deleteCar } from '../../redux/carsSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { Car } from '../../types';
import { startEngine, stopEngine, drive } from '../../api';

type CarItemProps = {
  carName: string;
  carColor: string;
  carId: number;
  setSelectedCar: (car: Car) => void;
};

type DriveModeState = 'stopped' | 'drive' | 'completed' | 'paused';

export const CarItem = (props: CarItemProps) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [driveMode, setDriveMode] = useState<DriveModeState>('stopped');

  const handleDelete = () => {
    dispatch(deleteCar(props.carId));
  };

  const startAnimation = (time: number) => {
    const carIcon = document.getElementById(`car-icon-${props.carId}`);

    if (carIcon) {
      carIcon.style.animation = `move-car ${time}s linear`;
      carIcon.style.animationFillMode = 'forwards';

      carIcon.onanimationend = () => {
        console.log('Animation ended');
        setDriveMode('completed');
      };
    }
  };

  const stopAnimation = () => {
    const carIcon = document.getElementById(`car-icon-${props.carId}`);

    if (carIcon) {
      carIcon.style.animationPlayState = 'paused';
    }

    if (driveMode === 'drive') {
      setDriveMode('stopped');
    }
  };

  const driveCar = async (id: number) => {
    const carRoad = document.getElementById(`car-road-${props.carId}`);

    try {
      await drive(id).then(() => {
        if (carRoad) {
          carRoad.style.display = 'none';
        }
      });
    } catch (error) {
      console.error('Engine has broken!', error);
      stopAnimation();
      if (carRoad) {
        carRoad.style.display = 'inline-block';
      }
      setDriveMode('completed');
    }
  };

  const handleStartEngine = async (id: number) => {
    try {
      await startEngine(id).then((response) => {
        const time = response.data.distance / (response.data.velocity * 1000);
        startAnimation(time);
        driveCar(id);
        setDriveMode('drive');
      });
    } catch (error) {
      console.error('Failed to start engine!', error);
    }
  };

  const handleStopEngine = async (id: number) => {
    try {
      await stopEngine(id).then((response) => {
        stopAnimation();
      });
    } catch (error) {
      console.error('Failed to start engine', error);
    }
  };

  return (
    <div className="cars">
      <div className="cars__car">
        <div className="cars__car-control">
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
            className={`btn--small ${
              driveMode === 'stopped' ? 'btn--engine' : ''
            } ${driveMode === 'drive' ? 'btn--active' : ''} ${
              driveMode === 'completed' ? 'btn--disabled' : ''
            }`}
            onClick={() => handleStartEngine(props.carId)}
            id={`car-star-engine-${props.carId}`}
          >
            A
          </Button>
          <Button className="btn--red btn--small" onClick={handleDelete}>
            Remove
          </Button>
          <Button
            className={`btn--small ${
              driveMode === 'stopped' ? 'btn--active' : ''
            } ${driveMode === 'drive' ? 'btn--engine' : ''} ${
              driveMode === 'completed' ? 'btn--disabled' : ''
            }`}
            onClick={() => handleStopEngine(props.carId)}
            id={`car-stop-engine-${props.carId}`}
          >
            B
          </Button>
        </div>
        <h3 className="cars__car-name">{props.carName}</h3>
      </div>
      <div className="cars__car-road">
        <div
          className="cars__car-icon"
          style={{ backgroundColor: props.carColor }}
          id={`car-icon-${props.carId}`}
        >
          Car
        </div>
        <span className="cars__car-road-message" id={`car-road-${props.carId}`}>
          Engine Broken
        </span>
      </div>
    </div>
  );
};
