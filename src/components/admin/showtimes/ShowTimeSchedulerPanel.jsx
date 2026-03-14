import { findByMovieTheaterId } from '@apis/cinemaTheaterService';
import { findAllMovieTheater } from '@apis/movieTheaterService';
import {
  deleteShowTime,
  findOccupiedSlotsByCinemaTheaterId,
} from '@apis/showTimeService';
import EmptyList from '@component/cinema_showtime/EmptyList';
import Loading from '@component/Loading';
import { useModelContext } from '@context/ModalContext';
import AddRounded from '@mui/icons-material/AddRounded';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlined from '@mui/icons-material/EditOutlined';
import EventSeatRounded from '@mui/icons-material/EventSeatRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import TheaterComedyRounded from '@mui/icons-material/TheaterComedyRounded';
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
  buildTimelineSlots,
  extractCollection,
  formatCurrency,
  getStatusMeta,
  getTimelineHours,
  getTodayValue,
} from './showTimeUtils';

const SelectField = ({ label, value, onChange, options, placeholder, disabled = false }) => {
  return (
    <TextField
      fullWidth
      select
      size="small"
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
    >
      <MenuItem value="">{placeholder}</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

const timelineStartMinute = 8 * 60;
const timelineEndMinute = 22 * 60;
const totalTimelineMinutes = timelineEndMinute - timelineStartMinute;

const statusSurfaceClassMap = {
  VALID: 'from-emerald-500 to-teal-500',
  INVALID: 'from-amber-500 to-orange-500',
  DELETED: 'from-rose-500 to-pink-500',
};

const ShowTimeSchedulerPanel = () => {
  const { openPopup } = useModelContext();
  const { user } = useSelector((state) => state.user);
  const [movieTheaters, setMovieTheaters] = useState([]);
  const [cinemaTheaters, setCinemaTheaters] = useState([]);
  const [selectedMovieTheaterId, setSelectedMovieTheaterId] = useState('');
  const [selectedCinemaTheaterId, setSelectedCinemaTheaterId] = useState('');
  const [showDate, setShowDate] = useState(getTodayValue());
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [isLoadingMovieTheaters, setIsLoadingMovieTheaters] = useState(false);
  const [isLoadingCinemaTheaters, setIsLoadingCinemaTheaters] = useState(false);
  const [isLoadingOccupiedSlots, setIsLoadingOccupiedSlots] = useState(false);

  const selectedMovieTheater = useMemo(() => {
    return (
      movieTheaters.find((item) => item.value === selectedMovieTheaterId) ?? null
    );
  }, [movieTheaters, selectedMovieTheaterId]);

  const selectedCinemaTheater = useMemo(() => {
    return (
      cinemaTheaters.find((item) => item.value === selectedCinemaTheaterId) ?? null
    );
  }, [cinemaTheaters, selectedCinemaTheaterId]);

  const timelineSlots = useMemo(() => {
    return buildTimelineSlots(occupiedSlots);
  }, [occupiedSlots]);

  const timelineLaneCount = useMemo(() => {
    if (timelineSlots.length === 0) {
      return 1;
    }

    return Math.max(...timelineSlots.map((item) => item.laneIndex)) + 1;
  }, [timelineSlots]);

  const loadMovieTheaters = useCallback(async () => {
    setIsLoadingMovieTheaters(true);

    try {
      const response = await findAllMovieTheater();
      const options = extractCollection(response, ['movieTheaters']).map((item) => ({
        value: String(item?.movieTheaterId ?? item?.id ?? ''),
        label: item?.name ?? `Rap ${item?.movieTheaterId ?? item?.id ?? ''}`,
      }));

      setMovieTheaters(options);

      const preferredMovieTheaterId = String(
        user?.movieTheater?.movieTheaterId ?? options[0]?.value ?? ''
      );

      setSelectedMovieTheaterId((currentValue) => currentValue || preferredMovieTheaterId);
    } catch (error) {
      toast.error('Khong the tai danh sach rap chieu!');
    } finally {
      setIsLoadingMovieTheaters(false);
    }
  }, [user?.movieTheater?.movieTheaterId]);

  const loadCinemaTheaters = useCallback(async (movieTheaterId) => {
    if (!movieTheaterId) {
      setCinemaTheaters([]);
      setSelectedCinemaTheaterId('');
      return;
    }

    setIsLoadingCinemaTheaters(true);

    try {
      const response = await findByMovieTheaterId(movieTheaterId);
      const options = extractCollection(response, ['cinemaTheaters']).map((item) => ({
        value: String(item?.cinemaTheaterId ?? item?.id ?? ''),
        label: item?.name ?? `Phong ${item?.cinemaTheaterId ?? item?.id ?? ''}`,
      }));

      setCinemaTheaters(options);
      setSelectedCinemaTheaterId((currentValue) => {
        if (options.some((item) => item.value === currentValue)) {
          return currentValue;
        }

        return options[0]?.value ?? '';
      });
    } catch (error) {
      setCinemaTheaters([]);
      setSelectedCinemaTheaterId('');
      toast.error('Khong the tai danh sach phong chieu!');
    } finally {
      setIsLoadingCinemaTheaters(false);
    }
  }, []);

  const loadOccupiedSlots = useCallback(async () => {
    if (!selectedCinemaTheaterId || !showDate) {
      setOccupiedSlots([]);
      return;
    }

    setIsLoadingOccupiedSlots(true);

    try {
      const response = await findOccupiedSlotsByCinemaTheaterId(
        selectedCinemaTheaterId,
        showDate
      );
      setOccupiedSlots(extractCollection(response, ['occupiedSlots', 'showTimes']));
    } catch (error) {
      setOccupiedSlots([]);
      toast.error('Khong the tai occupied slots cho phong nay!');
    } finally {
      setIsLoadingOccupiedSlots(false);
    }
  }, [selectedCinemaTheaterId, showDate]);

  useEffect(() => {
    loadMovieTheaters();
  }, [loadMovieTheaters]);

  useEffect(() => {
    loadCinemaTheaters(selectedMovieTheaterId);
  }, [loadCinemaTheaters, selectedMovieTheaterId]);

  useEffect(() => {
    loadOccupiedSlots();
  }, [loadOccupiedSlots]);

  const handleOpenModal = (showTimeId = null) => {
    openPopup(
      <PopupShowTime
        showTimeId={showTimeId}
        defaults={{
          movieTheaterId: selectedMovieTheaterId,
          cinemaTheaterId: selectedCinemaTheaterId,
          showDate,
          status: 'VALID',
        }}
        onSuccess={loadOccupiedSlots}
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
      await loadOccupiedSlots();
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

  const timelineHours = getTimelineHours();

  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Scheduler
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Lap lich theo phong va ngay
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Chon rap, phong va ngay de xem occupied slots. Tao, sua, xoa showtime
            ngay tren timeline cua phong.
          </p>
        </div>

        <div className="space-y-3">
          <SelectField
            label="Movie theater"
            value={selectedMovieTheaterId}
            onChange={setSelectedMovieTheaterId}
            options={movieTheaters}
            placeholder={isLoadingMovieTheaters ? 'Dang tai rap...' : 'Chon rap chieu'}
            disabled={isLoadingMovieTheaters}
          />
          <SelectField
            label="Cinema theater"
            value={selectedCinemaTheaterId}
            onChange={setSelectedCinemaTheaterId}
            options={cinemaTheaters}
            placeholder={
              isLoadingCinemaTheaters ? 'Dang tai phong...' : 'Chon phong chieu'
            }
            disabled={!selectedMovieTheaterId || isLoadingCinemaTheaters}
          />
          <TextField
            fullWidth
            size="small"
            label="Show date"
            type="date"
            value={showDate}
            onChange={(event) => setShowDate(event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-3 text-slate-700">
              <TheaterComedyRounded fontSize="small" />
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Rap</p>
                <p className="font-semibold text-slate-900">
                  {selectedMovieTheater?.label ?? 'Chua chon rap'}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-3 text-slate-700">
              <EventSeatRounded fontSize="small" />
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Phong</p>
                <p className="font-semibold text-slate-900">
                  {selectedCinemaTheater?.label ?? 'Chua chon phong'}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-3 text-slate-700">
              <ScheduleRounded fontSize="small" />
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Ngay</p>
                <p className="font-semibold text-slate-900">{showDate || 'Chua chon ngay'}</p>
              </div>
            </div>
          </div>
        </div>

        <Button
          fullWidth
          variant="contained"
          startIcon={<AddRounded />}
          disabled={!selectedMovieTheaterId || !selectedCinemaTheaterId}
          onClick={() => handleOpenModal()}
        >
          Tao suat chieu
        </Button>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Occupied slots
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Timeline phong trong ngay
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Khung gio he thong dang validate la 08:00 den 22:00, timeline duoi day
              giup admin nhin nhanh cac khoang da chiem.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Tong suat</p>
            <p className="mt-1 text-2xl font-semibold">{timelineSlots.length}</p>
          </div>
        </div>

        {isLoadingOccupiedSlots ? (
          <Loading content="Dang tai lich trong ngay..." />
        ) : !selectedCinemaTheaterId ? (
          <EmptyList content="Hay chon rap va phong de tai timeline suat chieu" />
        ) : timelineSlots.length === 0 ? (
          <EmptyList content="Phong nay chua co suat chieu trong ngay da chon" />
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="min-w-[920px]">
                <div className="relative mb-10 h-10">
                  {timelineHours.map((hour, index) => {
                    const left = `${(index / (timelineHours.length - 1)) * 100}%`;

                    return (
                      <div
                        key={hour}
                        className="absolute top-0 -translate-x-1/2 text-xs font-medium text-slate-500"
                        style={{ left }}
                      >
                        {hour}
                      </div>
                    );
                  })}
                </div>

                <div
                  className="relative rounded-2xl border border-slate-200 bg-white"
                  style={{ height: `${timelineLaneCount * 96 + 32}px` }}
                >
                  {timelineHours.map((hour, index) => {
                    const left = `${(index / (timelineHours.length - 1)) * 100}%`;

                    return (
                      <div
                        key={hour}
                        className="absolute bottom-0 top-0 border-l border-dashed border-slate-200"
                        style={{ left }}
                      />
                    );
                  })}

                  {timelineSlots.map((slot) => {
                    const clippedStart = Math.max(slot.startMinutes, timelineStartMinute);
                    const clippedEnd = Math.min(slot.endMinutes, timelineEndMinute);
                    const widthPercent = Math.max(
                      ((clippedEnd - clippedStart) / totalTimelineMinutes) * 100,
                      8
                    );
                    const leftPercent =
                      ((clippedStart - timelineStartMinute) / totalTimelineMinutes) * 100;
                    const statusMeta = getStatusMeta(slot.status);
                    const surfaceClass =
                      statusSurfaceClassMap[slot.status] ?? 'from-slate-600 to-slate-500';

                    return (
                      <div
                        key={slot.id}
                        className={`absolute rounded-2xl bg-gradient-to-r p-4 text-white shadow-lg ${surfaceClass}`}
                        style={{
                          left: `${leftPercent}%`,
                          top: `${16 + slot.laneIndex * 96}px`,
                          width: `${widthPercent}%`,
                          minHeight: '76px',
                        }}
                      >
                        <div className="flex h-full flex-col justify-between gap-2">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold">{slot.movieTitle}</p>
                                <p className="text-xs text-white/80">
                                  {slot.startTime} - {slot.endTime} | {slot.movieVariationName}
                                </p>
                              </div>
                              <span className="rounded-full bg-white/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
                                {statusMeta.label}
                              </span>
                            </div>
                            <p className="mt-2 text-xs text-white/80">
                              Gia goc: {formatCurrency(slot.originPrice)}
                            </p>
                          </div>

                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              className="rounded-full border border-white/30 bg-white/10 p-2 transition hover:bg-white/20"
                              onClick={() => handleOpenModal(slot.id)}
                              title="Sua suat chieu"
                            >
                              <EditOutlined fontSize="inherit" className="text-base" />
                            </button>
                            <button
                              type="button"
                              className="rounded-full border border-white/30 bg-white/10 p-2 transition hover:bg-white/20"
                              onClick={() => handleDeleteShowTime(slot.id)}
                              title="Xoa suat chieu"
                            >
                              <DeleteOutlineRounded fontSize="inherit" className="text-base" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              {timelineSlots.map((slot) => {
                const statusMeta = getStatusMeta(slot.status);

                return (
                  <div
                    key={`card-${slot.id}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{slot.movieTitle}</p>
                        <p className="text-sm text-slate-500">
                          {slot.cinemaTheaterName} | {slot.movieVariationName}
                        </p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                          Thoi gian
                        </p>
                        <p className="mt-1 font-medium text-slate-900">
                          {slot.startTime} - {slot.endTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                          Gia
                        </p>
                        <p className="mt-1 font-medium text-slate-900">
                          {formatCurrency(slot.originPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                          Ghe trong
                        </p>
                        <p className="mt-1 font-medium text-slate-900">
                          {slot.totalSeatEmpty ?? '--'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditOutlined />}
                        onClick={() => handleOpenModal(slot.id)}
                      >
                        Sua
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteOutlineRounded />}
                        onClick={() => handleDeleteShowTime(slot.id)}
                      >
                        Xoa
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShowTimeSchedulerPanel;
