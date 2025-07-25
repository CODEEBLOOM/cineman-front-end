import axios from '@apis/axiosClient';

export const createMultiple = async (data) => {
  const url = `/detail-booking-snack/create-multiple`;
  return await axios.put(url, data);
};
