import './ControlStyles.css';
import { ControlContainer } from './ControlContainer/ControlContainer';
import { ControlForm } from './ControlForm/ControlForm';
import { Button } from '../Button/Button';
import { Car } from '../../types';
type ControlProps = {
  selectedCar?: Car;
};

export const Control = (props: ControlProps) => {
  console.log(props.selectedCar);

  return (
    <section className="control">
      <ControlContainer>
        <Button className="btn--blue">Race</Button>
        <Button className="btn--blue">Reset</Button>
        <Button className="btn--blue">Generate Cars</Button>
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
