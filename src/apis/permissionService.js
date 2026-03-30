import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const normalizePermission = (permission) => ({
  ...permission,
  id: Number(permission?.id ?? permission?.permissionId ?? 0) || null,
  title: permission?.title ?? permission?.name ?? '',
  description: permission?.description ?? '',
  method: permission?.method ?? '',
  url: permission?.url ?? '',
});

export const extractPermissionList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.permissions)) {
    return payload.permissions;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const findAllPermissionsAdmin = async () => {
  return await axios.get('/admin/permissions/all');
};
