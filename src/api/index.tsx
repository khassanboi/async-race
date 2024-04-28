import axios from 'axios';

const garageUrl = 'http://localhost:3000/garage';
const winnersUrl = 'http://localhost:3000/winners';

export const getCars = () => axios.get(garageUrl);
export const getCar = (id: number) => axios.get(`${garageUrl}/${id}`);
export const createCar = (name: string, color: string) =>
  axios.post(garageUrl, {
    name,
    color,
  });
export const deleteCar = (id: number) => axios.delete(`${garageUrl}/${id}`);
export const updateCar = (id: number, name: string, color: string) => {
  axios.put(`${garageUrl}/${id}`, {
    name,
    color,
  });
};

export const getWinners = () => axios.get(winnersUrl);
export const getWinner = (id: number) => axios.get(`${winnersUrl}/${id}`);
export const createWinner = (id: number, wins: number, time: number) =>
  axios.post(winnersUrl, {
    id,
    wins,
    time,
  });
export const deleteWinner = (id: number) => axios.delete(`${winnersUrl}/${id}`);