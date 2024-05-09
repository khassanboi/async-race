import { useEffect, useState } from 'react';
import './WinnerItemStyles.css';
import { Car } from '../../types';
import * as api from '../../api/index';

type WinnerItemProps = {
  id: number;
  time: number;
  wins: number;
};

export const WinnerItem = (props: WinnerItemProps) => {
  const [winnerCar, setWinnerCar] = useState<Car | null>(null);
  const NUMBER_OF_DIGITS_AFTER_DECIMAL = 2;

  useEffect(() => {
    api.getCar(props.id).then((res) => {
      setWinnerCar(res.data);
    });
  }, []);

  return (
    <div className="winners__winner">
      <div className="winners__winner-detail">{props.id}</div>
      <div
        className="winners__winner-detail winners__winner-icon"
        style={{ backgroundColor: winnerCar?.color }}
      >
        Car Icon
      </div>
      <div className="winners__winner-detail">{winnerCar?.name}</div>
      <div className="winners__winner-detail">{props.wins}</div>
      <div className="winners__winner-detail">
        {Number(props.time.toFixed(NUMBER_OF_DIGITS_AFTER_DECIMAL))} sec
      </div>
    </div>
  );
};
