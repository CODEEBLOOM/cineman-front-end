import {
  extractMovieTheaterMappingList,
  findAllMovieTheaterMappingsByMovieId,
  normalizeMovieTheaterMapping,
} from '@apis/movieTheaterMappingService';
import { deleteMovie, findAllByFilterAdmin } from '@apis/movieService';
import DataGridTable from '@component/DataGridTable';
import ImageComponent from '@component/ImageComponent';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = useState(false);

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
        page: paginationModel.page,
        size: paginationModel.pageSize,
        status: 'ALL',
      });
      const nextMovies = response?.movies ?? response?.data?.movies ?? [];
      const nextMeta = response?.meta ?? response?.data?.meta ?? {
        currentPage: paginationModel.page,
        pageSize: paginationModel.pageSize,
        totalPages: 0,
        totalElements: 0,
      };

      setMovies(nextMovies);
      setMeta(nextMeta);
      setMovieTheaterMap(await loadMovieTheaterMap(nextMovies));
    } catch {
      setMovies([]);
      setMovieTheaterMap({});
      toast.error('Không thể tải danh sách phim!');
    } finally {
      setIsLoading(false);
    }
  }, [loadMovieTheaterMap, paginationModel.page, paginationModel.pageSize]);

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

  const rows = useMemo(
    () =>
      movies.map((movie, index) => {
        const movieId = movie?.movieId ?? movie?.id;

        return {
          ...movie,
          gridIndex: index + 1 + paginationModel.page * paginationModel.pageSize,
          movieTheatersDisplay:
            movieTheaterMap[String(movieId)]?.length > 0
              ? movieTheaterMap[String(movieId)].join(', ')
              : 'Chưa gán rạp',
          castsDisplay: (movie.casts || []).map((cast) => cast.nickname).join(', '),
          directorsDisplay: (movie.directors || []).map((director) => director.nickname).join(', '),
          genresDisplay: (movie.genres || []).map((genre) => genre.name).join(', '),
        };
      }),
    [movieTheaterMap, movies, paginationModel.page, paginationModel.pageSize]
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
      field: 'posterImage',
      headerName: 'Hình ảnh',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <div className="py-3">
          <ImageComponent
            src={params.value}
            alt="Film Image"
            className="h-[200px] min-w-[150px] object-cover"
            width={150}
            height={200}
          />
        </div>
      ),
    },
    {
      field: 'synopsis',
      headerName: 'Tóm tắt',
      flex: 1.2,
      minWidth: 280,
      renderCell: (params) => (
        <p className="whitespace-normal text-justify">{params.value || 'Chưa có tóm tắt'}</p>
      ),
    },
    {
      field: 'participants',
      headerName: 'Người tham gia',
      flex: 1.1,
      minWidth: 260,
      sortable: false,
      renderCell: (params) => (
        <div className="py-2">
          <p className="whitespace-normal">
            <span className="font-semibold">Diễn viên: </span>
            <span>{params.row.castsDisplay || 'Chưa cập nhật'}</span>
          </p>
          <p className="whitespace-normal">
            <span className="font-semibold">Đạo diễn: </span>
            <span>{params.row.directorsDisplay || 'Chưa cập nhật'}</span>
          </p>
        </div>
      ),
    },
    {
      field: 'movieTheatersDisplay',
      headerName: 'Rạp áp dụng',
      flex: 1,
      minWidth: 220,
    },
    {
      field: 'duration',
      headerName: 'Thời lượng',
      width: 120,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'language',
      headerName: 'Ngôn ngữ',
      width: 140,
    },
    {
      field: 'genresDisplay',
      headerName: 'Thể loại',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'age',
      headerName: 'Giới hạn tuổi',
      width: 130,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'releaseDate',
      headerName: 'Ngày phát hành',
      width: 160,
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-3">
          <button
            type="button"
            className="hover:cursor-pointer"
            onClick={() => handleEdit(params.row)}
          >
            <CiEdit size={25} fill="orange" />
          </button>
          <button
            type="button"
            className="hover:cursor-pointer"
            onClick={() => handleDelete(params.row)}
          >
            <MdOutlineDeleteSweep size={25} fill="red" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-auto">
      <div>
        <h2 className="mb-2 text-[18px] font-semibold">Danh sách phim</h2>
      </div>

      <DataGridTable
        rows={rows}
        columns={columns}
        loading={isLoading}
        minWidth={1900}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        paginationMode="server"
        rowCount={meta.totalElements || 0}
        getRowId={(row) => row?.movieId ?? row?.id}
        loadingContent="Đang tải danh sách phim..."
        emptyContent="Danh sách phim trống"
      />
    </div>
  );
};

export default MovieTable;

