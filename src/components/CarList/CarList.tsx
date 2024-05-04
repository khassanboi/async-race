import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Control } from '../Control/Control';
import { CarItem } from '../CarItem/CarItem';
import { Car } from '../../types';
import { getCars } from '../../redux/carsSlice';

export const CarList = () => {
  const cars = useSelector((state: RootState) => state.cars);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCars() as any);
  }, [dispatch]);

  return (
    <div>
      <Control />
      {cars.map((car: Car) => (
        <CarItem key={car.id} carName={car.name} carColor={car.color} />
      ))}
    </div>
  );
};
