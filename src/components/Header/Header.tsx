import React from "react";
import "./HeaderStyles.css";

export const Header = () => {
  return (
    <header className="header">
      <span className="header__logo">ASYNC RACE</span>
      <nav className="header__ui">
        <button className="header__button btn btn--large btn--red">
          Garage
        </button>
        <button className="header__button btn btn--large btn--blue">
          Winners
        </button>
      </nav>
    </header>
  );
};
