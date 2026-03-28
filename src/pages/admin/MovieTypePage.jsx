import { deleteGenre, extractGenreList, getAllGenre } from '@apis/genreService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import MovieGenreFormModal from '@component/admin/movie_genre/MovieGenreFormModal';
import EmptyList from '@component/cinema_showtime/EmptyList';
import Loading from '@component/Loading';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'react-toastify';

const MovieTypePage = () => {
  const { openPopup } = useModelContext();
  const [movieTypes, setMovieTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovieTypes = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getAllGenre();
      setMovieTypes(extractGenreList(response));
    } catch {
      toast.error('Không thể tải danh sách thể loại phim!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý thể loại phim - POLY CINEMAS';
    fetchMovieTypes();
  }, [fetchMovieTypes]);

  const handleOpenModal = (movieType = null) => {
    openPopup(
      <MovieGenreFormModal genre={movieType} onSuccess={fetchMovieTypes} />
    );
  };

  const handleDelete = async (movieType) => {
    const movieTypeId = movieType?.genresId ?? movieType?.id;
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa thể loại phim "${movieType?.name}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteGenre(movieTypeId);
      toast.success('Xóa thể loại phim thành công!');
      await fetchMovieTypes();
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

  return (
    <div>
      <CustomBreadcrumb
        items={[{ label: 'Quản lý thể loại phim' }]}
        title="Quản lý thể loại phim"
      />

      <div className="mx-5 mt-3 overflow-auto rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách thể loại phim</h2>
            <p className="mt-1 text-sm text-slate-500">
              Thể loại phim đang dùng chung dữ liệu với thể loại phim để hỗ trợ
              tên màn hình cũ.
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
              <th className="w-[22%] min-w-[180px]">Tên thể loại phim</th>
              <th className="w-[42%] min-w-[280px]">Mô tả</th>
              <th className="w-[16%] min-w-[140px]">Trạng thái</th>
              <th className="w-[12%] min-w-[120px]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5}>
                  <Loading content="Đang tải danh sách loại phim..." />
                </td>
              </tr>
            )}

            {!isLoading && movieTypes.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyList content="Chưa có loại phim nào" />
                </td>
              </tr>
            )}

            {!isLoading &&
              movieTypes.map((movieType, index) => (
                <tr key={movieType.genresId ?? movieType.id}>
                  <td>{index + 1}</td>
                  <td className="font-medium">{movieType.name}</td>
                  <td className="text-slate-600">
                    {movieType.description?.trim() || 'Chưa có mô tả'}
                  </td>
                  <td>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        movieType.active !== false
                          ? 'bg-green-100 text-green-600'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {movieType.active !== false
                        ? 'Đang áp dụng'
                        : 'Ngừng áp dụng'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleOpenModal(movieType)}
                      >
                        <CiEdit size={24} fill="orange" />
                      </button>
                      <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleDelete(movieType)}
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

export default MovieTypePage;
