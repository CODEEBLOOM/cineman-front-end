import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

const uniqueNumberList = (values) => {
  const normalizedValues = (Array.isArray(values) ? values : [])
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);

  return Array.from(new Set(normalizedValues));
};

const resolvePermissionList = (role) => {
  const permissionCollections = [
    role?.permissions,
    role?.permissionResponses,
    role?.permissionDtos,
    role?.permissionDTOs,
    role?.permissionList,
  ];

  return permissionCollections.find(Array.isArray) ?? [];
};

export const normalizeRole = (role) => {
  const permissions = resolvePermissionList(role);
  const permissionIds = uniqueNumberList([
    ...(Array.isArray(role?.permissionIds) ? role.permissionIds : []),
    ...permissions.map((permission) => permission?.id ?? permission?.permissionId),
  ]);

  return {
    ...role,
    id: role?.id ?? role?.roleId ?? null,
    roleId: role?.roleId ?? role?.id ?? '',
    name: role?.name ?? '',
    status:
      role?.status !== false &&
      role?.active !== false &&
      role?.isActive !== false,
    permissions,
    permissionIds,
  };
};

export const extractRoleList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.roles)) {
    return payload.roles;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const extractRoleDetail = (response) => {
  const payload = unwrapData(response);

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload?.role && !Array.isArray(payload.role)) {
    return payload.role;
  }

  return payload;
};

export const findAllRolesAdmin = async () => {
  return await axios.get('/admin/role/all');
};

export const findRoleById = async (roleId) => {
  return await axios.get(`/admin/role/${roleId}`);
};

export const createRole = async (data) => {
  return await axios.post('/admin/role/add', data);
};

export const updateRole = async (roleId, data) => {
  return await axios.put(`/admin/role/${roleId}/update`, data);
};

export const changeRoleStatus = async (roleId, status) => {
  return await axios.patch(`/admin/role/${roleId}/status`, null, {
    params: { status },
  });
};

export const deleteRole = async (roleId) => {
  return await axios.delete(`/admin/role/${roleId}/delete`);
};
