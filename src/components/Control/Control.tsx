import React from "react";
import "./ControlStyles.css";
import { Button } from "../Button/Button";

export const Control = () => {
  return (
    <section className="control">
      <div className="control__container">
        <input
          type="text"
          className="control__input"
          placeholder="Car Brand Name"
        />
        <input type="color" className="control__input" />
        <Button className="btn--green">Create</Button>
      </div>
      <div className="control__container">
        <input
          type="text"
          className="control__input"
          placeholder="Car Brand Name"
        />
        <input type="color" className="control__input" />
        <Button className="btn--yellow">Update</Button>
      </div>
      <div className="control__container">
        <Button className="btn--green">Race</Button>
        <Button className="btn--red">Reset</Button>
        <Button className="btn--blue">Generate Cars</Button>
      </div>
    </section>
  );
};
