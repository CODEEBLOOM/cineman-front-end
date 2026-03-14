import { findAllMovieTheater } from '@apis/movieTheaterService';
import {
  deleteShowTime,
  findAllAdminShowTimes,
} from '@apis/showTimeService';
import EmptyList from '@component/cinema_showtime/EmptyList';
import Loading from '@component/Loading';
import { useModelContext } from '@context/ModalContext';
import AddRounded from '@mui/icons-material/AddRounded';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlined from '@mui/icons-material/EditOutlined';
import FilterAltRounded from '@mui/icons-material/FilterAltRounded';
import {
  Button,
  MenuItem,
  TextField,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PopupShowTime from './PopupShowTime';
import {
  extractCollection,
  formatCurrency,
  getStatusMeta,
  getTodayValue,
  normalizeShowTimeItem,
} from './showTimeUtils';

const showTimeStatusOptions = [
  { value: '', label: 'Tat ca trang thai' },
  { value: 'VALID', label: 'Dang ap dung' },
  { value: 'INVALID', label: 'Tam an' },
  { value: 'DELETED', label: 'Da xoa' },
];

const ShowTimeListPanel = () => {
  const { openPopup } = useModelContext();
  const { user } = useSelector((state) => state.user);
  const [movieTheaters, setMovieTheaters] = useState([]);
  const [filters, setFilters] = useState({
    movieTheaterId: '',
    showDate: getTodayValue(),
    showTimeStatus: '',
  });
  const [showTimes, setShowTimes] = useState([]);
  const [isLoadingMovieTheaters, setIsLoadingMovieTheaters] = useState(false);
  const [isLoadingShowTimes, setIsLoadingShowTimes] = useState(false);

  const selectedMovieTheaterLabel = useMemo(() => {
    return (
      movieTheaters.find((item) => item.value === filters.movieTheaterId)?.label ?? 'Tat ca rap'
    );
  }, [filters.movieTheaterId, movieTheaters]);

  const loadMovieTheaters = useCallback(async () => {
    setIsLoadingMovieTheaters(true);

    try {
      const response = await findAllMovieTheater();
      const options = extractCollection(response, ['movieTheaters']).map((item) => ({
        value: String(item?.movieTheaterId ?? item?.id ?? ''),
        label: item?.name ?? `Rap ${item?.movieTheaterId ?? item?.id ?? ''}`,
      }));

      setMovieTheaters(options);
      setFilters((currentValue) => ({
        ...currentValue,
        movieTheaterId:
          currentValue.movieTheaterId ||
          String(user?.movieTheater?.movieTheaterId ?? ''),
      }));
    } catch (error) {
      toast.error('Khong the tai danh sach rap chieu!');
    } finally {
      setIsLoadingMovieTheaters(false);
    }
  }, [user?.movieTheater?.movieTheaterId]);

  const loadShowTimes = useCallback(async () => {
    setIsLoadingShowTimes(true);

    try {
      const response = await findAllAdminShowTimes(filters);
      const normalizedItems = extractCollection(response, ['showTimes']).map(
        normalizeShowTimeItem
      );
      const sortedItems = normalizedItems.sort((firstItem, secondItem) => {
        const firstDateTime = `${firstItem.showDate} ${firstItem.startTime}`;
        const secondDateTime = `${secondItem.showDate} ${secondItem.startTime}`;
        return firstDateTime.localeCompare(secondDateTime);
      });

      setShowTimes(sortedItems);
    } catch (error) {
      setShowTimes([]);
      toast.error('Khong the tai danh sach suat chieu!');
    } finally {
      setIsLoadingShowTimes(false);
    }
  }, [filters]);

  useEffect(() => {
    loadMovieTheaters();
  }, [loadMovieTheaters]);

  useEffect(() => {
    loadShowTimes();
  }, [loadShowTimes]);

  const handleOpenModal = (showTimeId = null) => {
    openPopup(
      <PopupShowTime
        showTimeId={showTimeId}
        defaults={{
          movieTheaterId: filters.movieTheaterId,
          showDate: filters.showDate,
          status: filters.showTimeStatus || 'VALID',
        }}
        onSuccess={loadShowTimes}
      />
    );
  };

  const handleDeleteShowTime = async (showTimeId) => {
    const confirmed = window.confirm('Ban co chac muon xoa suat chieu nay khong?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteShowTime(showTimeId);
      toast.success('Xoa suat chieu thanh cong!');
      await loadShowTimes();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xoa suat chieu that bai!');
    }
  };

  const groupedByDate = useMemo(() => {
    const groups = new Map();

    showTimes.forEach((item) => {
      const dateKey = item.showDate || 'Khong ro ngay';
      const currentGroup = groups.get(dateKey) ?? [];
      currentGroup.push(item);
      groups.set(dateKey, currentGroup);
    });

    return Array.from(groups.entries());
  }, [showTimes]);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Admin list
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Danh sach va bo loc showtime
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Man nay dung de quan tri nhanh theo rap, ngay va trang thai. Sau khi loc,
            admin co the mo lai modal de sua hoac xoa showtime ngay tu danh sach.
          </p>
        </div>

        <Button variant="contained" startIcon={<AddRounded />} onClick={() => handleOpenModal()}>
          Tao suat chieu
        </Button>
      </div>

      <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
        <TextField
          fullWidth
          select
          size="small"
          label="Movie theater"
          value={filters.movieTheaterId}
          disabled={isLoadingMovieTheaters}
          onChange={(event) =>
            setFilters((currentValue) => ({
              ...currentValue,
              movieTheaterId: event.target.value,
            }))
          }
        >
          <MenuItem value="">Tat ca rap chieu</MenuItem>
          {movieTheaters.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          size="small"
          label="Show date"
          type="date"
          value={filters.showDate}
          onChange={(event) =>
            setFilters((currentValue) => ({
              ...currentValue,
              showDate: event.target.value,
            }))
          }
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          select
          size="small"
          label="Status"
          value={filters.showTimeStatus}
          onChange={(event) =>
            setFilters((currentValue) => ({
              ...currentValue,
              showTimeStatus: event.target.value,
            }))
          }
        >
          {showTimeStatusOptions.map((option) => (
            <MenuItem key={option.value || 'all'} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="outlined"
          startIcon={<FilterAltRounded />}
          onClick={loadShowTimes}
        >
          Tai lai
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <p>
          Bo loc hien tai: <span className="font-semibold text-slate-900">{selectedMovieTheaterLabel}</span>
          {' | '}
          <span className="font-semibold text-slate-900">{filters.showDate || 'Tat ca ngay'}</span>
        </p>
        <p>
          Tong so ket qua: <span className="font-semibold text-slate-900">{showTimes.length}</span>
        </p>
      </div>

      {isLoadingShowTimes ? (
        <Loading content="Dang tai danh sach suat chieu..." />
      ) : showTimes.length === 0 ? (
        <EmptyList content="Khong tim thay suat chieu nao voi bo loc hien tai" />
      ) : (
        <div className="space-y-4">
          {groupedByDate.map(([dateKey, items]) => (
            <div key={dateKey} className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between gap-3 bg-slate-900 px-4 py-3 text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Show date</p>
                  <p className="text-lg font-semibold">{dateKey}</p>
                </div>
                <p className="text-sm text-slate-200">{items.length} suat chieu</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Phim</th>
                      <th className="px-4 py-3">Rap / Phong</th>
                      <th className="px-4 py-3">Gio chieu</th>
                      <th className="px-4 py-3">Bien the</th>
                      <th className="px-4 py-3">Gia</th>
                      <th className="px-4 py-3">Trang thai</th>
                      <th className="px-4 py-3 text-right">Thao tac</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const statusMeta = getStatusMeta(item.status);

                      return (
                        <tr key={item.id} className="border-t border-slate-200 bg-white align-top">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-slate-900">{item.movieTitle}</p>
                            <p className="mt-1 text-sm text-slate-500">ID: {item.id}</p>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">
                            <p>{item.movieTheaterName}</p>
                            <p className="mt-1 font-medium text-slate-900">
                              {item.cinemaTheaterName}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-slate-900">
                            {item.startTime} - {item.endTime}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">
                            {item.movieVariationName}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">
                            {formatCurrency(item.originPrice)}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}
                            >
                              {statusMeta.label}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<EditOutlined />}
                                onClick={() => handleOpenModal(item.id)}
                              >
                                Sua
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<DeleteOutlineRounded />}
                                onClick={() => handleDeleteShowTime(item.id)}
                              >
                                Xoa
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowTimeListPanel;
