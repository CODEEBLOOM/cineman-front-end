import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

const normalizeUserRole = (role) => ({
  ...role,
  roleId: role?.roleId ?? role?.id ?? '',
  name: role?.name ?? role?.title ?? role?.roleId ?? '',
});

export const normalizeUser = (user) => {
  const roles = (Array.isArray(user?.roles) ? user.roles : []).map(normalizeUserRole);
  const roleIds = Array.from(
    new Set(
      [
        ...(Array.isArray(user?.roleIds) ? user.roleIds : []),
        ...roles.map((role) => role?.roleId),
      ].filter(Boolean)
    )
  );
  const rawStatus = user?.status;
  const normalizedStatus =
    typeof rawStatus === 'string'
      ? rawStatus.toUpperCase()
      : rawStatus === false || user?.active === false || user?.isActive === false
        ? 'INACTIVE'
        : 'ACTIVE';

  return {
    ...user,
    id: Number(user?.id ?? user?.userId ?? 0) || null,
    userId: Number(user?.userId ?? user?.id ?? 0) || null,
    email: user?.email ?? '',
    fullName: user?.fullName ?? '',
    phoneNumber: user?.phoneNumber ?? '',
    address: user?.address ?? '',
    dateOfBirth: user?.dateOfBirth ?? '',
    gender: user?.gender ?? '',
    avatar: user?.avatar ?? '',
    status: normalizedStatus,
    isActive: normalizedStatus === 'ACTIVE',
    savePoint: Number(user?.savePoint ?? 0),
    membershipRankName: user?.membershipRank?.name ?? '',
    movieTheaterName: user?.movieTheater?.name ?? '',
    roles,
    roleIds,
  };
};

export const extractUserList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.userResponses)) {
    return payload.userResponses;
  }

  if (Array.isArray(payload?.content)) {
    return payload.content;
  }

  if (Array.isArray(payload?.users)) {
    return payload.users;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.data?.userResponses)) {
    return payload.data.userResponses;
  }

  if (Array.isArray(payload?.data?.content)) {
    return payload.data.content;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

export const extractUserDetail = (response) => {
  const payload = unwrapData(response);

  if (payload?.userResponse && !Array.isArray(payload.userResponse)) {
    return payload.userResponse;
  }

  if (payload?.user && !Array.isArray(payload.user)) {
    return payload.user;
  }

  if (payload?.data?.userResponse && !Array.isArray(payload.data.userResponse)) {
    return payload.data.userResponse;
  }

  if (payload?.data?.user && !Array.isArray(payload.data.user)) {
    return payload.data.user;
  }

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  return payload;
};

export const extractUserMeta = (response) => {
  const payload = unwrapData(response);

  if (payload?.meta) {
    return payload.meta;
  }

  if (payload?.page) {
    return payload.page;
  }

  if (payload?.data?.meta) {
    return payload.data.meta;
  }

  if (payload?.data?.page) {
    return payload.data.page;
  }

  return null;
};

export const findAllUsersAdmin = async ({ page = 0, size = 10, queries } = {}) => {
  return await axios.get('/admin/user/all', {
    params: {
      page,
      size,
      ...(queries ? { queries } : {}),
    },
  });
};

export const findUserById = async (userId) => {
  return await axios.get(`/admin/user/${userId}`);
};

export const findUserByEmail = async (email) => {
  return await axios.get(`/admin/user/${email}/find`);
};

export const createUserAdmin = async (data) => {
  return await axios.post('/admin/user/add', data);
};

export const updateUserAdmin = async (data) => {
  return await axios.put('/admin/user/update', data);
};

export const disableUserAdmin = async (userId) => {
  return await axios.delete(`/admin/user/${userId}/delete`);
};

export const getMoneyFromSavePointOfUser = async (userId, savePoint) => {
  return await axios.get(`/user/${userId}/change-point/${savePoint}`);
};

export const updateInfoUser = async (data) => {
  return await axios.put(`/user/${data.userId}/update-info`, data);
};
