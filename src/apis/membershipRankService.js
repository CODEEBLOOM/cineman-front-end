import axios from '@apis/axiosClient';

/**
 * Lấy tất cả thẻnh viên
 * @returns {Promise<axios.AxiosResponse<any>>} A promise that resolves to the response of the GET request.
 */
export const findAllMembershipRanks = async () => {
  const url = '/membership-rank/all';
  return await axios.get(url);
};

/**
 * Nâng cấp thẻ thành viên
 * @param {number} userId - Id người dùng
 * @param {number} membershipRankId - Id thẻ thành viên
 * @returns {Promise<axios.AxiosResponse<any>>} A promise that resolves to the updated user.
 */
export const upgradeMembershipForUser = async (userId, membershipRankId) => {
  const url = `/membership-rank/upgrade/user/${userId}/membership-rank/${membershipRankId}`;
  return await axios.put(url);
};
