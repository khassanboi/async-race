import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Control } from '../Control/Control';
import { CarItem } from '../CarItem/CarItem';
import { Car } from '../../types';
import { getCars } from '../../redux/carsSlice';
import { Button } from '../Button/Button';

export const CarList = () => {
  const cars = useSelector((state: RootState) => state.cars);
  const dispatch = useDispatch();
  const [selectedCar, setSelectedCar] = useState<Car>();
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 7;

  useEffect(() => {
    dispatch(getCars() as any);
  }, [dispatch]);

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;

  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

  return (
    <div>
      <Control selectedCar={selectedCar} />
      {cars ? (
        currentCars.map((car: Car) => (
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
      <div className="pagination">
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          className="btn btn--blue"
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <h3>Page {currentPage}</h3>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          className="btn btn--blue"
          disabled={currentPage === Math.ceil(cars.length / carsPerPage)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
