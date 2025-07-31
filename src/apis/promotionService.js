import axios from '@apis/axiosClient';

export const applyVoucher = async ({ code, amount }) => {
  const url = `/promotion/${code}/amount/${amount}/apply`;
  return await axios.put(url);
};

export const cancelApplyVoucher = async (id) => {
  const url = `/promotion/${id}/cancel`;
  return await axios.put(url);
};
