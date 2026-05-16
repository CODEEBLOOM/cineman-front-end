import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import ImageComponent from '@component/ImageComponent';
import { useSelector } from 'react-redux';

const MovieInfoBar = ({ showTime }) => {
  const movieTheater = useSelector(
    (state) => state.movieTheater?.movieTheater ?? { title: '' }
  );

  const movie = showTime?.movie || {};
  const genres = Array.isArray(movie.genres)
    ? movie.genres.map((g) => g.name).join(', ')
    : '';

  return (
    <div className="flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-stretch md:p-5">
      <div className="flex gap-4">
        <div className="h-[120px] w-[88px] flex-none overflow-hidden rounded-md border border-slate-200 bg-slate-100">
          <ImageComponent
            src={movie.posterImage}
            width={88}
            height={120}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[18px] font-extrabold leading-tight text-slate-900 md:text-[20px]">
              {movie.title || 'Đang cập nhật phim'}
            </h3>
            <span className="inline-flex h-6 items-center rounded-md bg-rose-50 px-2 text-[12px] font-bold text-rose-700">
              T{movie.age || '--'}
            </span>
          </div>

          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">
              {movie.duration ? `${movie.duration} phút` : '-- phút'}
            </span>
            {genres ? <span> • {genres}</span> : null}
          </p>

          <p className="flex items-center gap-1.5 text-sm text-slate-600">
            <PlaceRoundedIcon sx={{ fontSize: 18, color: '#0a4d9c' }} />
            {movieTheater?.title || 'Đang cập nhật rạp'}
          </p>

          <p className="flex items-center gap-1.5 text-sm text-slate-600">
            <PlaceRoundedIcon sx={{ fontSize: 18, color: '#0a4d9c' }} />
            {showTime?.cinemaTheater?.name || 'Đang cập nhật phòng chiếu'}
          </p>
        </div>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2 md:flex-col md:items-end md:gap-2">
        <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
          <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: '#0a4d9c' }} />
          {showTime?.showDate || 'Đang cập nhật ngày'}
        </div>
        <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
          {showTime?.startTime || '--:--'}
          <KeyboardArrowDownRoundedIcon
            sx={{ fontSize: 18, color: '#64748b' }}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieInfoBar;
