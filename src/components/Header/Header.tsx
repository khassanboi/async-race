import React from 'react';
import './HeaderStyles.css';
import { Button } from '../Button/Button';

export function Header() {
  return (
    <header className="header">
      <span className="header__logo">ASYNC RACE</span>
      <nav className="header__ui">
        <Button className="btn--purple">Garage</Button>
        <Button className="btn--purple">Winners</Button>
      </nav>
    </header>
  );
}
