import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createCar, updateCar } from '../../../redux/carsSlice';
import './ControlFormStyles.css';
import { ControlContainer } from '../ControlContainer/ControlContainer';
import { Button } from '../../Button/Button';
import { Car } from '../../../types';
import { swalt } from '../../../utilities/swalt';

interface ControlFormProps {
  placeholder: string;
  buttonText: string;
  buttonClassName: string;
  selectedCar?: Car | null;
  submitType: 'create' | 'update';
}

export const ControlForm = (props: ControlFormProps) => {
  const [car, setCar] = useState({ name: '', color: '' });
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.selectedCar) {
      setCar(props.selectedCar);
    }
  }, [props.selectedCar]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (props.submitType === 'create') {
      dispatch(createCar(car) as any)
        .then(() => {
          swalt.fire({
            title: `${car.name} has been succesfully created!`,
            icon: 'success',
          });
        })
        .catch((error: { message: string }) => {
          swalt.fire({
            title: `Failed to create a car! Try again later`,
            text: error.message,
            icon: 'error',
          });
        });
      setCar({ name: '', color: '' });
    } else if (props.submitType === 'update' && props.selectedCar) {
      dispatch(updateCar({ ...car, id: props.selectedCar.id }) as any)
        .then(() => {
          swalt.fire({
            title: `${car.name} has been succesfully updated!`,
            icon: 'success',
          });
        })
        .catch((error: { message: string }) => {
          swalt.fire({
            title: `Failed to update the car! Try again later`,
            text: error.message,
            icon: 'error',
          });
        });
    }
  };

  return (
    <ControlContainer onSubmit={handleSubmit}>
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
