import {
  deleteMovieRole,
  extractMovieRoleList,
  findAllMovieRolesAdmin,
} from '@apis/movieRoleService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import MovieRoleFormModal from '@component/admin/movie_role/MovieRoleFormModal';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'sonner';

const MovieRolePage = () => {
  const { openPopup } = useModelContext();
  const [movieRoles, setMovieRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovieRoles = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await findAllMovieRolesAdmin();
      setMovieRoles(extractMovieRoleList(response));
    } catch {
      toast.error('Không thể tải danh sách vai trò phim!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý vai trò phim - POLY CINEMAS';
    fetchMovieRoles();
  }, [fetchMovieRoles]);

  const handleOpenModal = (movieRole = null) => {
    openPopup(<MovieRoleFormModal movieRole={movieRole} onSuccess={fetchMovieRoles} />);
  };

  const handleDelete = async (movieRole) => {
    const movieRoleId = movieRole?.movieRoleId ?? movieRole?.id;
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa vai trò "${movieRole.name}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMovieRole(movieRoleId);
      toast.success('Xóa vai trò phim thành công!');
      await fetchMovieRoles();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xóa vai trò phim thất bại!');
    }
  };

  const rows = useMemo(
    () =>
      movieRoles.map((movieRole, index) => ({
        ...movieRole,
        gridIndex: index + 1,
      })),
    [movieRoles]
  );

  const columns = [
    {
      field: 'gridIndex',
      headerName: 'STT',
      width: 90,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'name',
      headerName: 'Tên vai trò',
      flex: 1,
      minWidth: 220,
      renderCell: (params) => <span className="font-medium">{params.value}</span>,
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      flex: 1.4,
      minWidth: 320,
      renderCell: (params) => params.value?.trim() || 'Chưa có mô tả',
    },
    {
      field: 'active',
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
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hover:cursor-pointer"
            onClick={() => handleOpenModal(params.row)}
          >
            <CiEdit size={24} fill="orange" />
          </button>
          <button
            type="button"
            className="hover:cursor-pointer"
            onClick={() => handleDelete(params.row)}
          >
            <MdOutlineDeleteSweep size={24} fill="red" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <CustomBreadcrumb
        items={[
          {
            label: 'Quản lý vai trò phim',
          },
        ]}
        title="Quản lý vai trò phim"
      />

      <div className="mx-5 mt-3 rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách vai trò phim</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý danh mục vai trò dùng khi gắn participant vào từng bộ phim.
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
          minWidth={940}
          getRowId={(row) => row?.movieRoleId ?? row?.id}
          loadingContent="Đang tải danh sách vai trò phim..."
          emptyContent="Chưa có vai trò phim nào"
        />
      </div>
    </div>
  );
};

export default MovieRolePage;
