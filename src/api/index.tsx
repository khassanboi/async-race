import axios from 'axios';
import { Car, Winner } from '../types';

const garageUrl = 'http://localhost:3000/garage';
const winnersUrl = 'http://localhost:3000/winners';
const engineUrl = 'http://localhost:3000/engine';

export const getCars = () => axios.get(garageUrl);
export const getCar = (id: number) => axios.get(`${garageUrl}/${id}`);
export const createCar = (newCar: Car) => axios.post(garageUrl, newCar);
export const deleteCar = (id: number) => axios.delete(`${garageUrl}/${id}`);
export const updateCar = (id: number, name: string, color: string) => {
  axios.put(`${garageUrl}/${id}`, {
    name,
    color,
  });
};

export const getWinners = () => axios.get(winnersUrl);
export const getWinner = (id: number) => axios.get(`${winnersUrl}/${id}`);
export const createWinner = (newWinner: Winner) =>
  axios.post(winnersUrl, newWinner);
export const deleteWinner = (id: number) => axios.delete(`${winnersUrl}/${id}`);
export const updateWinner = (winner: Winner) =>
  axios.put(`${winnersUrl}/${winner.id}`, {
    wins: winner.wins,
    time: winner.time,
  });

export const startEngine = (id: number) =>
  axios.patch(engineUrl, null, { params: { id: id, status: 'started' } });

export const stopEngine = (id: number) =>
  axios.patch(engineUrl, null, { params: { id: id, status: 'stopped' } });

export const drive = (id: number) =>
  axios.patch(engineUrl, null, { params: { id: id, status: 'drive' } });
