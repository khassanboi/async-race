import './CarItemStyles.css';
import { Button } from '../Button/Button';
import { Car } from '../../types';

type CarItemProps = {
  carName: string;
  carColor: string;
};

export const CarItem = (props: CarItemProps) => {
  return (
    <div className="cars">
      <div className="cars__car">
        <div className="cars__car-control">
          <Button className="btn--blue btn--small">Select</Button>
          <Button className="btn--active btn--small">A</Button>
          <Button className="btn--red btn--small">Remove</Button>
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
