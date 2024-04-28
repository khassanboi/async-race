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
