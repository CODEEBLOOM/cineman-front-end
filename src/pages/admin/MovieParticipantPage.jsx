import {
  deleteMovieParticipant,
  extractMovieParticipantList,
  findAllMovieParticipants,
  normalizeMovieParticipant,
  resolveMovieParticipantEntityId,
} from '@apis/movieParticipantService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import MovieParticipantFormModal from '@component/admin/movie_participant/MovieParticipantFormModal';
import EmptyList from '@component/cinema_showtime/EmptyList';
import Loading from '@component/Loading';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
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

        <table>
          <thead>
            <tr>
              <th className="w-[8%]">STT</th>
              <th className="w-[34%] min-w-[240px]">Phim</th>
              <th className="w-[24%] min-w-[180px]">Người tham gia</th>
              <th className="w-[22%] min-w-[160px]">Vai trò</th>
              <th className="w-[12%] min-w-[120px]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5}>
                  <Loading content="Đang tải danh sách người tham gia phim..." />
                </td>
              </tr>
            )}

            {!isLoading && movieParticipants.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyList content="Chưa có người tham gia phim nào" />
                </td>
              </tr>
            )}

            {!isLoading &&
              movieParticipants.map((movieParticipant, index) => (
                <tr
                  key={`${movieParticipant.movieId}-${movieParticipant.participantId}-${movieParticipant.movieRoleId}-${index}`}
                >
                  <td>{index + 1}</td>
                  <td className="font-medium">{movieParticipant.movieTitle}</td>
                  <td>{movieParticipant.participantName}</td>
                  <td>{movieParticipant.movieRoleName}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className={`${
                          resolveMovieParticipantEntityId(movieParticipant)
                            ? 'hover:cursor-pointer'
                            : 'cursor-not-allowed opacity-40'
                        }`}
                        onClick={() => handleOpenModal(movieParticipant)}
                      >
                        <CiEdit size={24} fill="orange" />
                      </button>
                      <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleDelete(movieParticipant)}
                      >
                        <MdOutlineDeleteSweep size={24} fill="red" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MovieParticipantPage;
