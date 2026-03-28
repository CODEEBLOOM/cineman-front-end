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

const MovieGenrePage = () => {
  const { openPopup } = useModelContext();
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGenres = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getAllGenre();
      setGenres(extractGenreList(response));
    } catch (error) {
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

      <div className="mx-5 mt-3 overflow-auto rounded-sm bg-white px-4 py-3">
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

        <table>
          <thead>
            <tr>
              <th className="w-[8%]">STT</th>
              <th className="w-[22%] min-w-[180px]">Tên thể loại</th>
              <th className="w-[42%] min-w-[280px]">Mô tả</th>
              <th className="w-[16%] min-w-[140px]">Trạng thái</th>
              <th className="w-[12%] min-w-[120px]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5}>
                  <Loading content="Đang tải danh sách thể loại phim..." />
                </td>
              </tr>
            )}

            {!isLoading && genres.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyList content="Chưa có thể loại phim nào" />
                </td>
              </tr>
            )}

            {!isLoading &&
              genres.map((genre, index) => (
                <tr key={genre.genresId ?? genre.id}>
                  <td>{index + 1}</td>
                  <td className="font-medium">{genre.name}</td>
                  <td className="text-slate-600">
                    {genre.description?.trim() || 'Chưa có mô tả'}
                  </td>
                  <td>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        genre.active !== false
                          ? 'bg-green-100 text-green-600'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {genre.active !== false ? 'Đang áp dụng' : 'Ngừng áp dụng'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleOpenModal(genre)}
                      >
                        <CiEdit size={24} fill="orange" />
                      </button>
                      <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleDelete(genre)}
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

export default MovieGenrePage;
