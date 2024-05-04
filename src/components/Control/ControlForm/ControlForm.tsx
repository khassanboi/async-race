import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createCar, updateCar } from '../../../redux/carsSlice';
import './ControlFormStyles.css';
import { ControlContainer } from '../ControlContainer/ControlContainer';
import { Button } from '../../Button/Button';
import { Car } from '../../../types';

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
          alert('New car has successfully been added!');
        })
        .catch(() => {
          alert('Failed to add new car!');
        });
      setCar({ name: '', color: '' });
    } else if (props.submitType === 'update' && props.selectedCar) {
      dispatch(updateCar({ ...car, id: props.selectedCar.id }) as any)
        .then(() => {
          alert('Car has successfully been updated!');
        })
        .catch(() => {
          alert('Failed to update car!');
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
        value={car.color}
        onChange={(event) => setCar({ ...car, color: event.target.value })}
      />
      <Button className={props.buttonClassName} type="submit">
        {props.buttonText}
      </Button>
    </ControlContainer>
  );
};
