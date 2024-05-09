import './ControlStyles.css';
import { ControlContainer } from './ControlContainer/ControlContainer';
import { ControlForm } from './ControlForm/ControlForm';
import { Button } from '../Button/Button';
import { Car } from '../../types';
import { createCar } from '../../redux/carsSlice';
import { useDispatch } from 'react-redux';
import { swalt } from '../../utilities/swalt';

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

  const generateCars = async () => {
    const { value: numberOfCars } = await swalt.fire({
      title: `How many random cars would you like to generate?`,
      icon: 'question',
      input: 'number',
      inputLabel: '(1-100)',
      inputValue: '100',
      inputAttributes: {
        min: '1',
        max: '100',
      },
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter a number!';
        } else if (parseInt(value) < 1 || parseInt(value) > 100) {
          return 'Please enter a number between 1 and 100!';
        }
      },
    });

    if (
      numberOfCars === null ||
      isNaN(parseInt(numberOfCars)) ||
      parseInt(numberOfCars) < 1 ||
      parseInt(numberOfCars) > 100
    ) {
      return;
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
            swalt.fire({
              title: `${numberOfCars} new random cars have been succesfully created!`,
              icon: 'success',
            });
          })
          .catch((error: { message: string }) => {
            swalt.fire({
              title: `Failed to add new cars! Try again later`,
              text: error.message,
              icon: 'error',
            });
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
