import {
  disableUserAdmin,
  extractUserDetail,
  extractUserList,
  extractUserMeta,
  findAllUsersAdmin,
  findUserById,
  normalizeUser,
} from '@apis/userService';
import {
  extractRoleList,
  findAllRolesAdmin,
  normalizeRole,
} from '@apis/roleService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import ImageComponent from '@component/ImageComponent';
import UserFormModal from '@component/admin/user/UserFormModal';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import DateFormatter from '@utils/DateFormatter';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'react-toastify';

const defaultPaginationModel = {
  page: 0,
  pageSize: 10,
};

const SummaryCard = ({ label, value, helper, accentClass }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`mt-2 text-2xl font-bold ${accentClass}`}>{value}</p>
    <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
  </div>
);

const genderLabelMap = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  OTHER: 'Khác',
};

const statusMetaMap = {
  ACTIVE: {
    label: 'Đang hoạt động',
    className: 'bg-green-100 text-green-600',
  },
  INACTIVE: {
    label: 'Ngừng hoạt động',
    className: 'bg-slate-200 text-slate-600',
  },
  DELETED: {
    label: 'Đã vô hiệu hóa',
    className: 'bg-rose-100 text-rose-600',
  },
};

const resolveAvatarSrc = (avatar) => {
  if (!avatar) {
    return '';
  }

  if (/^https?:\/\//i.test(avatar)) {
    return avatar;
  }

  return `${import.meta.env.VITE_STORAGES}/${avatar}`;
};

const formatDate = (value) => {
  if (!value) {
    return 'Chưa cập nhật';
  }

  try {
    return new DateFormatter(value).format('DD/MM/YYYY');
  } catch {
    return 'Chưa cập nhật';
  }
};

const numberFormatter = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
});

const UserPage = () => {
  const { openPopup } = useModelContext();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState(
    defaultPaginationModel
  );

  const loadRoles = useCallback(async () => {
    try {
      const response = await findAllRolesAdmin();
      const nextRoles = extractRoleList(response)
        .map(normalizeRole)
        .sort((left, right) => left.roleId.localeCompare(right.roleId, 'vi'));
      setRoles(nextRoles);
    } catch {
      toast.error('Không thể tải danh sách vai trò!');
    }
  }, []);

  const fetchUsers = useCallback(async ({ page, size }) => {
    setIsLoading(true);

    try {
      const response = await findAllUsersAdmin({ page, size });
      const items = extractUserList(response).map(normalizeUser);
      const meta = extractUserMeta(response);

      setUsers(items);
      setTotalCount(meta?.totalElements ?? items.length);
      setPaginationModel({
        page: meta?.currentPage ?? page ?? defaultPaginationModel.page,
        pageSize: meta?.pageSize ?? size ?? defaultPaginationModel.pageSize,
      });
    } catch {
      setUsers([]);
      setTotalCount(0);
      toast.error('Không thể tải danh sách người dùng!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý người dùng - POLY CINEMAS';
    loadRoles();
    fetchUsers(defaultPaginationModel);
  }, [fetchUsers, loadRoles]);

  const reloadCurrentPage = useCallback(async () => {
    await fetchUsers({
      page: paginationModel.page,
      size: paginationModel.pageSize,
    });
  }, [fetchUsers, paginationModel.page, paginationModel.pageSize]);

  const handleOpenModal = useCallback(
    async (user = null) => {
      if (!user?.userId) {
        openPopup(
          <UserFormModal roles={roles} onSuccess={reloadCurrentPage} />
        );
        return;
      }

      try {
        const response = await findUserById(user.userId);
        const userDetail = normalizeUser(extractUserDetail(response));

        openPopup(
          <UserFormModal
            user={userDetail}
            roles={roles}
            onSuccess={reloadCurrentPage}
          />
        );
      } catch {
        toast.error('Không thể tải chi tiết người dùng!');
      }
    },
    [openPopup, reloadCurrentPage, roles]
  );

  const handleDisable = useCallback(
    async (user) => {
      const userId = user?.userId ?? '';
      const userName = user?.fullName ?? user?.email ?? `#${userId}`;
      const confirmed = window.confirm(
        `Bạn có chắc muốn vô hiệu hóa người dùng "${userName}" không?`
      );

      if (!confirmed) {
        return;
      }

      try {
        await disableUserAdmin(userId);
        toast.success('Vô hiệu hóa người dùng thành công!');
        await reloadCurrentPage();
      } catch (error) {
        if (
          error?.response?.status === 400 ||
          error?.response?.status === 404 ||
          error?.response?.status === 409
        ) {
          return toast.error(error?.response?.data?.message);
        }

        toast.error('Vô hiệu hóa người dùng thất bại!');
      }
    },
    [reloadCurrentPage]
  );

  const handlePaginationModelChange = useCallback(
    (nextModel) => {
      fetchUsers({
        page: nextModel.page,
        size: nextModel.pageSize,
      });
    },
    [fetchUsers]
  );

  const rows = useMemo(
    () =>
      users.map((user, index) => ({
        ...user,
        gridIndex: index + 1 + paginationModel.page * paginationModel.pageSize,
      })),
    [paginationModel.page, paginationModel.pageSize, users]
  );

  const summary = useMemo(() => {
    const activeCount = users.filter((user) => user.isActive).length;
    const adminCount = users.filter((user) =>
      (user.roleIds ?? []).some((roleId) =>
        ['ADMIN', 'CADMIN'].includes(roleId)
      )
    ).length;
    const customerCount = users.filter((user) =>
      (user.roleIds ?? []).includes('USER')
    ).length;

    return {
      total: totalCount,
      activeCount,
      adminCount,
      customerCount,
    };
  }, [totalCount, users]);

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
        field: 'avatar',
        headerName: 'Ảnh',
        width: 110,
        sortable: false,
        renderCell: (params) => (
          <div className="py-2">
            <ImageComponent
              src={resolveAvatarSrc(params.row?.avatar)}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover"
            />
          </div>
        ),
      },
      {
        field: 'fullName',
        headerName: 'Người dùng',
        minWidth: 260,
        flex: 1,
        renderCell: (params) => (
          <div className="py-2">
            <p className="font-semibold text-slate-800">
              {params.row?.fullName || 'Chưa cập nhật'}
            </p>
            <p className="text-xs text-slate-500">
              {params.row?.email || 'Chưa có email'}
            </p>
          </div>
        ),
      },
      {
        field: 'phoneNumber',
        headerName: 'Liên hệ',
        minWidth: 220,
        flex: 0.9,
        renderCell: (params) => (
          <div className="py-2">
            <p>{params.row?.phoneNumber || 'Chưa cập nhật'}</p>
            <p className="text-xs text-slate-500">
              {params.row?.address || 'Chưa cập nhật địa chỉ'}
            </p>
          </div>
        ),
      },
      {
        field: 'roles',
        headerName: 'Vai trò',
        minWidth: 280,
        flex: 1,
        sortable: false,
        renderCell: (params) => {
          const roleItems = params.value ?? [];

          if (roleItems.length === 0) {
            return <span className="text-slate-500">Chưa gán vai trò</span>;
          }

          return (
            <div className="flex flex-wrap gap-2 py-2">
              {roleItems.map((role) => (
                <span
                  key={role?.roleId}
                  className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700"
                >
                  {role?.name || role?.roleId}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        field: 'membershipRankName',
        headerName: 'Hạng thành viên',
        width: 160,
        renderCell: (params) => params.value || 'Chưa có',
      },
      {
        field: 'savePoint',
        headerName: 'Điểm tích lũy',
        width: 150,
        renderCell: (params) =>
          `${numberFormatter.format(Number(params.value) || 0)} điểm`,
      },
      {
        field: 'gender',
        headerName: 'Giới tính',
        width: 130,
        renderCell: (params) => genderLabelMap[params.value] ?? 'Chưa cập nhật',
      },
      {
        field: 'dateOfBirth',
        headerName: 'Ngày sinh',
        width: 140,
        renderCell: (params) => formatDate(params.value),
      },
      {
        field: 'status',
        headerName: 'Trạng thái',
        width: 160,
        renderCell: (params) => {
          const statusMeta = statusMetaMap[params.value] ?? {
            label: params.value || 'Chưa cập nhật',
            className: 'bg-slate-100 text-slate-700',
          };

          return (
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}
            >
              {statusMeta.label}
            </span>
          );
        },
      },
      {
        field: 'actions',
        headerName: 'Thao tác',
        width: 140,
        sortable: false,
        renderCell: (params) => (
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hover:cursor-pointer"
              onClick={() => handleOpenModal(params.row)}
              title="Cập nhật người dùng"
            >
              <CiEdit size={24} fill="orange" />
            </button>
            <button
              type="button"
              className="hover:cursor-pointer"
              onClick={() => handleDisable(params.row)}
              title="Vô hiệu hóa người dùng"
            >
              <MdOutlineDeleteSweep size={24} fill="red" />
            </button>
          </div>
        ),
      },
    ],
    [handleDisable, handleOpenModal]
  );

  return (
    <div>
      <CustomBreadcrumb
        items={[{ label: 'Quản lý người dùng' }]}
        title="Quản lý người dùng"
      />

      <div className="mx-5 mt-3 grid gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Tổng số tài khoản"
          value={numberFormatter.format(summary.total)}
          helper="Tổng số người dùng theo dữ liệu phân trang từ hệ thống."
          accentClass="text-slate-900"
        />
        <SummaryCard
          label="Đang hoạt động"
          value={numberFormatter.format(summary.activeCount)}
          helper="Số tài khoản đang hoạt động trên trang dữ liệu hiện tại."
          accentClass="text-emerald-600"
        />
        <SummaryCard
          label="Tài khoản quản trị"
          value={numberFormatter.format(summary.adminCount)}
          helper="Bao gồm vai trò ADMIN và CADMIN trên trang đang xem."
          accentClass="text-sky-600"
        />
        <SummaryCard
          label="Khách hàng"
          value={numberFormatter.format(summary.customerCount)}
          helper="Số tài khoản có vai trò USER trên trang đang xem."
          accentClass="text-amber-600"
        />
      </div>

      <div className="mx-5 mt-4 rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách người dùng</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý thông tin tài khoản, vai trò, điểm tích lũy và trạng thái
              hoạt động của người dùng trong hệ thống.
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
          minWidth={1620}
          rowCount={totalCount}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          getRowId={(row) => row?.userId ?? row?.id}
          loadingContent="Đang tải danh sách người dùng..."
          emptyContent="Chưa có người dùng nào"
        />
      </div>
    </div>
  );
};

export default UserPage;
