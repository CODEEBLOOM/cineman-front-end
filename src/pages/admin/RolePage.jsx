import {
  deleteRole,
  changeRoleStatus,
  extractRoleDetail,
  extractRoleList,
  findAllRolesAdmin,
  findRoleById,
  normalizeRole,
} from '@apis/roleService';
import {
  extractPermissionList,
  findAllPermissionsAdmin,
  normalizePermission,
} from '@apis/permissionService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import RoleFormModal from '@component/admin/role/RoleFormModal';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep, MdOutlinePublishedWithChanges } from 'react-icons/md';
import { toast } from 'react-toastify';

const SummaryCard = ({ label, value, helper, accentClass }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`mt-2 text-2xl font-bold ${accentClass}`}>{value}</p>
    <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
  </div>
);

const RolePage = () => {
  const { openPopup } = useModelContext();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const permissionMap = useMemo(
    () =>
      permissions.reduce((result, permission) => {
        result[permission.id] = permission;
        return result;
      }, {}),
    [permissions]
  );

  const fetchPageData = useCallback(async () => {
    setIsLoading(true);

    try {
      const [roleResponse, permissionResponse] = await Promise.all([
        findAllRolesAdmin(),
        findAllPermissionsAdmin(),
      ]);

      const nextRoles = extractRoleList(roleResponse)
        .map(normalizeRole)
        .sort((left, right) => left.roleId.localeCompare(right.roleId, 'vi'));
      const nextPermissions = extractPermissionList(permissionResponse)
        .map(normalizePermission)
        .filter((permission) => permission.id)
        .sort((left, right) => left.title.localeCompare(right.title, 'vi'));

      setRoles(nextRoles);
      setPermissions(nextPermissions);
    } catch {
      toast.error('Không thể tải dữ liệu vai trò và quyền hạn!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý vai trò - POLY CINEMAS';
    fetchPageData();
  }, [fetchPageData]);

  const handleOpenModal = useCallback(
    async (role = null) => {
      if (!role?.roleId) {
        openPopup(<RoleFormModal permissions={permissions} onSuccess={fetchPageData} />);
        return;
      }

      try {
        const response = await findRoleById(role.roleId);
        const roleDetail = normalizeRole(extractRoleDetail(response));

        openPopup(
          <RoleFormModal
            role={roleDetail}
            permissions={permissions}
            onSuccess={fetchPageData}
          />
        );
      } catch {
        toast.error('Không thể tải chi tiết vai trò!');
      }
    },
    [fetchPageData, openPopup, permissions]
  );

  const handleDelete = useCallback(
    async (role) => {
      const roleId = role?.roleId ?? '';
      const roleName = role?.name ?? roleId;
      const confirmed = window.confirm(
        `Bạn có chắc muốn xóa vai trò "${roleName}" không?`
      );

      if (!confirmed) {
        return;
      }

      try {
        await deleteRole(roleId);
        toast.success('Xóa vai trò thành công!');
        await fetchPageData();
      } catch (error) {
        if (
          error?.response?.status === 400 ||
          error?.response?.status === 404 ||
          error?.response?.status === 409
        ) {
          return toast.error(error?.response?.data?.message);
        }

        toast.error('Xóa vai trò thất bại!');
      }
    },
    [fetchPageData]
  );

  const handleToggleStatus = useCallback(
    async (role) => {
      const roleId = role?.roleId ?? '';
      const nextStatus = role?.status === false;
      const actionLabel = nextStatus ? 'kích hoạt' : 'ngừng áp dụng';
      const confirmed = window.confirm(
        `Bạn có chắc muốn ${actionLabel} vai trò "${role?.name ?? roleId}" không?`
      );

      if (!confirmed) {
        return;
      }

      try {
        await changeRoleStatus(roleId, nextStatus);
        toast.success(
          nextStatus
            ? 'Kích hoạt vai trò thành công!'
            : 'Cập nhật trạng thái vai trò thành công!'
        );
        await fetchPageData();
      } catch (error) {
        if (
          error?.response?.status === 400 ||
          error?.response?.status === 404 ||
          error?.response?.status === 409
        ) {
          return toast.error(error?.response?.data?.message);
        }

        toast.error('Thay đổi trạng thái vai trò thất bại!');
      }
    },
    [fetchPageData]
  );

  const rows = useMemo(
    () =>
      roles.map((role, index) => ({
        ...role,
        gridIndex: index + 1,
      })),
    [roles]
  );

  const summary = useMemo(() => {
    const activeCount = roles.filter((role) => role.status !== false).length;
    const assignedPermissionCount = new Set(
      roles.flatMap((role) => role.permissionIds ?? [])
    ).size;
    const averagePermissionPerRole =
      roles.length > 0
        ? (roles.reduce((sum, role) => sum + (role.permissionIds?.length ?? 0), 0) /
            roles.length
          ).toFixed(1)
        : '0.0';

    return {
      total: roles.length,
      activeCount,
      assignedPermissionCount,
      averagePermissionPerRole,
    };
  }, [roles]);

  const columns = useMemo(
    () => [
      {
        field: 'gridIndex',
        headerName: 'STT',
        width: 90,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'roleId',
        headerName: 'Mã vai trò',
        width: 170,
        renderCell: (params) => (
          <span className="font-semibold text-slate-800">{params.value}</span>
        ),
      },
      {
        field: 'name',
        headerName: 'Tên vai trò',
        minWidth: 220,
        flex: 1,
        renderCell: (params) => params.value || 'Chưa cập nhật',
      },
      {
        field: 'permissionIds',
        headerName: 'Quyền được gán',
        minWidth: 360,
        flex: 1.4,
        sortable: false,
        renderCell: (params) => {
          const permissionIds = params.value ?? [];
          const permissionLabels = permissionIds
            .map((permissionId) => permissionMap[permissionId]?.title)
            .filter(Boolean);

          if (permissionLabels.length === 0) {
            return <span className="text-slate-500">Chưa gán quyền</span>;
          }

          const previewLabels = permissionLabels.slice(0, 3);

          return (
            <div className="flex flex-wrap gap-2 py-2">
              {previewLabels.map((label) => (
                <span
                  key={label}
                  className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700"
                >
                  {label}
                </span>
              ))}
              {permissionLabels.length > previewLabels.length ? (
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  +{permissionLabels.length - previewLabels.length} quyền
                </span>
              ) : null}
            </div>
          );
        },
      },
      {
        field: 'status',
        headerName: 'Trạng thái',
        width: 180,
        renderCell: (params) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              params.value !== false
                ? 'bg-green-100 text-green-600'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {params.value !== false ? 'Đang áp dụng' : 'Ngừng áp dụng'}
          </span>
        ),
      },
      {
        field: 'actions',
        headerName: 'Thao tác',
        width: 180,
        sortable: false,
        renderCell: (params) => (
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hover:cursor-pointer"
              onClick={() => handleOpenModal(params.row)}
              title="Cập nhật vai trò"
            >
              <CiEdit size={24} fill="orange" />
            </button>
            <button
              type="button"
              className="hover:cursor-pointer"
              onClick={() => handleToggleStatus(params.row)}
              title={
                params.row?.status !== false ? 'Ngừng áp dụng vai trò' : 'Kích hoạt vai trò'
              }
            >
              <MdOutlinePublishedWithChanges
                size={24}
                fill={params.row?.status !== false ? '#2563eb' : '#16a34a'}
              />
            </button>
            <button
              type="button"
              className="hover:cursor-pointer"
              onClick={() => handleDelete(params.row)}
              title="Xóa vai trò"
            >
              <MdOutlineDeleteSweep size={24} fill="red" />
            </button>
          </div>
        ),
      },
    ],
    [handleDelete, handleOpenModal, handleToggleStatus, permissionMap]
  );

  return (
    <div>
      <CustomBreadcrumb items={[{ label: 'Quản lý vai trò' }]} title="Quản lý vai trò" />

      <div className="mx-5 mt-3 grid gap-4 lg:grid-cols-3">
        <SummaryCard
          label="Tổng số vai trò"
          value={summary.total}
          helper="Theo dõi nhanh toàn bộ nhóm vai trò đang được khai báo trong hệ thống."
          accentClass="text-slate-900"
        />
        <SummaryCard
          label="Vai trò đang áp dụng"
          value={summary.activeCount}
          helper="Số vai trò hiện còn hiệu lực để phân quyền cho người dùng quản trị."
          accentClass="text-emerald-600"
        />
        <SummaryCard
          label="Quyền đã được sử dụng"
          value={summary.assignedPermissionCount}
          helper={`Trung bình mỗi vai trò đang gắn ${summary.averagePermissionPerRole} quyền.`}
          accentClass="text-sky-600"
        />
      </div>

      <div className="mx-5 mt-4 rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách vai trò</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý vai trò tài khoản và nhóm quyền được cấp cho từng vai trò trong
              trang quản trị.
            </p>
          </div>

          <Button variant="contained" onClick={() => handleOpenModal()}>
            Tạo mới
          </Button>
        </div>

        <DataGridTable
          rows={rows}
          columns={columns}
          loading={isLoading}
          hideFooter
          minWidth={1180}
          getRowId={(row) => row?.roleId ?? row?.id}
          loadingContent="Đang tải danh sách vai trò..."
          emptyContent="Chưa có vai trò nào"
        />
      </div>
    </div>
  );
};

export default RolePage;
