import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractMembershipRankList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.membershipRanks)) {
    return payload.membershipRanks;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const extractMembershipRankDetail = (response) => {
  const payload = unwrapData(response);

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload?.membershipRank && !Array.isArray(payload.membershipRank)) {
    return payload.membershipRank;
  }

  return payload;
};

export const normalizeMembershipRank = (membershipRank) => ({
  ...membershipRank,
  id: membershipRank?.id ?? membershipRank?.membershipRankId ?? null,
  name: membershipRank?.name ?? '',
  requiredPoint: Number(membershipRank?.requiredPoint ?? 0),
  returnPointsTicket: Number(membershipRank?.returnPointsTicket ?? 0),
  returnPointsSnack: Number(membershipRank?.returnPointsSnack ?? 0),
  priorityLevel: Number(membershipRank?.priorityLevel ?? 0),
  status: membershipRank?.status !== false,
});

export const findAllMembershipRanks = async () => {
  return await axios.get('/membership-rank/all');
};

export const upgradeMembershipForUser = async (userId, membershipRankId) => {
  return await axios.put(
    `/membership-rank/upgrade/user/${userId}/membership-rank/${membershipRankId}`
  );
};

export const findAllMembershipRanksAdmin = async () => {
  return await axios.get('/admin/membership-rank/all');
};

export const findMembershipRankById = async (id) => {
  return await axios.get(`/admin/membership-rank/${id}`);
};

export const createMembershipRank = async (data) => {
  return await axios.post('/admin/membership-rank/add', data);
};

export const updateMembershipRank = async (id, data) => {
  return await axios.put(`/admin/membership-rank/${id}`, data);
};

export const deleteMembershipRank = async (id) => {
  return await axios.delete(`/admin/membership-rank/${id}/delete`);
};
