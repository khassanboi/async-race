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
  const [selectedCar, setSelectedCar] = useState<Car>();

  useEffect(() => {
    dispatch(getCars() as any);
  }, [dispatch]);

  return (
    <div>
      <Control selectedCar={selectedCar} />
      {cars ? (
        cars.map((car: Car) => (
          <CarItem
            key={car.id}
            carName={car.name}
            carColor={car.color}
            carId={car.id ? car.id : 0}
            setSelectedCar={setSelectedCar}
          />
        ))
      ) : (
        <p>No cars available</p>
      )}
    </div>
  );
};
