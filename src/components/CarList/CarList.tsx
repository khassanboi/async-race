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
import { swalt } from '../../utilities/swalt';

export const CarList = () => {
  const cars = useSelector((state: RootState) => state.cars);
  const dispatch = useDispatch();
  const [selectedCar, setSelectedCar] = useState<Car>();
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 7;
  const [contestants, setContestants] = useState<Winner[]>([]);
  const [successfulCarAmount, setSuccessfulCarAmount] = useState<number>(0);
  const [brokenCarAmount, setBrokenCarAmount] = useState<number>(0);

  useEffect(() => {
    dispatch(getCars() as any);
  }, [dispatch]);

  useEffect(() => {
    const updateOrCreateWinner = async () => {
      if (brokenCarAmount > 0 || successfulCarAmount > 0) {
        if (
          (successfulCarAmount === 2 && contestants.length === 2) ||
          (brokenCarAmount + 1 == currentCars.length &&
            contestants.length === 1)
        ) {
          const winner = contestants.reduce((prev, current) =>
            prev.time < current.time ? prev : current
          );

          try {
            const getWinnerResult = await dispatch(getWinner(winner.id) as any);
            const winnerData = getWinnerResult.payload;
            const winnerCar = await cars.find(
              (car: Car) => car.id === winner.id
            );

            if (winnerData) {
              await dispatch(
                updateWinner({
                  id: winner.id,
                  wins: winnerData.wins + 1,
                  time:
                    winner.time > winnerData.time
                      ? winnerData.time
                      : winner.time,
                }) as any
              );
              swalt.fire({
                title: `${winnerCar?.name} has won the race again!`,
                text: `Time: ${winner.time.toFixed(2)} sec | Wins: ${
                  winnerData.wins + 1
                } | Best Time: ${(winner.time > winnerData.time
                  ? winnerData.time
                  : winner.time
                ).toFixed(2)} sec`,
              });
            } else {
              await dispatch(
                createWinner({
                  id: winner.id,
                  wins: 1,
                  time: winner.time,
                }) as any
              );
              swalt.fire({
                title: `${winnerCar?.name} has won the race for the first time!`,
                text: `Time: ${winner.time.toFixed(2)} sec`,
              });
            }
          } catch (error) {
            console.error(
              `Failed to recognize a winner number ${winner.id}!`,
              error
            );
          }
        } else if (brokenCarAmount === currentCars.length) {
          swalt.fire({
            title: 'No winners this time!',
            text: 'All cars are broken',
          });
        }
      }
    };

    updateOrCreateWinner();
  }, [successfulCarAmount, contestants, brokenCarAmount, dispatch]);

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

      {cars.length ? (
        currentCars.map((car: Car) => (
          <CarItem
            key={car.id}
            carName={car.name || 'WINNER'}
            carColor={car.color}
            carId={car.id ? car.id : 0}
            setSelectedCar={setSelectedCar}
            setContestants={setContestants}
            setSuccessfulCarAmount={setSuccessfulCarAmount}
            setBrokenCarAmount={setBrokenCarAmount}
          />
        ))
      ) : (
        <p className="cars__no-car">No cars available</p>
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
