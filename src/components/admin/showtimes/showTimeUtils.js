const DEFAULT_COLLECTION_KEYS = [
  'showTimes',
  'occupiedSlots',
  'cinemaTheaters',
  'movieTheaters',
  'movies',
  'content',
  'items',
];

export const unwrapData = (response) => response?.data ?? response ?? null;

export const extractCollection = (
  response,
  keys = DEFAULT_COLLECTION_KEYS
) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key];
    }
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const padNumber = (value) => String(value).padStart(2, '0');

export const normalizeDateValue = (value) => {
  if (!value) {
    return '';
  }

  const text = String(value);

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(
    date.getDate()
  )}`;
};

export const normalizeTimeValue = (value) => {
  if (!value) {
    return '';
  }

  const text = String(value);

  if (/^\d{2}:\d{2}(:\d{2})?$/.test(text)) {
    return text.slice(0, 5);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;
};

export const getTodayValue = () => normalizeDateValue(new Date());

export const timeToMinutes = (value) => {
  const normalized = normalizeTimeValue(value);

  if (!normalized) {
    return null;
  }

  const [hour, minute] = normalized.split(':').map(Number);
  return hour * 60 + minute;
};

export const formatCurrency = (value) => {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number.isNaN(amount) ? 0 : amount);
};

export const getStatusMeta = (status) => {
  switch (status) {
    case 'VALID':
      return {
        label: 'Đang áp dụng',
        className: 'bg-emerald-100 text-emerald-700',
      };
    case 'INVALID':
      return {
        label: 'Tạm ẩn',
        className: 'bg-amber-100 text-amber-700',
      };
    case 'DELETED':
      return {
        label: 'Đã xóa',
        className: 'bg-rose-100 text-rose-700',
      };
    default:
      return {
        label: status || 'Không rõ',
        className: 'bg-slate-200 text-slate-700',
      };
  }
};

export const normalizeShowTimeItem = (entry) => {
  const showTime = entry?.showTime ?? entry ?? {};
  const movie = entry?.movie ?? showTime?.movie ?? {};
  const cinemaTheater = entry?.cinemaTheater ?? showTime?.cinemaTheater ?? {};
  const movieVariation =
    entry?.movieVariation ?? showTime?.movieVariation ?? {};
  const movieTheater =
    entry?.movieTheater ??
    cinemaTheater?.movieTheater ??
    showTime?.movieTheater ??
    {};

  return {
    id: showTime?.id ?? entry?.id ?? null,
    showDate: normalizeDateValue(showTime?.showDate ?? entry?.showDate),
    startTime: normalizeTimeValue(showTime?.startTime ?? entry?.startTime),
    endTime: normalizeTimeValue(showTime?.endTime ?? entry?.endTime),
    originPrice: Number(showTime?.originPrice ?? entry?.originPrice ?? 0),
    status: showTime?.status ?? entry?.status ?? '',
    movieId: movie?.movieId ?? movie?.id ?? showTime?.movieId ?? '',
    movieTitle: movie?.title ?? showTime?.movieTitle ?? 'Chưa có tên phim',
    movieDuration: Number(movie?.duration ?? showTime?.movieDuration ?? 0),
    posterImage: movie?.posterImage ?? '',
    cinemaTheaterId:
      cinemaTheater?.cinemaTheaterId ??
      cinemaTheater?.id ??
      showTime?.cinemaTheaterId ??
      '',
    cinemaTheaterName:
      cinemaTheater?.name ?? entry?.cinemaTheaterName ?? 'Chưa có phòng chiếu',
    movieTheaterId:
      movieTheater?.movieTheaterId ??
      movieTheater?.id ??
      entry?.movieTheaterId ??
      '',
    movieTheaterName:
      movieTheater?.name ?? entry?.movieTheaterName ?? 'Chưa có rạp chiếu',
    movieVariationId:
      movieVariation?.id ?? showTime?.movieVariationId ?? entry?.movieVariationId ?? '',
    movieVariationName:
      movieVariation?.name ?? entry?.movieVariationName ?? 'Chưa chọn biến thể',
    totalSeatEmpty:
      entry?.totalSeatEmpty ?? showTime?.totalSeatEmpty ?? movie?.totalSeatEmpty ?? null,
    raw: entry,
  };
};

export const sortShowTimesByStart = (items) => {
  return [...items].sort((firstItem, secondItem) => {
    const firstMinutes = timeToMinutes(firstItem.startTime) ?? 0;
    const secondMinutes = timeToMinutes(secondItem.startTime) ?? 0;
    return firstMinutes - secondMinutes;
  });
};

export const buildTimelineSlots = (items) => {
  const sorted = sortShowTimesByStart(items).map(normalizeShowTimeItem);
  const lanes = [];

  return sorted.map((item) => {
    const startMinutes = timeToMinutes(item.startTime) ?? 0;
    const endMinutes = timeToMinutes(item.endTime) ?? startMinutes + 1;

    let laneIndex = lanes.findIndex((laneEndMinute) => startMinutes >= laneEndMinute);

    if (laneIndex === -1) {
      lanes.push(endMinutes);
      laneIndex = lanes.length - 1;
    } else {
      lanes[laneIndex] = endMinutes;
    }

    return {
      ...item,
      startMinutes,
      endMinutes,
      laneIndex,
    };
  });
};

export const getTimelineHours = (startHour = 8, endHour = 22) => {
  const hours = [];

  for (let hour = startHour; hour <= endHour; hour += 1) {
    hours.push(`${padNumber(hour)}:00`);
  }

  return hours;
};
