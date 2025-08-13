import { Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// TimeBadge – chip giờ chiếu (MUI Chip + Tailwind)
const TimeBadge = ({ showTimeDetail }) => {
  const navigate = useNavigate();
  const handleNavigateChooseSeat = () => {
    return navigate('/choose-seat?st=' + showTimeDetail.id);
  };
  return (
    <Chip
      label={showTimeDetail?.startTime}
      onClick={handleNavigateChooseSeat}
      variant="outlined"
      className="rounded-xl text-sm font-medium hover:shadow-sm"
      sx={{ px: 1, py: 0.5, borderRadius: '12px' }}
    />
  );
};

export default TimeBadge;
