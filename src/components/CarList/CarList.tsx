import './CarListStyles.css';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Control } from '../Control/Control';
import { CarItem } from '../CarItem/CarItem';
import { Car, Winner } from '../../types';
import { getCars } from '../../redux/carsSlice';
import {
  getWinner,
  createWinner,
  updateWinner,
} from '../../redux/winnersSlice';
import { Button } from '../Button/Button';

export const CarList = () => {
  const cars = useSelector((state: RootState) => state.cars);
  const dispatch = useDispatch();
  const [selectedCar, setSelectedCar] = useState<Car>();
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 7;
  const [contestants, setContestants] = useState<Winner[]>([]);
  const [carAmount, setCarAmount] = useState<number>(0);

  useEffect(() => {
    dispatch(getCars() as any);
  }, [dispatch]);

  useEffect(() => {
    const updateOrCreateWinner = async () => {
      if (carAmount === 2 && contestants.length === 2) {
        const winner = contestants.reduce((prev, current) =>
          prev.time < current.time ? prev : current
        );

        try {
          const getWinnerResult = await dispatch(getWinner(winner.id) as any);
          const winnerData = getWinnerResult.payload;

          if (winnerData) {
            await dispatch(
              updateWinner({
                id: winner.id,
                wins: winnerData.wins + 1,
                time: winner.time,
              }) as any
            );
          } else {
            await dispatch(
              createWinner({
                id: winner.id,
                wins: 1,
                time: winner.time,
              }) as any
            );
          }
        } catch (error) {
          console.error('Failed to recognize a winner!');
        }
      }
    };

    updateOrCreateWinner();
  }, [carAmount, contestants, dispatch]);

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(cars.length / carsPerPage);

  const startRace = () => {
    currentCars.forEach((car: Car) => {
      document.getElementById(`car-start-engine-${car.id}`)?.click();
    });
  };

  return (
    <div className="cars__car-list">
      <Control selectedCar={selectedCar} startRace={startRace} />

      {cars ? (
        currentCars.map((car: Car) => (
          <CarItem
            key={car.id}
            carName={car.name || 'WINNER'}
            carColor={car.color}
            carId={car.id ? car.id : 0}
            setSelectedCar={setSelectedCar}
            setContestants={setContestants}
            setCarAmount={setCarAmount}
          />
        ))
      ) : (
        <p>No cars available</p>
      )}
      <div className="cars__car-list-footer">
        <h3 className="cars__total-number">{cars.length} cars in total</h3>
        <div className="cars__pagination">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="btn btn--blue"
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <h3>
            Page {currentPage} of {totalPages}
          </h3>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="btn btn--blue"
            disabled={currentPage === Math.ceil(cars.length / carsPerPage)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
