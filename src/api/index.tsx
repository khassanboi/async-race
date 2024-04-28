import axios from 'axios';

const garageUrl = 'http://localhost:3000/garage';
const winnersUrl = 'http://localhost:3000/winners';

export const getCars = () => axios.get(garageUrl);
export const getCar = (id: number) =>
  axios.get(garageUrl, {
    params: {
      id,
    },
  });
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
