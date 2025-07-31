import axios from '@apis/axiosClient';

export const findUserByEmail = async (email) => {
  const url = `/admin/user/${email}/find`;
  return await axios.get(url);
};
