import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Winner } from '../types';
import * as api from '../api';

export const getWinners = createAsyncThunk('winners/getWinners', async () => {
  const response = await api.getWinners();
  return response.data;
});

export const getWinner = createAsyncThunk(
  'winners/getWinner',
  async (id: number) => {
    const response = await api.getWinner(id);
    return response.data;
  },
);

export const createWinner = createAsyncThunk(
  'winners/createWinner',
  async (winner: Winner) => {
    const response = await api.createWinner(winner);
    return response.data;
  },
);

export const deleteWinner = createAsyncThunk(
  'winners/deleteWinner',
  async (id: number) => {
    await api.deleteWinner(id);
    return id;
  },
);

export const updateWinner = createAsyncThunk(
  'winners/updateWinner',
  async (winner: Winner) => {
    const response = await api.updateWinner(winner);
    return response.data;
  },
);

const winnersSlice = createSlice({
  name: 'winners',
  initialState: [] as Winner[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getWinners.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(getWinner.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(createWinner.fulfilled, (state, action) => {
      state.push(action.payload);
    });
    builder.addCase(deleteWinner.fulfilled, (state, action) => {
      return state.filter((winner: Winner) => winner.id !== action.payload);
    });
    builder.addCase(updateWinner.fulfilled, (state, action) => {
      return state.map((winner) =>
        winner.id === action.payload.id ? action.payload : winner,
      );
    });
  },
});

export default winnersSlice.reducer;
