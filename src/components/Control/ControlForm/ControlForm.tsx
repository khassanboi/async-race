import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCars, createCar } from '../../../redux/carsSlice';
import './ControlFormStyles.css';
import { ControlContainer } from '../ControlContainer/ControlContainer';
import { Button } from '../../Button/Button';
import { Car } from '../../../types';

interface ControlFormProps {
  placeholder: string;
  buttonText: string;
  buttonClassName: string;
  selectedCar?: Car | null;
}

export const ControlForm = (props: ControlFormProps) => {
  const [car, setCar] = useState({ name: '', color: '' });
  const dispatch = useDispatch();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(createCar(car) as any)
      .then(() => {
        alert('New car has successfully been added!');
      })
      .catch(() => {
        alert('Failed to add new car!');
      });
    setCar({ name: '', color: '' });
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
        value={car.color}
        onChange={(event) => setCar({ ...car, color: event.target.value })}
      />
      <Button className={props.buttonClassName} type="submit">
        {props.buttonText}
      </Button>
    </ControlContainer>
  );
};
