import React, { useState, useEffect } from 'react';
import { createCar, updateCar } from '../../../redux/carsSlice';
import './ControlFormStyles.css';
import { ControlContainer } from '../ControlContainer/ControlContainer';
import { Button } from '../../Button/Button';
import { Car } from '../../../types';
import { swalt } from '../../../utilities/swalt';
import { RootState, useAppDispatch } from '../../../redux/store';
import type { ThunkDispatch } from '@reduxjs/toolkit';

interface ControlFormProps {
  placeholder: string;
  buttonText: string;
  buttonClassName: string;
  selectedCar?: Car | null;
  submitType: 'create' | 'update';
}

const alertError = (
  error: { message: string },
  action: 'create' | 'update',
) => {
  swalt.fire({
    title: `Failed to ${action} a car! Try again later`,
    text: error.message,
    icon: 'error',
  });
};

const alertSuccess = (car: Car, action: 'create' | 'update') => {
  swalt.fire({
    title: `${car.name} has been succesfully ${action}d!`,
    icon: 'success',
  });
};

const handleSubmit = (
  event: React.FormEvent,
  props: ControlFormProps,
  car: Car,
  dispatch: ThunkDispatch<RootState, unknown, any>,
  setCar: React.Dispatch<React.SetStateAction<Car>>,
) => {
  event.preventDefault();

  if (props.submitType === 'create') {
    dispatch(createCar(car) as any)
      .then(() => {
        alertSuccess(car, 'create');
      })
      .catch((error: { message: string }) => {
        alertError(error, 'create');
      });
    setCar({ name: '', color: '' });
  } else if (props.submitType === 'update' && props.selectedCar) {
    dispatch(updateCar({ ...car, id: props.selectedCar.id }) as any)
      .then(() => {
        alertSuccess(car, 'update');
      })
      .catch((error: { message: string }) => {
        alertError(error, 'update');
      });
  }
};

export const ControlForm = (props: ControlFormProps) => {
  const [car, setCar] = useState({ name: '', color: '' });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (props.selectedCar) {
      setCar(props.selectedCar);
    }
  }, [props.selectedCar]);

  return (
    <ControlContainer
      onSubmit={(event) => handleSubmit(event, props, car, dispatch, setCar)}
    >
      <input
        type="text"
        value={car.name}
        onChange={(event) => setCar({ ...car, name: event.target.value })}
        className="control__input"
        placeholder={props.placeholder}
      />
      <input
        type="color"
        className="control__input"
        value={car.color ? car.color : '#000000'}
        onChange={(event) => setCar({ ...car, color: event.target.value })}
      />
      <Button className={props.buttonClassName} type="submit">
        {props.buttonText}
      </Button>
    </ControlContainer>
  );
};
