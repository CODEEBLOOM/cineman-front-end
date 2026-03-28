import {
  extractMovieTheaterMappingList,
  findAllMovieTheaterMappingsByMovieId,
  normalizeMovieTheaterMapping,
} from '@apis/movieTheaterMappingService';
import { deleteMovie, findAllByFilterAdmin } from '@apis/movieService';
import EmptyList from '@component/cinema_showtime/EmptyList';
import ImageComponent from '@component/ImageComponent';
import Loading from '@component/Loading';
import { Pagination } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'react-toastify';

const MovieTable = ({ setIsEdit, setValue, setEditingMovie }) => {
  const [movies, setMovies] = useState([]);
  const [movieTheaterMap, setMovieTheaterMap] = useState({});
  const [meta, setMeta] = useState({
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pageActive, setPageActive] = useState(0);

  const handleChangePage = (_, newPage) => {
    setPageActive(newPage);
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setIsEdit(true);
    setValue(0);
  };

  const loadMovieTheaterMap = useCallback(async (movieItems) => {
    const mappingEntries = await Promise.all(
      movieItems.map(async (movie) => {
        const movieId = movie?.movieId ?? movie?.id ?? null;

        if (!movieId) {
          return null;
        }

        try {
          const response = await findAllMovieTheaterMappingsByMovieId(movieId);
          const movieTheaterNames = extractMovieTheaterMappingList(response)
            .map(normalizeMovieTheaterMapping)
            .map((mapping) => mapping.movieTheaterName)
            .filter(Boolean);

          return [String(movieId), Array.from(new Set(movieTheaterNames))];
        } catch {
          return [String(movieId), []];
        }
      })
    );

    return Object.fromEntries(mappingEntries.filter(Boolean));
  }, []);

  const loadMovies = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await findAllByFilterAdmin({
        page: pageActive > 0 ? pageActive - 1 : 0,
        size: meta.pageSize,
        status: 'ALL',
      });
      const nextMovies = response?.movies ?? response?.data?.movies ?? [];
      const nextMeta = response?.meta ?? response?.data?.meta ?? meta;

      setMovies(nextMovies);
      setMeta(nextMeta);
      setMovieTheaterMap(await loadMovieTheaterMap(nextMovies));
    } catch (error) {
      setMovies([]);
      setMovieTheaterMap({});
      toast.error('Không thể tải danh sách phim!');
    } finally {
      setIsLoading(false);
    }
  }, [loadMovieTheaterMap, meta.pageSize, pageActive]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const handleDelete = async (movie) => {
    try {
      await deleteMovie(movie.movieId);
      toast.success('Xóa phim thành công');
      await loadMovies();
    } catch (error) {
      if (error?.response?.status === 400) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xóa phim thất bại!');
    }
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
            <th className="w-[20%] min-w-[100px]">Hình ảnh</th>
            <th className="w-[20%] min-w-[200px]">Tóm tắt</th>
            <th className="w-[20%] min-w-[200px]">Người tham gia</th>
            <th className="w-[5%]">Rạp áp dụng</th>
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
              <td colSpan={11}>
                <Loading content="Đang tải danh sách phim..." />
              </td>
            </tr>
          )}
          {movies.length === 0 && !isLoading && (
            <tr>
              <td colSpan={11}>
                <EmptyList content="Danh sách phim trống" />
              </td>
            </tr>
          )}
          {movies?.map((movie, index) => {
            const movieId = movie?.movieId ?? movie?.id;
            const movieTheaters = movieTheaterMap[String(movieId)] ?? [];

            return (
              <tr key={movieId}>
                <td>
                  {index + 1 + (meta.currentPage ?? 0) * (meta.pageSize ?? 10)}
                </td>
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
                <td className="overflow-hidden">
                  <p className="whitespace-normal text-justify">
                    {movie.synopsis}
                  </p>
                </td>
                <td className="overflow-hidden">
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
                        .map((director) => director.nickname)
                        .join(', ')}
                    </span>
                  </p>
                </td>
                <td>
                  {movieTheaters.length > 0
                    ? movieTheaters.join(', ')
                    : 'Chưa gán rạp'}
                </td>
                <td>{movie.duration}</td>
                <td>{movie.language}</td>
                <td>{movie.genres.map((genre) => genre.name).join(', ')}</td>
                <td>{movie.age}</td>
                <td>{movie.releaseDate}</td>
                <td>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="hover:cursor-pointer"
                      onClick={() => handleEdit(movie)}
                    >
                      <CiEdit size={25} fill="orange" />
                    </button>
                    <button
                      type="button"
                      className="hover:cursor-pointer"
                      onClick={() => handleDelete(movie)}
                    >
                      <MdOutlineDeleteSweep size={25} fill="red" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
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
