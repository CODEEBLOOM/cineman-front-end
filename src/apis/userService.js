import axios from '@apis/axiosClient';

export const findUserByEmail = async (email) => {
  const url = `/admin/user/${email}/find`;
  return await axios.get(url);
};

export const getMoneyFromSavePointOfUser = async (userId, savePoint) => {
  const url = `/user/${userId}/change-point/${savePoint}`;
  return await axios.get(url);
};

/**
 * api cap nhat thong tin nguoi dung
 * @param {*} userId id nguoi dung
 * @returns
 */
export const updateInfoUser = async (data) => {
  const url = `/user/${data.userId}/update-info`;
  return await axios.put(url, data);
};
