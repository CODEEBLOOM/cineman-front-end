import {
  deleteMovieTheater,
  extractMovieTheaterList,
  findAllMovieTheater,
} from '@apis/movieTheaterService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import MovieTheaterFormModal from '@component/admin/movie_theater/MovieTheaterFormModal';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'react-toastify';

const MovieTheaterPage = () => {
  const { openPopup } = useModelContext();
  const [movieTheaters, setMovieTheaters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovieTheaters = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await findAllMovieTheater({ page: 0, size: 1000 });
      setMovieTheaters(extractMovieTheaterList(response));
    } catch {
      toast.error('Không thể tải danh sách rạp!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý rạp - POLY CINEMAS';
    fetchMovieTheaters();
  }, [fetchMovieTheaters]);

  const handleOpenModal = (movieTheater = null) => {
    openPopup(
      <MovieTheaterFormModal movieTheater={movieTheater} onSuccess={fetchMovieTheaters} />
    );
  };

  const handleDelete = async (movieTheater) => {
    const movieTheaterId = movieTheater?.movieTheaterId ?? movieTheater?.id;
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa rạp "${movieTheater?.name ?? ''}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMovieTheater(movieTheaterId);
      toast.success('Xóa rạp thành công!');
      await fetchMovieTheaters();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xóa rạp thất bại!');
    }
  };

  const rows = useMemo(
    () =>
      movieTheaters.map((movieTheater, index) => ({
        ...movieTheater,
        gridIndex: index + 1,
      })),
    [movieTheaters]
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
      headerName: 'Tên rạp',
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <span className="font-medium">{params.value || 'Chưa có tên'}</span>
      ),
    },
    {
      field: 'province',
      headerName: 'Chi nhánh',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => params.value?.name || 'Chưa gắn chi nhánh',
    },
    {
      field: 'address',
      headerName: 'Địa chỉ',
      flex: 1.2,
      minWidth: 260,
      renderCell: (params) => params.value || 'Chưa có địa chỉ',
    },
    {
      field: 'hotline',
      headerName: 'Hotline',
      width: 160,
      renderCell: (params) => params.value || 'Chưa có hotline',
    },
    {
      field: 'numbersOfCinemaTheater',
      headerName: 'Phòng',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) =>
        params.row?.numbersOfCinemaTheater ?? params.row?.cinemaTheaters?.length ?? 0,
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
      <CustomBreadcrumb items={[{ label: 'Quản lý rạp' }]} title="Quản lý rạp" />

      <div className="mx-5 mt-3 rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách rạp</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý địa chỉ, hotline, bản đồ nhúng và số phòng chiếu của từng rạp trong hệ thống.
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
          minWidth={1200}
          getRowId={(row) => row?.movieTheaterId ?? row?.id}
          loadingContent="Đang tải danh sách rạp..."
          emptyContent="Chưa có rạp nào"
        />
      </div>
    </div>
  );
};

export default MovieTheaterPage;
