import './CarListStyles.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Control } from '../Control/Control';
import { CarItem } from '../CarItem/CarItem';
import { Car, Winner } from '../../types';
import { getCars } from '../../redux/carsSlice';
import { useAppDispatch } from '../../redux/store';
import {
  getWinner,
  createWinner,
  updateWinner,
} from '../../redux/winnersSlice';
import { Button } from '../Button/Button';
import { swalt } from '../../utilities/swalt';
import type { ThunkDispatch } from '@reduxjs/toolkit';

const CARS_PER_PAGE = 7;
const DEFAULT_CURRENT_PAGE = 1;
const SCS_CAR_AMT = 0;
const BRK_CAR_AMT = 0;
const NECESSARY_SUCCESSFUL_CAR_AMOUNT = 2;
const SINGLE_INCREMENT = 1;
const NUMBER_OF_DIGITS_AFTER_DECIMAL = 2;
const NULL_NUMBER = 0;

const displayWinnerMessage = (
  winnerCar: Car | undefined,
  prevWinnerData: { id: number; wins: number; time: number },
  updatedWinnerData: { id: number; wins: number; time: number },
) => {
  swalt.fire({
    title: `${winnerCar?.name} has won the race again!`,
    html: `Time: ${prevWinnerData.time.toFixed(NUMBER_OF_DIGITS_AFTER_DECIMAL)} sec <br><br> Wins: ${updatedWinnerData.wins} <br><br> Best Time: ${updatedWinnerData.time.toFixed(NUMBER_OF_DIGITS_AFTER_DECIMAL)} sec`,
  });
};

const displayFirstTimeWinnerMessage = (
  winnerCar: Car | undefined,
  updatedWinnerData: { id: number; wins: number; time: number },
) => {
  swalt.fire({
    title: `${winnerCar?.name} has won the race for the first time!`,
    html: `Time: ${updatedWinnerData.time.toFixed(NUMBER_OF_DIGITS_AFTER_DECIMAL)} sec <br><br> Wins: ${updatedWinnerData.wins}`,
  });
};

const displayNoWinnersMessage = () => {
  swalt.fire({
    title: 'No winners this time!',
    text: 'All cars are broken',
  });
};

const isQualifiedForWinnerDetermination = (
  brokenCarAmount: number,
  successfulCarAmount: number,
  currentCars: Car[],
) => {
  return (
    (brokenCarAmount == currentCars.length - SINGLE_INCREMENT &&
      successfulCarAmount != SCS_CAR_AMT) ||
    successfulCarAmount == NECESSARY_SUCCESSFUL_CAR_AMOUNT
  );
};

const determineWinner = (
  brokenCarAmount: number,
  successfulCarAmount: number,
  contestants: Winner[],
  currentCars: Car[],
) => {
  if (
    (successfulCarAmount === NECESSARY_SUCCESSFUL_CAR_AMOUNT &&
      contestants.length === NECESSARY_SUCCESSFUL_CAR_AMOUNT) ||
    (brokenCarAmount + SINGLE_INCREMENT === currentCars.length &&
      contestants.length === SINGLE_INCREMENT)
  ) {
    return contestants.reduce((prev, current) =>
      prev.time < current.time ? prev : current,
    );
  }
  return null;
};

const handleWinner = async (
  winner: Winner,
  currentCars: Car[],
  dispatch: ThunkDispatch<RootState, unknown, any>,
) => {
  try {
    const getWinnerResult = await dispatch(getWinner(winner.id));
    const winnerData = getWinnerResult.payload;
    const winnerCar = currentCars.find((car) => car.id === winner.id);

    const updatedWinnerData = {
      id: winner.id,
      wins: winnerData ? winnerData.wins + SINGLE_INCREMENT : SINGLE_INCREMENT,
      time:
        winner.time > (winnerData ? winnerData.time : Infinity)
          ? winnerData
            ? winnerData.time
            : Infinity
          : winner.time,
    };

    if (winnerData) {
      await dispatch(updateWinner(updatedWinnerData));
      displayWinnerMessage(winnerCar, winner, updatedWinnerData);
    } else {
      await dispatch(createWinner(updatedWinnerData));
      displayFirstTimeWinnerMessage(winnerCar, updatedWinnerData);
    }
  } catch (error) {
    console.error(`Failed to recognize a winner number ${winner.id}!`, error);
  }
};

const updateOrCreateWinner = async ({
  brkCarAmt,
  scsCarAmt,
  contestants,
  currentCars,
  dispatch,
}: {
  brkCarAmt: number;
  scsCarAmt: number;
  contestants: Winner[];
  currentCars: Car[];
  dispatch: ThunkDispatch<RootState, unknown, any>;
}) => {
  if (isQualifiedForWinnerDetermination(brkCarAmt, scsCarAmt, currentCars)) {
    const winner = determineWinner(
      brkCarAmt,
      scsCarAmt,
      contestants,
      currentCars,
    );
    if (winner) {
      await handleWinner(winner, currentCars, dispatch);
    } else {
      displayNoWinnersMessage();
    }
  }
};

const startRace = (
  setDisableControl: React.Dispatch<React.SetStateAction<boolean>>,
  currentCars: Car[],
) => {
  setDisableControl(true);
  currentCars.forEach((car: Car) => {
    document.getElementById(`car-start-engine-${car.id}`)?.click();
  });
};

const calculatePagination = (cars: Car[], currentPage: number) => {
  const indexOfLastCar = currentPage * CARS_PER_PAGE;
  const indexOfFirstCar = indexOfLastCar - CARS_PER_PAGE;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(cars.length / CARS_PER_PAGE);

  return { currentCars, totalPages };
};

type CarListProps = {
  selectedCar?: Car;
  setDisableControl: React.Dispatch<React.SetStateAction<boolean>>;
  currentCars: Car[];
  disableControl: boolean;
  cars: Car[];
  setSelectedCar: (car: Car) => void;
  setContestants: (contestants: Winner[]) => void;
  setScsCarAmt: (successfulCarAmount: number) => void;
  setBrkCarAmt: (brokenCarAmount: number) => void;
  setCurrentPage: (currentPage: number) => void;
  totalPages: number;
  currentPage: number;
};

const CarListFooter = (props: CarListProps) => {
  return (
    <div className="cars__car-list-footer">
      <h3 className="cars__total-number">{props.cars.length} cars in total</h3>
      <div className="cars__pagination">
        <Button
          onClick={() =>
            props.setCurrentPage(props.currentPage - SINGLE_INCREMENT)
          }
          className="btn btn--blue"
          disabled={props.currentPage === DEFAULT_CURRENT_PAGE}
        >
          Previous
        </Button>
        <h3>
          Page {props.currentPage} of {props.totalPages}
        </h3>
        <Button
          onClick={() =>
            props.setCurrentPage(props.currentPage + SINGLE_INCREMENT)
          }
          className="btn btn--blue"
          disabled={
            props.currentPage === Math.ceil(props.cars.length / CARS_PER_PAGE)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};

const renderCarList = (props: CarListProps) => {
  return (
    <div className="cars__car-list">
      <Control
        selectedCar={props.selectedCar}
        startRace={() => startRace(props.setDisableControl, props.currentCars)}
        disableControl={props.disableControl}
      />

      {props.cars.length ? (
        props.currentCars.map((car: Car) => (
          <CarItem
            key={car.id}
            carName={car.name || 'WINNER'}
            carColor={car.color}
            carId={car.id ?? NULL_NUMBER}
            setSelectedCar={props.setSelectedCar}
            setContestants={props.setContestants}
            setSuccessfulCarAmount={props.setScsCarAmt}
            setBrokenCarAmount={props.setBrkCarAmt}
          />
        ))
      ) : (
        <p className="cars__no-car">No cars available</p>
      )}
      <CarListFooter {...props} />
    </div>
  );
};

const dispatchCars = (dispatch: ThunkDispatch<RootState, unknown, any>) => {
  useEffect(() => {
    dispatch(getCars());
  }, [dispatch]);
};

const dispatchCompetition = (competitionProps: {
  brkCarAmt: number;
  scsCarAmt: number;
  contestants: Winner[];
  currentCars: Car[];
  dispatch: ThunkDispatch<RootState, unknown, any>;
}) => {
  useEffect(() => {
    updateOrCreateWinner(competitionProps);
  }, [competitionProps]);
};

export const CarList = () => {
  const dispatch = useAppDispatch();
  const cars = useSelector((state: RootState) => state.cars);
  const [selectedCar, setSelectedCar] = useState<Car>();
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [contestants, setContestants] = useState<Winner[]>([]);
  const [scsCarAmt, setScsCarAmt] = useState<number>(SCS_CAR_AMT);
  const [brkCarAmt, setBrkCarAmt] = useState<number>(BRK_CAR_AMT);
  const [disableControl, setDisableControl] = useState<boolean>(false);
  const { currentCars, totalPages } = calculatePagination(cars, currentPage);

  const competitionProps = {
    brkCarAmt,
    scsCarAmt,
    contestants,
    currentCars,
    dispatch,
  };

  dispatchCars(dispatch);
  dispatchCompetition(competitionProps);

  return renderCarList({
    selectedCar,
    setDisableControl,
    currentCars,
    disableControl,
    cars,
    setSelectedCar,
    setContestants,
    setScsCarAmt,
    setBrkCarAmt,
    setCurrentPage,
    totalPages,
    currentPage,
  });
};
