import axios from '@apis/axiosClient';

export const getURLPayment = async ({ amount }) => {
  const url = '/payment/create_payment_url';
  return await axios.post(url, { amount });
};
