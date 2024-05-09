import './ControlStyles.css';
import { ControlContainer } from './ControlContainer/ControlContainer';
import { ControlForm } from './ControlForm/ControlForm';
import { Button } from '../Button/Button';
import { Car } from '../../types';
import { createCar } from '../../redux/carsSlice';
import { RootState, useAppDispatch } from '../../redux/store';
import { swalt } from '../../utilities/swalt';
import type { ThunkDispatch } from '@reduxjs/toolkit';

type ControlProps = {
  selectedCar?: Car;
  startRace: () => void;
  disableControl: boolean;
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
const MIN_CAR_AMT = 1;
const MAX_CAR_AMT = 100;

const generateRandomCarName = () => {
  return `${carBrands[Math.floor(Math.random() * carBrands.length)]} ${carModels[Math.floor(Math.random() * carModels.length)]}`;
};

const generateRandomColor = () => {
  const MAX_COLOR_VALUE = 16777215;
  const STRING_BASE = 16;
  return `#${Math.floor(Math.random() * MAX_COLOR_VALUE).toString(STRING_BASE)}`;
};

const getNumberOfCarsInput = async () => {
  const { value: numberOfCars } = await swalt.fire({
    title: `How many random cars would you like to generate?`,
    icon: 'question',
    input: 'number',
    inputLabel: `(${MIN_CAR_AMT}-${MAX_CAR_AMT})`,
    inputValue: MAX_CAR_AMT.toString(),
    inputAttributes: {
      min: MIN_CAR_AMT.toString(),
      max: MAX_CAR_AMT.toString(),
    },
    inputValidator: (value) => {
      if (!value) return 'You need to enter a number!';
      if (parseInt(value) < MIN_CAR_AMT || parseInt(value) > MAX_CAR_AMT) {
        return `Please enter a number between ${MIN_CAR_AMT} and ${MAX_CAR_AMT}!`;
      }
    },
  });
  return numberOfCars;
};

const dispatchCreateCar = async (
  carName: string,
  carColor: string,
  numberOfCars: number,
  dispatch: ThunkDispatch<RootState, unknown, any>,
) => {
  try {
    await dispatch(createCar({ name: carName, color: carColor }));
    swalt.fire({
      title: `${numberOfCars} new random cars have been successfully created!`,
      icon: 'success',
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    swalt.fire({
      title: `Failed to add new cars! Try again later`,
      text: errorMessage,
      icon: 'error',
    });
  }
};

const createRandomCars = async (
  numberOfCars: number,
  dispatch: ThunkDispatch<RootState, unknown, any>,
) => {
  for (let i = 0; i < numberOfCars; i++) {
    const carName = generateRandomCarName();
    const carColor = generateRandomColor();
    await dispatchCreateCar(carName, carColor, numberOfCars, dispatch);
  }
};

const generateCars = async (
  dispatch: ThunkDispatch<RootState, unknown, any>,
) => {
  const numberOfCars = await getNumberOfCarsInput();
  if (!numberOfCars) return;

  const parsedNumberOfCars = parseInt(numberOfCars);
  if (
    isNaN(parsedNumberOfCars) ||
    parsedNumberOfCars < MIN_CAR_AMT ||
    parsedNumberOfCars > MAX_CAR_AMT
  )
    return;

  createRandomCars(parsedNumberOfCars, dispatch);
};

export const Control = (props: ControlProps) => {
  const dispatch = useAppDispatch();

  return (
    <section className="control">
      <ControlContainer>
        <Button
          className={`btn--blue ${props.disableControl ? 'btn--disabled' : ''}`}
          onClick={props.startRace}
          type="button"
        >
          Race
        </Button>
        <Button className="btn--blue">Reset</Button>
        <Button
          className="btn--blue"
          onClick={() => {
            generateCars(dispatch);
          }}
          type="button"
        >
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
