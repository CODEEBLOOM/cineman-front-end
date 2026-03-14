import { deleteMovie, findAllByFilterAdmin } from '@apis/movieService';
import EmptyList from '@component/cinema_showtime/EmptyList';
import ImageComponent from '@component/ImageComponent';
import Loading from '@component/Loading';
import { Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'react-toastify';

const MovieTable = ({ setIsEdit, setValue, setEditingMovie }) => {
  const [movies, setMovies] = useState([]);
  const [meta, setMeta] = useState({
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pageActive, setPageActive] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPageActive(newPage);
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setIsEdit(true);
    setValue(0);
  };

  useEffect(() => {
    setIsLoading(true);
    findAllByFilterAdmin({
      page: pageActive > 0 ? pageActive - 1 : 0,
      size: meta.pageSize,
      status: 'ALL',
    })
      .then((res) => {
        setMovies(res?.data?.movies);
        setMeta(res?.data?.meta);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [pageActive]);

  const handleDelete = (movie) => {
    // Xóa phim
    deleteMovie(movie.movieId)
      .then((res) => {
        toast.success('Xóa phim thành công');
        findAllByFilterAdmin({
          page: pageActive > 0 ? pageActive - 1 : 0,
          size: meta.pageSize,
          status: 'ALL',
        })
          .then((res) => {
            setMovies(res?.data?.movies);
            setMeta(res?.data?.meta);
          })
          .catch((err) => console.log(err))
          .finally(() => setIsLoading(false));
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          return toast.error(err?.response?.data?.message);
        }
        toast.error('Xóa phim thất bại !');
      });
  };

  return (
    <div className="overflow-auto">
      <div>
        <h2 className="mb-2 text-[18px] font-semibold">Danh sách phim</h2>
      </div>
      <table className="mb-3">
        <thead>
          <tr>
            <th className="w-[5%]">STT</th>
            <th className="w-[20%] min-w-[100px]">Hình ảnh</th>
            <th className="w-[20% min-w-[200px]">Tóm tắt</th>
            <th className="w-[20%] min-w-[200px]">Người tham gia</th>
            <th className="w-[5%]">Thời lượng</th>
            <th className="w-[5%]">Ngôn ngữ</th>
            <th className="w-[5%]">Thể loại</th>
            <th className="w-[5%]">Giới hạn tuổi</th>
            <th className="w-[5%]">Ngày phát hành</th>
            <th className="w-[10%]">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={10}>
                <Loading content="Loading ..." />
              </td>
            </tr>
          )}
          {movies.length === 0 && !isLoading && (
            <tr>
              <td colSpan={10}>
                <EmptyList content="Danh sách phim trống" />
              </td>
            </tr>
          )}
          {movies?.map((movie, index) => (
            <tr key={movie.movieId}>
              <td>{index + 1}</td>
              <td>
                <div>
                  <ImageComponent
                    src={movie.posterImage}
                    alt="Film Image"
                    className="h-[200px] min-w-[150px] object-cover"
                    width={170}
                    height={200}
                  />
                </div>
              </td>
              <td className="min-w-[100px]: overflow-hidden">
                <div>
                  <p className="whitespace-normal text-justify">
                    {movie.synopsis}
                  </p>
                </div>
              </td>
              <td className="overflow-hidden">
                <div>
                  <p className="whitespace-normal">
                    <span className="font-semibold">Diễn viên: </span>
                    <span>
                      {(movie.casts || [])
                        .map((cast) => cast.nickname)
                        .join(', ')}
                    </span>
                  </p>
                  <p className="whitespace-normal">
                    <span className="font-semibold">Đạo diễn: </span>
                    <span>
                      {(movie.directors || [])
                        .map((cast) => cast.nickname)
                        .join(', ')}
                    </span>
                  </p>
                </div>
              </td>
              <td>{movie.duration}</td>
              <td>{movie.language}</td>
              <td>{movie.genres.map((genre) => genre.name).join(', ')}</td>
              <td>{movie.age}</td>
              <td>{movie.releaseDate}</td>
              <td>
                <div className="flex gap-3">
                  <div
                    className="hover:cursor-pointer"
                    onClick={() => handleEdit(movie)}
                  >
                    <CiEdit size={25} fill="orange" />
                  </div>
                  <div
                    className="hover:cursor-pointer"
                    onClick={() => handleDelete(movie)}
                  >
                    <MdOutlineDeleteSweep size={25} fill="red" />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        onChange={handleChangePage}
        sx={{ justifyContent: 'center', display: 'flex' }}
        size="large"
        count={meta.totalPages || 0}
        page={meta.currentPage + 1}
        variant="outlined"
        shape="rounded"
        color="primary"
      />
    </div>
  );
};
export default MovieTable;
