import {
  deleteMovieTheater,
  extractMovieTheaterList,
  findAllMovieTheater,
} from '@apis/movieTheaterService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import MovieTheaterFormModal from '@component/admin/movie_theater/MovieTheaterFormModal';
import EmptyList from '@component/cinema_showtime/EmptyList';
import Loading from '@component/Loading';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
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

  return (
    <div>
      <CustomBreadcrumb items={[{ label: 'Quản lý rạp' }]} title="Quản lý rạp" />

      <div className="mx-5 mt-3 overflow-auto rounded-sm bg-white px-4 py-3">
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

        <table>
          <thead>
            <tr>
              <th className="w-[8%]">STT</th>
              <th className="w-[18%] min-w-[180px]">Tên rạp</th>
              <th className="w-[24%] min-w-[220px]">Chi nhánh</th>
              <th className="w-[24%] min-w-[240px]">Địa chỉ</th>
              <th className="w-[12%] min-w-[140px]">Hotline</th>
              <th className="w-[8%] min-w-[100px]">Phòng</th>
              <th className="w-[14%] min-w-[120px]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7}>
                  <Loading content="Đang tải danh sách rạp..." />
                </td>
              </tr>
            )}

            {!isLoading && movieTheaters.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyList content="Chưa có rạp nào" />
                </td>
              </tr>
            )}

            {!isLoading &&
              movieTheaters.map((movieTheater, index) => {
                const movieTheaterId = movieTheater?.movieTheaterId ?? movieTheater?.id;

                return (
                  <tr key={movieTheaterId}>
                    <td>{index + 1}</td>
                    <td className="font-medium">{movieTheater?.name || 'Chưa có tên'}</td>
                    <td>{movieTheater?.province?.name || 'Chưa gắn chi nhánh'}</td>
                    <td className="text-slate-600">{movieTheater?.address || 'Chưa có địa chỉ'}</td>
                    <td>{movieTheater?.hotline || 'Chưa có hotline'}</td>
                    <td>{movieTheater?.numbersOfCinemaTheater ?? movieTheater?.cinemaTheaters?.length ?? 0}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="hover:cursor-pointer"
                          onClick={() => handleOpenModal(movieTheater)}
                        >
                          <CiEdit size={24} fill="orange" />
                        </button>
                        <button
                          type="button"
                          className="hover:cursor-pointer"
                          onClick={() => handleDelete(movieTheater)}
                        >
                          <MdOutlineDeleteSweep size={24} fill="red" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MovieTheaterPage;