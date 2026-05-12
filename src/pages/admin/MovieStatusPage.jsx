import {
  deleteMovieStatus,
  extractMovieStatusList,
  findAllMovieStatusesAdmin,
} from '@apis/movieStatusService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import MovieStatusFormModal from '@component/admin/movie_status/MovieStatusFormModal';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'react-toastify';

const MovieStatusPage = () => {
  const { openPopup } = useModelContext();
  const [movieStatuses, setMovieStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovieStatuses = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await findAllMovieStatusesAdmin();
      setMovieStatuses(extractMovieStatusList(response));
    } catch {
      toast.error('Không thể tải danh sách trạng thái phim!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý trạng thái phim - POLY CINEMAS';
    fetchMovieStatuses();
  }, [fetchMovieStatuses]);

  const handleOpenModal = (movieStatus = null) => {
    openPopup(
      <MovieStatusFormModal movieStatus={movieStatus} onSuccess={fetchMovieStatuses} />
    );
  };

  const handleDelete = async (movieStatus) => {
    const movieStatusId = movieStatus?.statusId ?? movieStatus?.id;
    const movieStatusName = movieStatus?.name || movieStatusId;
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa trạng thái phim "${movieStatusName}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMovieStatus(movieStatusId);
      toast.success('Xóa trạng thái phim thành công!');
      await fetchMovieStatuses();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xóa trạng thái phim thất bại!');
    }
  };

  const rows = useMemo(
    () =>
      movieStatuses.map((movieStatus, index) => ({
        ...movieStatus,
        gridIndex: index + 1,
      })),
    [movieStatuses]
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
      field: 'statusId',
      headerName: 'Mã trạng thái',
      width: 160,
      renderCell: (params) => (
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-semibold text-slate-700">
          {params.value || '---'}
        </span>
      ),
    },
    {
      field: 'name',
      headerName: 'Tên trạng thái',
      flex: 1,
      minWidth: 220,
      renderCell: (params) => <span className="font-medium">{params.value}</span>,
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      flex: 1.3,
      minWidth: 320,
      renderCell: (params) => params.value?.trim() || 'Chưa có mô tả',
    },
    {
      field: 'active',
      headerName: 'Trạng thái sử dụng',
      width: 190,
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
            label: 'Quản lý trạng thái phim',
          },
        ]}
        title="Quản lý trạng thái phim"
      />

      <div className="mx-5 mt-3 rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách trạng thái phim</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý danh mục mã trạng thái dùng xuyên suốt cho phim và các màn
              hình hiển thị ngoài hệ thống.
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
          minWidth={980}
          getRowId={(row) => row?.statusId ?? row?.id}
          loadingContent="Đang tải danh sách trạng thái phim..."
          emptyContent="Chưa có trạng thái phim nào"
        />
      </div>
    </div>
  );
};

export default MovieStatusPage;
