import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

const FALLBACK_PERMISSION_PAGE_SIZE = 10;

const normalizeKeyword = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase();

const normalizeMethodFilter = (value) => String(value ?? '').trim().toUpperCase();

const sortPermissions = (permissions) =>
  [...permissions].sort((left, right) => {
    const normalizedLeft = normalizePermission(left);
    const normalizedRight = normalizePermission(right);
    const titleCompare = String(normalizedLeft?.title ?? '').localeCompare(
      String(normalizedRight?.title ?? ''),
      'vi'
    );

    if (titleCompare !== 0) {
      return titleCompare;
    }

    return String(normalizedLeft?.url ?? '').localeCompare(
      String(normalizedRight?.url ?? ''),
      'vi'
    );
  });

export const normalizePermission = (permission) => ({
  ...permission,
  id: Number(permission?.id ?? permission?.permissionId ?? 0) || null,
  title: permission?.title ?? permission?.name ?? '',
  description: permission?.description ?? '',
  method: normalizeMethodFilter(permission?.method),
  url: permission?.url ?? '',
  category:
    permission?.category ??
    permission?.permissionCategory ??
    permission?.group ??
    permission?.module ??
    '',
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

  if (Array.isArray(payload?.permissionResponses)) {
    return payload.permissionResponses;
  }

  if (Array.isArray(payload?.content)) {
    return payload.content;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.data?.permissionResponses)) {
    return payload.data.permissionResponses;
  }

  if (Array.isArray(payload?.data?.content)) {
    return payload.data.content;
  }

  return [];
};

export const extractPermissionMeta = (response) => {
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

export const extractPermissionDetail = (response) => {
  const payload = unwrapData(response);

  if (
    payload &&
    !Array.isArray(payload) &&
    (payload?.id || payload?.permissionId)
  ) {
    return payload;
  }

  if (payload?.permission && !Array.isArray(payload.permission)) {
    return payload.permission;
  }

  if (payload?.data && !Array.isArray(payload.data)) {
    if (payload.data.permission && !Array.isArray(payload.data.permission)) {
      return payload.data.permission;
    }

    return payload.data;
  }

  const permissionList = extractPermissionList(response);
  return permissionList.length > 0 ? permissionList[0] : null;
};

export const applyPermissionFilters = (permissions, filters = {}) => {
  const categoryFilter = normalizeKeyword(filters?.category);
  const methodFilter = normalizeMethodFilter(filters?.method);
  const titleFilter = normalizeKeyword(filters?.title);
  const urlFilter = normalizeKeyword(filters?.url);
  const keywordFilter = normalizeKeyword(filters?.keyword);

  return permissions.filter((permission) => {
    const normalizedPermission = normalizePermission(permission);
    const category = normalizeKeyword(normalizedPermission.category);
    const method = normalizeMethodFilter(normalizedPermission.method);
    const title = normalizeKeyword(normalizedPermission.title);
    const url = normalizeKeyword(normalizedPermission.url);
    const description = normalizeKeyword(normalizedPermission.description);

    if (categoryFilter && category !== categoryFilter) {
      return false;
    }

    if (methodFilter && method !== methodFilter) {
      return false;
    }

    if (titleFilter && !title.includes(titleFilter)) {
      return false;
    }

    if (urlFilter && !url.includes(urlFilter)) {
      return false;
    }

    if (keywordFilter) {
      const searchableText = [title, description, method.toLowerCase(), url, category].join(' ');

      if (!searchableText.includes(keywordFilter)) {
        return false;
      }
    }

    return true;
  });
};

const paginatePermissions = (permissions, { page = 0, size = FALLBACK_PERMISSION_PAGE_SIZE } = {}) => {
  const safePage = Math.max(0, Number(page) || 0);
  const safeSize = Math.max(1, Number(size) || FALLBACK_PERMISSION_PAGE_SIZE);
  const startIndex = safePage * safeSize;
  const endIndex = startIndex + safeSize;

  return {
    items: permissions.slice(startIndex, endIndex),
    meta: {
      currentPage: safePage,
      pageSize: safeSize,
      totalElements: permissions.length,
      totalPages: Math.max(1, Math.ceil(permissions.length / safeSize)),
    },
  };
};

const buildPermissionParams = ({
  page = 0,
  size = FALLBACK_PERMISSION_PAGE_SIZE,
  category = '',
  method = '',
  title = '',
  url = '',
  keyword = '',
} = {}) => ({
  page,
  size,
  'pageRequest.page': page,
  'pageRequest.size': size,
  ...(category ? { category } : {}),
  ...(method ? { method } : {}),
  ...(title ? { title } : {}),
  ...(url ? { url } : {}),
  ...(keyword ? { keyword } : {}),
});

export const findAllPermissionsAdmin = async () => {
  return await axios.get('/admin/permissions/all');
};

export const findPermissionById = async (id) => {
  return await axios.get(`/admin/permissions/${id}`);
};

export const createPermission = async (data) => {
  return await axios.post('/admin/permissions/add', data);
};

export const updatePermission = async (id, data) => {
  return await axios.put(`/admin/permissions/${id}`, data);
};

export const deletePermission = async (id) => {
  return await axios.delete(`/admin/permissions/${id}`);
};

export const findPermissionsAdmin = async ({
  page = 0,
  size = FALLBACK_PERMISSION_PAGE_SIZE,
  category = '',
  method = '',
  title = '',
  url = '',
  keyword = '',
} = {}) => {
  const params = buildPermissionParams({
    page,
    size,
    category,
    method,
    title,
    url,
    keyword,
  });

  try {
    return await axios.get('/admin/permissions', { params });
  } catch (error) {
    const status = error?.response?.status;

    if (status !== 404 && status !== 405) {
      throw error;
    }

    const allPermissionsResponse = await findAllPermissionsAdmin();
    const allPermissions = sortPermissions(extractPermissionList(allPermissionsResponse));
    const filteredPermissions = applyPermissionFilters(allPermissions, {
      category,
      method,
      title,
      url,
      keyword,
    });
    const paginatedPermissions = paginatePermissions(filteredPermissions, { page, size });

    return {
      content: paginatedPermissions.items,
      meta: paginatedPermissions.meta,
      fallback: true,
    };
  }
};
