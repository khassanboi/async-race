import React from "react";
import "./HeaderStyles.css";
import { Button } from "../Button/Button";

export const Header = () => {
  return (
    <header className="header">
      <span className="header__logo">ASYNC RACE</span>
      <nav className="header__ui">
        <Button className="btn--red">Garage</Button>
        <Button className="btn--blue">Winners</Button>
      </nav>
    </header>
  );
};
