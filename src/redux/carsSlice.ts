// src/redux/carsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/index';
import { Car } from '../types';

export const getCars = createAsyncThunk('cars/getCars', async () => {
  const response = await api.getCars();
  return response.data;
});

export const getCar = createAsyncThunk('cars/getCar', async (id: number) => {
  const response = await api.getCar(id);
  return response.data;
});

export const createCar = createAsyncThunk(
  'cars/createCar',
  async (newCar: Car) => {
    const response = await api.createCar(newCar);
    return response.data;
  },
);

export const deleteCar = createAsyncThunk(
  'cars/deleteCar',
  async (id: number) => {
    await api.deleteCar(id);
    return id;
  },
);

export const updateCar = createAsyncThunk(
  'cars/updateCar',
  async (updatedCar: Car) => {
    await api.updateCar(
      updatedCar.id as number,
      updatedCar.name,
      updatedCar.color,
    );
    return updatedCar;
  },
);

const carsSlice = createSlice({
  name: 'cars',
  initialState: [] as Car[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCars.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(getCar.fulfilled, (state, action) => {
      return state.map((car) =>
        car.id === action.payload.id ? action.payload : car,
      );
    });
    builder.addCase(createCar.fulfilled, (state, action) => {
      state.push(action.payload);
    });
    builder.addCase(deleteCar.fulfilled, (state, action) => {
      return state.filter((car: Car) => car.id !== action.payload);
    });
    builder.addCase(updateCar.fulfilled, (state, action) => {
      return state.map((car) =>
        car.id === action.payload.id ? action.payload : car,
      );
    });
  },
});

export default carsSlice.reducer;
