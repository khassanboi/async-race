import React from 'react';
import './HeaderStyles.css';
import { Button } from '../Button/Button';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="header">
      <span className="header__logo">ASYNC RACE</span>
      <nav className="header__ui">
        <Link to="/">
          <Button className="btn--purple">Garage</Button>
        </Link>
        <Link to="/winners">
          <Button className="btn--purple">Winners</Button>
        </Link>
      </nav>
    </header>
  );
}
