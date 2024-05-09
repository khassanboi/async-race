import React, { useState, useEffect } from 'react';
import * as api from '../../api/index';
import { WinnerItem } from '../WinnerItem/WinnerItem';
import { Winner } from '../../types';
import './WinnerListStyles.css';
import { Button } from '../Button/Button';

export const WinnerList = () => {
  const [winners, setWinners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 7;

  useEffect(() => {
    api
      .getWinners()
      .then((res) => {
        setWinners(res.data);
      })
      .catch((error) => {
        console.error('Failed to get winners', error);
      });
  }, []);

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentWinners = winners.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(winners.length / carsPerPage);

  return (
    <main className="winners">
      <div className="winners__header">
        <div className="winners__header-title">Car Id</div>
        <div className="winners__header-title">Car Icon</div>
        <div className="winners__header-title">Car Name</div>
        <div className="winners__header-title">Car Wins</div>
        <div className="winners__header-title">Car Best Time</div>
      </div>
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
      <div className="winners__footer">
        <h3 className="winners__total-number">
          {winners.length} winners in total
        </h3>
        <div className="winners__pagination">
          <Button
            className="btn btn--blue"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <h3>
            Page {currentPage} of {totalPages}
          </h3>
          <Button
            className="btn btn--blue"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === Math.ceil(winners.length / carsPerPage)}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  );
};
