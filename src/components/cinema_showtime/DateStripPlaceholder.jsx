import { Button as MUIButton } from '@mui/material';
import {
  fetchShowDates,
  setShowDateActive,
} from '@redux/slices/cinemaShowtimeSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
const DateStripPlaceholder = () => {
  // TODO: lấy ra tất cả ngày chiếu của rạp hiện tại //
  const { movieTheater } = useSelector((state) => state.movieTheater);
  const { showDates, showDateActive } = useSelector(
    (state) => state.cinemaShowTime
  );

  const dispatch = useDispatch();

  function formatDate(dateString) {
    const days = [
      'Chủ Nhật',
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy',
    ];
    const date = new Date(dateString);

    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${dayName} - ${day}/${month}`;
  }

  const handleChangeShowDate = (showDate) => {
    dispatch(setShowDateActive(showDate));
  };

  useEffect(() => {
    dispatch(fetchShowDates(movieTheater.id)).unwrap();
  }, [movieTheater.id, dispatch]);

  return (
    <div className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="no-scrollbar flex gap-4 overflow-x-auto py-3">
          {(showDates || []).map((d) => (
            <MUIButton
              onClick={() => handleChangeShowDate(d)}
              key={d}
              size="small"
              variant={showDateActive === d ? 'contained' : 'outlined'}
              className="shrink-0 rounded-full"
              sx={{
                borderRadius: '9999px',
                px: 2,
                py: 1,
                textTransform: 'none',
              }}
            >
              {formatDate(d)}
            </MUIButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateStripPlaceholder;
