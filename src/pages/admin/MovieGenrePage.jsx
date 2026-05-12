import { deleteGenre, extractGenreList, getAllGenre } from '@apis/genreService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import MovieGenreFormModal from '@component/admin/movie_genre/MovieGenreFormModal';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'react-toastify';

const MovieGenrePage = () => {
  const { openPopup } = useModelContext();
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGenres = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getAllGenre();
      setGenres(extractGenreList(response));
    } catch {
      toast.error('Không thể tải danh sách thể loại phim!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý thể loại phim - POLY CINEMAS';
    fetchGenres();
  }, [fetchGenres]);

  const handleOpenModal = (genre = null) => {
    openPopup(<MovieGenreFormModal genre={genre} onSuccess={fetchGenres} />);
  };

  const handleDelete = async (genre) => {
    const genreId = genre?.genresId ?? genre?.id;
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa thể loại "${genre.name}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteGenre(genreId);
      toast.success('Xóa thể loại phim thành công!');
      await fetchGenres();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xóa thể loại phim thất bại!');
    }
  };

  const rows = useMemo(
    () =>
      genres.map((genre, index) => ({
        ...genre,
        gridIndex: index + 1,
      })),
    [genres]
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
      headerName: 'Tên thể loại',
      flex: 1,
      minWidth: 240,
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
            label: 'Quản lý thể loại phim',
          },
        ]}
        title="Quản lý thể loại phim"
      />

      <div className="mx-5 mt-3 rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách thể loại phim</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý danh mục thể loại để dùng khi tạo phim và hiển thị ngoài trang khách.
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
          minWidth={960}
          getRowId={(row) => row?.genresId ?? row?.id}
          loadingContent="Đang tải danh sách thể loại phim..."
          emptyContent="Chưa có thể loại phim nào"
        />
      </div>
    </div>
  );
};

export default MovieGenrePage;
