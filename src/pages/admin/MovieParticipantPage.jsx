import {
  deleteMovieParticipant,
  extractMovieParticipantList,
  findAllMovieParticipants,
  normalizeMovieParticipant,
  resolveMovieParticipantEntityId,
} from '@apis/movieParticipantService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import MovieParticipantFormModal from '@component/admin/movie_participant/MovieParticipantFormModal';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'react-toastify';

const MovieParticipantPage = () => {
  const { openPopup } = useModelContext();
  const [movieParticipants, setMovieParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovieParticipants = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await findAllMovieParticipants();
      setMovieParticipants(
        extractMovieParticipantList(response).map(normalizeMovieParticipant)
      );
    } catch {
      toast.error('Không thể tải danh sách người tham gia phim!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý người tham gia phim - POLY CINEMAS';
    fetchMovieParticipants();
  }, [fetchMovieParticipants]);

  const handleOpenModal = (movieParticipant = null) => {
    if (movieParticipant && !resolveMovieParticipantEntityId(movieParticipant)) {
      toast.info('Bản ghi này chưa có id cập nhật từ backend. Bạn có thể xóa và tạo lại.');
      return;
    }

    openPopup(
      <MovieParticipantFormModal
        movieParticipant={movieParticipant}
        onSuccess={fetchMovieParticipants}
      />
    );
  };

  const handleDelete = async (movieParticipant) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn gỡ "${movieParticipant.participantName}" khỏi phim "${movieParticipant.movieTitle}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMovieParticipant(
        movieParticipant.movieId,
        movieParticipant.participantId
      );
      toast.success('Xóa người tham gia phim thành công!');
      await fetchMovieParticipants();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xóa người tham gia phim thất bại!');
    }
  };

  const rows = useMemo(
    () =>
      movieParticipants.map((movieParticipant, index) => ({
        ...movieParticipant,
        gridIndex: index + 1,
        gridId: `${movieParticipant.movieId}-${movieParticipant.participantId}-${movieParticipant.movieRoleId}-${index}`,
      })),
    [movieParticipants]
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
      field: 'movieTitle',
      headerName: 'Phim',
      flex: 1.2,
      minWidth: 260,
      renderCell: (params) => (
        <span className="font-medium">{params.value || 'Chưa có tên phim'}</span>
      ),
    },
    {
      field: 'participantName',
      headerName: 'Người tham gia',
      flex: 1,
      minWidth: 220,
      renderCell: (params) => params.value || 'Chưa có người tham gia',
    },
    {
      field: 'movieRoleName',
      headerName: 'Vai trò',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => params.value || 'Chưa có vai trò',
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const isEditable = Boolean(resolveMovieParticipantEntityId(params.row));

        return (
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={isEditable ? 'hover:cursor-pointer' : 'cursor-not-allowed opacity-40'}
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
        );
      },
    },
  ];

  return (
    <div>
      <CustomBreadcrumb
        items={[
          {
            label: 'Quản lý người tham gia phim',
          },
        ]}
        title="Quản lý người tham gia phim"
      />

      <div className="mx-5 mt-3 overflow-auto rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách người tham gia phim</h2>
            <p className="mt-1 text-sm text-slate-500">
              Dùng để gắn participant với một bộ phim theo vai trò tương ứng.
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
          getRowId={(row) => row.gridId}
          loadingContent="Đang tải danh sách người tham gia phim..."
          emptyContent="Chưa có người tham gia phim nào"
        />
      </div>
    </div>
  );
};

export default MovieParticipantPage;
