import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Control } from './components/Control/Control';
import { CarList } from './components/CarList/CarList';
import { WinnerList } from './components/WinnerList/WinnerList';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={[<Control />, <CarList />]} />
          <Route path="/winners" element={<WinnerList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
