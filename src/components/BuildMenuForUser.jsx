import { listMenuAdmin } from '@utils/listMenuAdmin';
const BuildMenuForUser = (userRoles, { visibleIfNoRole = false } = {}) => {
  const roleSet = new Set((userRoles || []).map((r) => r.roleId));

  // Kiểm tra quyền truy cập một submenu
  const canSee = (submenu) => {
    const roles = submenu.role || [];
    if (roles.length === 0) return !!visibleIfNoRole;
    return roles.some((r) => roleSet.has(r));
  };

  // Lọc từng nhóm
  const filtered = (listMenuAdmin || [])
    .map((group) => {
      const menus = (group.menus || []).filter(canSee);
      if (menus.length === 0) return null;
      return { ...group, menus };
    })
    .filter(Boolean);

  return filtered;
};

export default BuildMenuForUser;
