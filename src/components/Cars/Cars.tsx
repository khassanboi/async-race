import React, { useState, useEffect } from 'react';
import * as api from '../../api/index';
import { Control } from '../Control/Control';
import { CarList } from '../CarList/CarList';

export const Cars = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    api.getCars().then((res) => {
      setCars(res.data);
    });
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <Control />
      <CarList cars={cars} />
    </div>
  );
};
