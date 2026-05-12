import {
  deletePermission,
  extractPermissionDetail,
  extractPermissionList,
  extractPermissionMeta,
  findAllPermissionsAdmin,
  findPermissionById,
  findPermissionsAdmin,
  normalizePermission,
} from '@apis/permissionService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import PermissionFormModal from '@component/admin/permission/PermissionFormModal';
import { useModelContext } from '@context/ModalContext';
import { Alert, Button, MenuItem, Stack, TextField } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import {
  MdAddCircleOutline,
  MdFilterAltOff,
  MdOutlineDeleteSweep,
  MdOutlineRefresh,
  MdSecurity,
} from 'react-icons/md';
import { toast } from 'sonner';

const defaultFilters = {
  category: '',
  method: '',
  title: '',
  url: '',
  keyword: '',
};

const defaultPaginationModel = {
  page: 0,
  pageSize: 10,
};

const methodColorMap = {
  GET: 'bg-emerald-50 text-emerald-700',
  POST: 'bg-sky-50 text-sky-700',
  PUT: 'bg-amber-50 text-amber-700',
  PATCH: 'bg-violet-50 text-violet-700',
  DELETE: 'bg-rose-50 text-rose-700',
};

const numberFormatter = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
});

const SummaryCard = ({ label, value, helper, accentClass }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`mt-2 text-2xl font-bold ${accentClass}`}>{value}</p>
    <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
  </div>
);

const sanitizeFilters = (filters) => ({
  category: String(filters?.category ?? '').trim(),
  method: String(filters?.method ?? '')
    .trim()
    .toUpperCase(),
  title: String(filters?.title ?? '').trim(),
  url: String(filters?.url ?? '').trim(),
  keyword: String(filters?.keyword ?? '').trim(),
});

const PermissionPage = () => {
  const { openPopup } = useModelContext();
  const [permissions, setPermissions] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    methods: [],
  });
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [paginationModel, setPaginationModel] = useState(defaultPaginationModel);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  const loadFilterOptions = useCallback(async () => {
    try {
      const response = await findAllPermissionsAdmin();
      const allPermissions = extractPermissionList(response).map(normalizePermission);
      const categories = Array.from(
        new Set(
          allPermissions
            .map((permission) => permission.category)
            .filter((category) => String(category ?? '').trim())
        )
      ).sort((left, right) => left.localeCompare(right, 'vi'));
      const methods = Array.from(
        new Set(
          allPermissions
            .map((permission) => permission.method)
            .filter((method) => String(method ?? '').trim())
        )
      ).sort((left, right) => left.localeCompare(right, 'vi'));

      setFilterOptions({ categories, methods });
    } catch {
      setFilterOptions({
        categories: [],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      });
    }
  }, []);

  const fetchPermissions = useCallback(async ({ filters, page, size }) => {
    setIsLoading(true);

    try {
      const response = await findPermissionsAdmin({
        ...filters,
        page,
        size,
      });
      const nextPermissions = extractPermissionList(response)
        .map(normalizePermission)
        .filter((permission) => permission.id)
        .sort((left, right) => left.title.localeCompare(right.title, 'vi'));
      const meta = extractPermissionMeta(response);

      setPermissions(nextPermissions);
      setTotalCount(meta?.totalElements ?? nextPermissions.length);
      setPaginationModel({
        page: meta?.currentPage ?? page ?? defaultPaginationModel.page,
        pageSize: meta?.pageSize ?? size ?? defaultPaginationModel.pageSize,
      });
      setIsFallbackMode(Boolean(response?.fallback));
    } catch {
      setPermissions([]);
      setTotalCount(0);
      setIsFallbackMode(false);
      toast.error('Không thể tải danh sách quyền hạn!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshPermissionData = useCallback(
    async ({
      filters = appliedFilters,
      page = paginationModel.page,
      size = paginationModel.pageSize,
    } = {}) => {
      await Promise.all([
        loadFilterOptions(),
        fetchPermissions({
          filters,
          page,
          size,
        }),
      ]);
    },
    [
      appliedFilters,
      fetchPermissions,
      loadFilterOptions,
      paginationModel.page,
      paginationModel.pageSize,
    ]
  );

  useEffect(() => {
    document.title = 'Quản lý quyền hạn - POLY CINEMAS';
    loadFilterOptions();
    fetchPermissions({
      filters: defaultFilters,
      page: defaultPaginationModel.page,
      size: defaultPaginationModel.pageSize,
    });
  }, [fetchPermissions, loadFilterOptions]);

  const handleFilterFieldChange = useCallback((event) => {
    const { name, value } = event.target;

    setDraftFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value,
    }));
  }, []);

  const handleApplyFilters = useCallback(
    (event) => {
      event?.preventDefault?.();

      const nextFilters = sanitizeFilters(draftFilters);

      setDraftFilters(nextFilters);
      setAppliedFilters(nextFilters);
      fetchPermissions({
        filters: nextFilters,
        page: 0,
        size: paginationModel.pageSize,
      });
    },
    [draftFilters, fetchPermissions, paginationModel.pageSize]
  );

  const handleResetFilters = useCallback(() => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    fetchPermissions({
      filters: defaultFilters,
      page: 0,
      size: paginationModel.pageSize,
    });
  }, [fetchPermissions, paginationModel.pageSize]);

  const handleRefresh = useCallback(() => {
    refreshPermissionData();
  }, [refreshPermissionData]);

  const handlePaginationModelChange = useCallback(
    (nextModel) => {
      fetchPermissions({
        filters: appliedFilters,
        page: nextModel.page,
        size: nextModel.pageSize,
      });
    },
    [appliedFilters, fetchPermissions]
  );

  const handleOpenModal = useCallback(
    async (permission = null) => {
      if (!permission?.id) {
        openPopup(
          <PermissionFormModal
            onSuccess={() => refreshPermissionData()}
          />
        );
        return;
      }

      let permissionDetail = permission;

      try {
        const response = await findPermissionById(permission.id);
        const extractedPermission = extractPermissionDetail(response);

        if (extractedPermission) {
          permissionDetail = normalizePermission(extractedPermission);
        }
      } catch {
        toast.warning('Không thể tải chi tiết quyền hạn, đang dùng dữ liệu hiện có.');
      }

      openPopup(
        <PermissionFormModal
          permission={permissionDetail}
          onSuccess={() => refreshPermissionData()}
        />
      );
    },
    [openPopup, refreshPermissionData]
  );

  const handleDelete = useCallback(
    async (permission) => {
      const permissionId = permission?.id ?? permission?.permissionId;
      const permissionLabel = permission?.title ?? `#${permissionId}`;
      const confirmed = window.confirm(
        `Bạn có chắc muốn xóa quyền hạn "${permissionLabel}" không?`
      );

      if (!confirmed) {
        return;
      }

      try {
        await deletePermission(permissionId);
        toast.success('Xóa quyền hạn thành công!');

        const nextPage =
          permissions.length === 1 && paginationModel.page > 0
            ? paginationModel.page - 1
            : paginationModel.page;

        await refreshPermissionData({
          page: nextPage,
        });
      } catch (error) {
        if (
          error?.response?.status === 400 ||
          error?.response?.status === 404 ||
          error?.response?.status === 409
        ) {
          return toast.error(error?.response?.data?.message);
        }

        toast.error('Xóa quyền hạn thất bại!');
      }
    },
    [paginationModel.page, permissions.length, refreshPermissionData]
  );

  const rows = useMemo(
    () =>
      permissions.map((permission, index) => ({
        ...permission,
        gridIndex: index + 1 + paginationModel.page * paginationModel.pageSize,
      })),
    [paginationModel.page, paginationModel.pageSize, permissions]
  );

  const summary = useMemo(() => {
    const categoriesOnPage = new Set(
      permissions.map((permission) => permission.category).filter(Boolean)
    ).size;
    const methodsOnPage = new Set(
      permissions.map((permission) => permission.method).filter(Boolean)
    ).size;
    const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;

    return {
      total: totalCount,
      categoriesOnPage,
      methodsOnPage,
      activeFilterCount,
    };
  }, [appliedFilters, permissions, totalCount]);

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
        field: 'category',
        headerName: 'Loại quyền',
        minWidth: 180,
        flex: 0.8,
        renderCell: (params) =>
          params.value ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {params.value}
            </span>
          ) : (
            <span className="text-slate-400">Chưa phân loại</span>
          ),
      },
      {
        field: 'method',
        headerName: 'Method',
        width: 130,
        renderCell: (params) => {
          const method = params.value || 'N/A';
          const className = methodColorMap[params.value] ?? 'bg-slate-100 text-slate-700';

          return (
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>
              {method}
            </span>
          );
        },
      },
      {
        field: 'title',
        headerName: 'Tên quyền',
        minWidth: 260,
        flex: 1,
        renderCell: (params) => (
          <span className="font-semibold text-slate-800">
            {params.value || 'Chưa có tiêu đề'}
          </span>
        ),
      },
      {
        field: 'url',
        headerName: 'API URL',
        minWidth: 340,
        flex: 1.2,
        renderCell: (params) => (
          <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
            {params.value || 'Chưa có URL'}
          </code>
        ),
      },
      {
        field: 'description',
        headerName: 'Mô tả',
        minWidth: 300,
        flex: 1.1,
        renderCell: (params) => params.value?.trim() || 'Chưa có mô tả',
      },
      {
        field: 'actions',
        headerName: 'Thao tác',
        width: 150,
        sortable: false,
        renderCell: (params) => (
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hover:cursor-pointer"
              onClick={() => handleOpenModal(params.row)}
              title="Cập nhật quyền hạn"
            >
              <CiEdit size={24} fill="orange" />
            </button>
            <button
              type="button"
              className="hover:cursor-pointer"
              onClick={() => handleDelete(params.row)}
              title="Xóa quyền hạn"
            >
              <MdOutlineDeleteSweep size={24} fill="red" />
            </button>
          </div>
        ),
      },
    ],
    [handleDelete, handleOpenModal]
  );

  return (
    <div>
      <CustomBreadcrumb
        items={[{ label: 'Quản lý quyền hạn' }]}
        title="Quản lý quyền hạn"
      />

      <div className="mx-5 mt-3 grid gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Tổng số quyền"
          value={numberFormatter.format(summary.total)}
          helper="Tổng số permission theo dữ liệu trả về từ backend hoặc cơ chế fallback ở client."
          accentClass="text-slate-900"
        />
        <SummaryCard
          label="Loại trên trang"
          value={numberFormatter.format(summary.categoriesOnPage)}
          helper="Số nhóm quyền đang xuất hiện trên trang dữ liệu hiện tại."
          accentClass="text-sky-600"
        />
        <SummaryCard
          label="Method trên trang"
          value={numberFormatter.format(summary.methodsOnPage)}
          helper="Cho biết danh sách hiện tại đang phủ bao nhiêu HTTP method."
          accentClass="text-emerald-600"
        />
        <SummaryCard
          label="Bộ lọc đang dùng"
          value={numberFormatter.format(summary.activeFilterCount)}
          helper="Đếm số tiêu chí lọc đang áp dụng để dễ kiểm tra trạng thái tìm kiếm."
          accentClass="text-amber-600"
        />
      </div>

      <div className="mx-5 mt-4 rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex flex-col gap-4 border-b pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Danh sách quyền hạn</h2>
              <p className="mt-1 text-sm text-slate-500">
                Theo dõi permission theo nhóm, method và endpoint để phục vụ phân quyền quản trị.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outlined"
                startIcon={<MdOutlineRefresh size={18} />}
                onClick={handleRefresh}
              >
                Tải lại
              </Button>
              <Button
                variant="contained"
                startIcon={<MdAddCircleOutline size={18} />}
                onClick={() => handleOpenModal()}
              >
                Tạo mới
              </Button>
            </div>
          </div>

          {isFallbackMode ? (
            <Alert severity="info">
              Backend local chưa trả dữ liệu phân trang ổn định cho `GET /admin/permissions`, trang
              đang fallback về `/admin/permissions/all` rồi lọc và phân trang phía client.
            </Alert>
          ) : null}

          <form onSubmit={handleApplyFilters}>
            <Stack spacing={2}>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <TextField
                  select
                  size="small"
                  label="Loại quyền"
                  name="category"
                  value={draftFilters.category}
                  onChange={handleFilterFieldChange}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {filterOptions.categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  size="small"
                  label="Method"
                  name="method"
                  value={draftFilters.method}
                  onChange={handleFilterFieldChange}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {(filterOptions.methods.length > 0
                    ? filterOptions.methods
                    : ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
                  ).map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  size="small"
                  label="Tên quyền"
                  name="title"
                  value={draftFilters.title}
                  onChange={handleFilterFieldChange}
                  placeholder="Ví dụ: Xem danh sách quyền hạn"
                />

                <TextField
                  size="small"
                  label="API URL"
                  name="url"
                  value={draftFilters.url}
                  onChange={handleFilterFieldChange}
                  placeholder="Ví dụ: /admin/permissions"
                />

                <TextField
                  size="small"
                  label="Từ khóa"
                  name="keyword"
                  value={draftFilters.keyword}
                  onChange={handleFilterFieldChange}
                  placeholder="Tìm trên title, mô tả, url..."
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<MdSecurity size={18} />}
                >
                  Áp dụng bộ lọc
                </Button>
                <Button
                  type="button"
                  variant="text"
                  startIcon={<MdFilterAltOff size={18} />}
                  onClick={handleResetFilters}
                >
                  Xóa lọc
                </Button>
              </div>
            </Stack>
          </form>
        </div>

        <DataGridTable
          rows={rows}
          columns={columns}
          loading={isLoading}
          minWidth={1520}
          rowCount={totalCount}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          getRowId={(row) => row?.id ?? row?.permissionId}
          loadingContent="Đang tải danh sách quyền hạn..."
          emptyContent="Chưa có quyền hạn nào"
        />
      </div>
    </div>
  );
};

export default PermissionPage;
