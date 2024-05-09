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

const sortWinners = (
  property: keyof Winner,
  setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>,
  sortOrder: 'asc' | 'desc',
  setWinners: React.Dispatch<React.SetStateAction<never[]>>,
) => {
  setWinners((prevWinners) => {
    const sortedWinners = [...prevWinners].sort((a, b) => {
      const ASCENDING_SORT = -1;
      const DESCENDING_SORT = 1;
      const EQUAL_VALUES = 0;

      if (a[property] < b[property]) {
        return sortOrder === 'asc' ? ASCENDING_SORT : DESCENDING_SORT;
      }
      if (a[property] > b[property]) {
        return sortOrder === 'asc' ? DESCENDING_SORT : ASCENDING_SORT;
      }
      return EQUAL_VALUES;
    });

    // Toggle sort order for next sort
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));

    return sortedWinners;
  });
};

type SortableHeaderProps = {
  setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  sortOrder: 'asc' | 'desc';
  setWinners: React.Dispatch<React.SetStateAction<never[]>>;
  setCurrentSort: React.Dispatch<
    React.SetStateAction<'wins' | 'time' | 'none'>
  >;
  currentSort: 'wins' | 'time' | 'none';
};

const renderWinnerListSortableHeader = (
  type: 'wins' | 'time',
  props: SortableHeaderProps,
) => {
  const FIRST_LETTER_INDEX = 0;
  const FIRST_LETTER_ORDER = 1;

  return (
    <div className="winners__header-title">
      Car{' '}
      {type.toString().charAt(FIRST_LETTER_INDEX).toUpperCase() +
        type.toString().slice(FIRST_LETTER_ORDER)}{' '}
      {props.currentSort == type
        ? props.sortOrder == 'asc'
          ? '↓'
          : '↑'
        : '↕'}
      <Button
        className="btn--small btn--blue"
        onClick={() => {
          sortWinners(
            type,
            props.setSortOrder,
            props.sortOrder,
            props.setWinners,
          );
          props.setCurrentSort(type);
        }}
      >
        Sort
      </Button>
    </div>
  );
};

const WinnerListHeader = ({
  setSortOrder,
  sortOrder,
  setWinners,
  setCurrentSort,
  currentSort,
}: SortableHeaderProps) => {
  return (
    <div className="winners__header">
      <div className="winners__header-title">Car Id</div>
      <div className="winners__header-title">Car Icon</div>
      <div className="winners__header-title">Car Name</div>
      {renderWinnerListSortableHeader('wins', {
        setSortOrder,
        sortOrder,
        setWinners,
        setCurrentSort,
        currentSort,
      })}
      {renderWinnerListSortableHeader('time', {
        setSortOrder,
        sortOrder,
        setWinners,
        setCurrentSort,
        currentSort,
      })}
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

const renderWinnerItems = (winners: Winner[], currentWinners: Winner[]) => {
  return winners.length ? (
    currentWinners.map((winner: Winner) => (
      <WinnerItem key={winner.id} winner={winner} />
    ))
  ) : (
    <p className="cars__no-car">No winners available</p>
  );
};

export const WinnerList = () => {
  const [winners, setWinners] = useState([]);
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentSort, setCurrentSort] = useState<'wins' | 'time' | 'none'>(
    'none',
  );
  useEffect(() => {
    dispatchWinners(setWinners);
  }, []);

  const { currentWinners, totalPages } = calculatePagination(
    winners,
    currentPage,
  );

  return (
    <main className="winners">
      <WinnerListHeader
        setSortOrder={setSortOrder}
        sortOrder={sortOrder}
        setWinners={setWinners}
        setCurrentSort={setCurrentSort}
        currentSort={currentSort}
      />
      {renderWinnerItems(winners, currentWinners)}
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
