import "./ControlStyles.css";
import { ControlContainer } from "./ControlContainer/ControlContainer";
import { ControlForm } from "./ControlForm/ControlForm";
import { Button } from "../Button/Button";

export const Control = () => {
  return (
    <section className="control">
      <ControlForm
        placeholder="New Car Name"
        buttonText="Create"
        buttonClassName="btn--green"
      />
      <ControlForm
        placeholder="Existing Car Name"
        buttonText="Update"
        buttonClassName="btn--yellow"
      />
      <ControlContainer>
        <Button className="btn--green">Race</Button>
        <Button className="btn--red">Reset</Button>
        <Button className="btn--blue">Generate Cars</Button>
      </ControlContainer>
    </section>
  );
};
