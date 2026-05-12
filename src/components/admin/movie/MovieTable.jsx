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

const defaultPaginationModel = {
  page: 0,
  pageSize: 10,
};

const MovieTable = ({ setIsEdit, setValue, setEditingMovie }) => {
  const [movies, setMovies] = useState([]);
  const [movieTheaterMap, setMovieTheaterMap] = useState({});
  const [meta, setMeta] = useState({
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [paginationModel, setPaginationModel] = useState(defaultPaginationModel);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = useCallback((movie) => {
    setEditingMovie(movie);
    setIsEdit(true);
    setValue(0);
  }, [setEditingMovie, setIsEdit, setValue]);

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

  const fetchMovies = useCallback(async ({ page, size }) => {
    setIsLoading(true);

    try {
      const response = await findAllByFilterAdmin({
        page,
        size,
        status: 'ALL',
      });
      const nextMovies = response?.movies ?? response?.data?.movies ?? [];
      const nextMeta = response?.meta ?? response?.data?.meta ?? {
        currentPage: page,
        pageSize: size,
        totalPages: 0,
        totalElements: 0,
      };

      setMovies(nextMovies);
      setMeta(nextMeta);
      setPaginationModel({
        page: nextMeta?.currentPage ?? page ?? defaultPaginationModel.page,
        pageSize: nextMeta?.pageSize ?? size ?? defaultPaginationModel.pageSize,
      });
      setMovieTheaterMap(await loadMovieTheaterMap(nextMovies));
    } catch {
      setMovies([]);
      setMovieTheaterMap({});
      setMeta({
        currentPage: page ?? defaultPaginationModel.page,
        pageSize: size ?? defaultPaginationModel.pageSize,
        totalPages: 0,
        totalElements: 0,
      });
      toast.error('Không thể tải danh sách phim!');
    } finally {
      setIsLoading(false);
    }
  }, [loadMovieTheaterMap]);

  useEffect(() => {
    fetchMovies(defaultPaginationModel);
  }, [fetchMovies]);

  const reloadCurrentPage = useCallback(async () => {
    await fetchMovies({
      page: paginationModel.page,
      size: paginationModel.pageSize,
    });
  }, [fetchMovies, paginationModel.page, paginationModel.pageSize]);

  const handlePaginationModelChange = useCallback(
    (nextModel) => {
      fetchMovies({
        page: nextModel.page,
        size: nextModel.pageSize,
      });
    },
    [fetchMovies]
  );

  const handleDelete = useCallback(
    async (movie) => {
      try {
        await deleteMovie(movie.movieId);
        toast.success('Xóa phim thành công');
        await reloadCurrentPage();
      } catch (error) {
        if (error?.response?.status === 400) {
          return toast.error(error?.response?.data?.message);
        }

        toast.error('Xóa phim thất bại!');
      }
    },
    [reloadCurrentPage]
  );

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

  const resolvedRowCount = useMemo(() => {
    const totalElements = Number(meta?.totalElements ?? 0);
    const totalPages = Number(meta?.totalPages ?? 0);
    const currentPageSize = Number(meta?.pageSize ?? paginationModel.pageSize ?? 0);

    if (totalPages > 1 && currentPageSize > 0) {
      // Some movie responses currently return an incorrect totalElements value.
      // Infer the minimum total row count from totalPages so Data Grid can paginate.
      const minimumTotalFromPages = (totalPages - 1) * currentPageSize + 1;
      return Math.max(totalElements, minimumTotalFromPages);
    }

    return Math.max(totalElements, rows.length);
  }, [meta?.pageSize, meta?.totalElements, meta?.totalPages, paginationModel.pageSize, rows.length]);

  const columns = useMemo(
    () => [
      {
        field: 'gridIndex',
        headerName: 'STT',
        width: 90,
        align: 'center',
        headerAlign: 'center',
        hideable: false,
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
        hideable: false,
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
    ],
    [handleDelete, handleEdit]
  );

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
        onPaginationModelChange={handlePaginationModelChange}
        paginationMode="server"
        rowCount={resolvedRowCount}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        showToolbar
        getRowId={(row) => row?.movieId ?? row?.id}
        loadingContent="Đang tải danh sách phim..."
        emptyContent="Danh sách phim trống"
      />
    </div>
  );
};

export default MovieTable;

