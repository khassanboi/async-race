import './CarItemStyles.css';
import { Button } from '../Button/Button';
import { useDispatch } from 'react-redux';
import { deleteCar } from '../../redux/carsSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { Car } from '../../types';

type CarItemProps = {
  carName: string;
  carColor: string;
  carId: number;
  setSelectedCar: (car: Car) => void;
};

export const CarItem = (props: CarItemProps) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const handleDelete = () => {
    dispatch(deleteCar(props.carId));
  };

  return (
    <div className="cars">
      <div className="cars__car">
        <div className="cars__car-control">
          <Button
            className="btn--blue btn--small"
            onClick={() =>
              props.setSelectedCar({
                id: props.carId,
                name: props.carName,
                color: props.carColor,
              } as Car)
            }
          >
            Select
          </Button>
          <Button className="btn--active btn--small">A</Button>
          <Button className="btn--red btn--small" onClick={handleDelete}>
            Remove
          </Button>
          <Button className="btn--inactive btn--small">B</Button>
        </div>
        <h3 className="cars__car-name">{props.carName}</h3>
      </div>
      <div className="cars__car-road">
        <div
          className="cars__car-icon"
          style={{ backgroundColor: props.carColor }}
        >
          Car
        </div>
      </div>
    </div>
  );
};
