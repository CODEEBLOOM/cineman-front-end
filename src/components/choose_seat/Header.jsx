import LocalMoviesOutlinedIcon from '@mui/icons-material/LocalMoviesOutlined';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import TheatersRoundedIcon from '@mui/icons-material/TheatersRounded';
import {
  Alert,
  Breadcrumbs,
  Chip,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Header = ({ showTime }) => {
  return (
    <div className="space-y-5">
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
      >
        <div className="space-y-2">
          <Typography
            variant="overline"
            sx={{
              color: '#64748b',
              fontWeight: 800,
              letterSpacing: '0.18em',
            }}
          >
            Poly Cinemas
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: '#0f172a',
              fontSize: { xs: '1.65rem', md: '2rem' },
            }}
          >
            Chọn ghế xem phim
          </Typography>
        </div>

        <Chip
          icon={<TheatersRoundedIcon />}
          label={showTime?.cinemaTheater?.name || 'Đang cập nhật phòng chiếu'}
          sx={{
            height: 42,
            borderRadius: '999px',
            bgcolor: '#f8fafc',
            color: '#334155',
            fontWeight: 800,
            border: '1px solid rgba(203,213,225,0.9)',
            '.MuiChip-icon': { color: '#2d5f8d' },
          }}
        />
      </Stack>

      <Breadcrumbs
        separator={<NavigateNextRoundedIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-ol': { alignItems: 'center' },
          '& .MuiBreadcrumbs-separator': { color: '#94a3b8' },
        }}
      >
        <MuiLink
          component={Link}
          to="/"
          underline="hover"
          sx={{ fontWeight: 700, color: '#23486c' }}
        >
          Trang chủ
        </MuiLink>
        <Typography sx={{ fontWeight: 700, color: '#475569' }}>
          Đặt vé
        </Typography>
        <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>
          {showTime?.movie?.title || 'Đang cập nhật phim'}
        </Typography>
      </Breadcrumbs>

      <Alert
        icon={<LocalMoviesOutlinedIcon fontSize="inherit" />}
        severity="warning"
        sx={{
          alignItems: 'center',
          borderRadius: '18px',
          border: '1px solid rgba(251, 191, 36, 0.35)',
          bgcolor: 'rgba(254, 243, 199, 0.78)',
          color: '#9a3412',
          fontWeight: 700,
        }}
      >
        Theo quy định của Cục Điện ảnh, phim này không dành cho khán giả dưới{' '}
        {showTime?.movie?.age || '--'} tuổi.
      </Alert>
    </div>
  );
};

export default Header;
