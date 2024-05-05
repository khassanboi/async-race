import './ControlStyles.css';
import { ControlContainer } from './ControlContainer/ControlContainer';
import { ControlForm } from './ControlForm/ControlForm';
import { Button } from '../Button/Button';
import { Car } from '../../types';
import { createCar, updateCar } from '../../redux/carsSlice';
import { useDispatch } from 'react-redux';

type ControlProps = {
  selectedCar?: Car;
  startRace: () => void;
};

const carBrands = [
  'Audi',
  'BMW',
  'Chevrolet',
  'Ford',
  'Honda',
  'Hyundai',
  'Mercedes',
  'Nissan',
  'Toyota',
  'Ford',
  'Volvo',
  'Tesla',
];
const carModels = [
  'Model S',
  'X6',
  'Camaro',
  'Mustang',
  'Civic',
  'Accent',
  'GLA',
  'Altima',
  'Corolla',
  'Golf',
  'S Class',
  'Jetta',
];

export const Control = (props: ControlProps) => {
  const dispatch = useDispatch();

  const generateCars = () => {
    const numberOfCars = prompt(
      'How many cars would you like to generate? (1-100)',
      '100'
    );
    if (numberOfCars === null || isNaN(parseInt(numberOfCars))) {
      return;
    } else if (parseInt(numberOfCars) < 1 || parseInt(numberOfCars) > 100) {
      alert('Please enter a number between 1 and 100!');
    } else {
      for (let i = 0; i < parseInt(numberOfCars); i++) {
        const carName = `${
          carBrands[Math.floor(Math.random() * (11 - 0 + 1) + 0)]
        } ${carModels[Math.floor(Math.random() * (11 - 0 + 1) + 0)]}`;
        const carColor = `#${Math.floor(Math.random() * 16777215).toString(
          16
        )}`;
        dispatch(createCar({ name: carName, color: carColor }) as any)
          .then(() => {
            console.log('New car has successfully been added: ' + carName);
          })
          .catch(() => {
            alert('Failed to add new car!');
          });
      }
    }
  };

  return (
    <section className="control">
      <ControlContainer>
        <Button className="btn--blue" onClick={props.startRace} type="button">
          Race
        </Button>
        <Button className="btn--blue">Reset</Button>
        <Button className="btn--blue" onClick={generateCars} type="button">
          Generate Cars
        </Button>
      </ControlContainer>
      <ControlForm
        placeholder="New Car Name"
        buttonText="Create"
        buttonClassName="btn--green"
        submitType="create"
      />
      <ControlForm
        placeholder="Existing Car Name"
        buttonText="Update"
        buttonClassName="btn--green"
        submitType="update"
        selectedCar={props.selectedCar}
      />
    </section>
  );
};
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
