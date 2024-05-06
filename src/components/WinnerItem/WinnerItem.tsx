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
        {Math.round(props.time * 100) / 100} sec
      </div>
    </div>
  );
};
