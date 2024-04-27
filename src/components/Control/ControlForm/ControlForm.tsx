import React from "react";
import "./ControlFormStyles.css";
import { ControlContainer } from "../ControlContainer/ControlContainer";
import { Button } from "../../Button/Button";

interface ControlFormProps {
  placeholder: string;
  buttonText: string;
  buttonClassName: string;
}

export const ControlForm = (props: ControlFormProps) => {
  return (
    <ControlContainer>
      <input
        type="text"
        className="control__input"
        placeholder={props.placeholder}
      />
      <input type="color" className="control__input" />
      <Button className={props.buttonClassName}>{props.buttonText}</Button>
    </ControlContainer>
  );
};
