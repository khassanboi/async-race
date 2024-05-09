import React, { useState, useEffect } from 'react';
import * as api from '../../api/index';
import { WinnerItem } from '../WinnerItem/WinnerItem';
import { Winner } from '../../types';
import './WinnerListStyles.css';
import { Button } from '../Button/Button';

type WinnerListProps = {
  winners: Winner[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  setWinners: React.Dispatch<React.SetStateAction<never[]>>;
};

const WINNERS_PER_PAGE = 10;
const DEFAULT_CURRENT_PAGE = 1;
const SINGLE_INCREMENT = 1;

const calculatePagination = (winners: Winner[], currentPage: number) => {
  const indexOfLastCar = currentPage * WINNERS_PER_PAGE;
  const indexOfFirstCar = indexOfLastCar - WINNERS_PER_PAGE;
  const currentWinners = winners.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(winners.length / WINNERS_PER_PAGE);

  return { currentWinners, totalPages };
};

const dispatchWinners = (
  setWinners: React.Dispatch<React.SetStateAction<never[]>>,
) => {
  api
    .getWinners()
    .then((res) => {
      setWinners(res.data);
    })
    .catch((error) => {
      console.error('Failed to get winners', error);
    });
};

const WinnerListHeader = () => {
  return (
    <div className="winners__header">
      <div className="winners__header-title">Car Id</div>
      <div className="winners__header-title">Car Icon</div>
      <div className="winners__header-title">Car Name</div>
      <div className="winners__header-title">Car Wins</div>
      <div className="winners__header-title">Car Best Time</div>
    </div>
  );
};

const WinnerListFooter = (props: WinnerListProps) => {
  return (
    <div className="winners__footer">
      <h3 className="winners__total-number">
        {props.winners.length} winners in total
      </h3>
      <div className="winners__pagination">
        <Button
          className="btn btn--blue"
          onClick={() =>
            props.setCurrentPage(props.currentPage - SINGLE_INCREMENT)
          }
          disabled={props.currentPage === DEFAULT_CURRENT_PAGE}
        >
          Previous
        </Button>
        <h3>
          Page {props.currentPage} of {props.totalPages}
        </h3>
        <Button
          className="btn btn--blue"
          onClick={() =>
            props.setCurrentPage(props.currentPage + SINGLE_INCREMENT)
          }
          disabled={
            props.currentPage ===
            Math.ceil(props.winners.length / WINNERS_PER_PAGE)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export const WinnerList = () => {
  const [winners, setWinners] = useState([]);
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);

  useEffect(() => {
    dispatchWinners(setWinners);
  }, []);

  const { currentWinners, totalPages } = calculatePagination(
    winners,
    currentPage,
  );

  return (
    <main className="winners">
      <WinnerListHeader />
      {winners.length ? (
        currentWinners.map((winner: Winner) => (
          <WinnerItem
            key={winner.id}
            id={winner.id}
            time={winner.time}
            wins={winner.wins}
          />
        ))
      ) : (
        <p className="cars__no-car">No winners available</p>
      )}
      <WinnerListFooter
        winners={winners}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        setWinners={setWinners}
      />
    </main>
  );
};
