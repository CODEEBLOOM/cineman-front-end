import {
  deleteMovieVariation,
  extractMovieVariationList,
  findAllMovieVariationsAdmin,
} from '@apis/movieVariationService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import MovieVariationFormModal from '@component/admin/movie_variation/MovieVariationFormModal';
import EmptyList from '@component/cinema_showtime/EmptyList';
import Loading from '@component/Loading';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'react-toastify';

const MovieVariationPage = () => {
  const { openPopup } = useModelContext();
  const [movieVariations, setMovieVariations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovieVariations = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await findAllMovieVariationsAdmin();
      setMovieVariations(extractMovieVariationList(response));
    } catch (error) {
      toast.error('Không thể tải danh sách biến thể suất chiếu!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý biến thể suất chiếu - POLY CINEMAS';
    fetchMovieVariations();
  }, [fetchMovieVariations]);

  const handleOpenModal = (movieVariation = null) => {
    openPopup(
      <MovieVariationFormModal
        movieVariation={movieVariation}
        onSuccess={fetchMovieVariations}
      />
    );
  };

  const handleDelete = async (movieVariation) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa biến thể "${movieVariation.name}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMovieVariation(movieVariation.id);
      toast.success('Xóa biến thể suất chiếu thành công!');
      await fetchMovieVariations();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xóa biến thể suất chiếu thất bại!');
    }
  };

  return (
    <div>
      <CustomBreadcrumb
        items={[
          {
            label: 'Quản lý biến thể suất chiếu',
          },
        ]}
        title="Quản lý biến thể suất chiếu"
      />

      <div className="mx-5 mt-3 overflow-auto rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách biến thể suất chiếu</h2>
            <p className="mt-1 text-sm text-slate-500">
              Danh mục này được dùng trực tiếp khi tạo suất chiếu trong admin.
            </p>
          </div>

          <Button variant="contained" onClick={() => handleOpenModal()}>
            Tạo mới
          </Button>
        </div>

        <table>
          <thead>
            <tr>
              <th className="w-[10%]">STT</th>
              <th className="w-[50%] min-w-[220px]">Tên biến thể</th>
              <th className="w-[20%] min-w-[140px]">Trạng thái</th>
              <th className="w-[20%] min-w-[120px]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4}>
                  <Loading content="Đang tải danh sách biến thể..." />
                </td>
              </tr>
            )}

            {!isLoading && movieVariations.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <EmptyList content="Chưa có biến thể suất chiếu nào" />
                </td>
              </tr>
            )}

            {!isLoading &&
              movieVariations.map((movieVariation, index) => (
                <tr key={movieVariation.id}>
                  <td>{index + 1}</td>
                  <td className="font-medium">{movieVariation.name}</td>
                  <td>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        movieVariation.status !== false
                          ? 'bg-green-100 text-green-600'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {movieVariation.status !== false ? 'Đang áp dụng' : 'Ngừng áp dụng'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleOpenModal(movieVariation)}
                      >
                        <CiEdit size={24} fill="orange" />
                      </button>
                      <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleDelete(movieVariation)}
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

export default MovieVariationPage;
