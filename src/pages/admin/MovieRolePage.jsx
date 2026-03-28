import {
  deleteMovieRole,
  extractMovieRoleList,
  findAllMovieRolesAdmin,
} from '@apis/movieRoleService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import MovieRoleFormModal from '@component/admin/movie_role/MovieRoleFormModal';
import EmptyList from '@component/cinema_showtime/EmptyList';
import Loading from '@component/Loading';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'react-toastify';

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

      <div className="mx-5 mt-3 overflow-auto rounded-sm bg-white px-4 py-3">
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

        <table>
          <thead>
            <tr>
              <th className="w-[8%]">STT</th>
              <th className="w-[24%] min-w-[180px]">Tên vai trò</th>
              <th className="w-[40%] min-w-[280px]">Mô tả</th>
              <th className="w-[16%] min-w-[140px]">Trạng thái</th>
              <th className="w-[12%] min-w-[120px]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5}>
                  <Loading content="Đang tải danh sách vai trò phim..." />
                </td>
              </tr>
            )}

            {!isLoading && movieRoles.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyList content="Chưa có vai trò phim nào" />
                </td>
              </tr>
            )}

            {!isLoading &&
              movieRoles.map((movieRole, index) => (
                <tr key={movieRole.movieRoleId ?? movieRole.id}>
                  <td>{index + 1}</td>
                  <td className="font-medium">{movieRole.name}</td>
                  <td className="text-slate-600">
                    {movieRole.description?.trim() || 'Chưa có mô tả'}
                  </td>
                  <td>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        movieRole.active !== false
                          ? 'bg-green-100 text-green-600'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {movieRole.active !== false ? 'Đang áp dụng' : 'Ngừng áp dụng'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleOpenModal(movieRole)}
                      >
                        <CiEdit size={24} fill="orange" />
                      </button>
                      <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleDelete(movieRole)}
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

export default MovieRolePage;
