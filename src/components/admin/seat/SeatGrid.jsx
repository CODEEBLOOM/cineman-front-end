import { Box, Paper, Stack, Typography } from '@mui/material';
import SeatRow from './SeatRow';

const SeatGrid = ({ seats = [], cinemaTheater = {}, fetchSeatMap }) => {
  const seatMap = new Map();
  seats.forEach((seat) => {
    const key = `${seat.rowIndex}-${seat.columnIndex}`;
    seatMap.set(key, seat);
  });

  const totalSeatRows =
    (cinemaTheater.regularSeatRow ?? 0) +
    (cinemaTheater.vipSeatRow ?? 0) +
    (cinemaTheater.doubleSeatRow ?? 0);
  const maxSeatRows = Math.min(cinemaTheater.numberOfRows ?? 0, totalSeatRows);
  const hasBatchActions = cinemaTheater.status !== 'PUBLISHED';

  const getSeatTypeByRow = (rowIndex) => {
    if (rowIndex <= cinemaTheater.regularSeatRow) {
      return 'REGULAR';
    }
    if (rowIndex <= cinemaTheater.regularSeatRow + cinemaTheater.vipSeatRow) {
      return 'VIP';
    }
    return 'DOUBLE';
  };

  const renderSeatRows = () => {
    const rows = [];

    for (let row = 1; row <= maxSeatRows; row++) {
      const cols = [];
      const isSeatDouble =
        row > cinemaTheater.regularSeatRow + cinemaTheater.vipSeatRow;

      for (let col = 1; col <= (cinemaTheater.numberOfColumn ?? 0); col++) {
        if (isSeatDouble && col === cinemaTheater.numberOfColumn) {
          cols.push({
            seatType: null,
            rowIndex: row,
            columnIndex: col,
            id: null,
          });
          continue;
        }

        const seatKey = `${row}-${col}`;
        const seat = seatMap.get(seatKey);
        const seatData = seat ?? {
          seatType: getSeatTypeByRow(row),
          rowIndex: row,
          columnIndex: col,
          id: null,
        };

        cols.push(seatData);
        if (isSeatDouble) col++;
      }

      rows.push(
        <SeatRow
          key={row}
          seatData={cols}
          cinemaTheaterId={cinemaTheater.cinemaTheaterId}
          status={cinemaTheater.status}
          fetchSeatMap={fetchSeatMap}
        />
      );
    }

    return rows;
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Box sx={{ minWidth: 'fit-content', mx: 'auto', px: { xs: 0.5, md: 1 } }}>
        <Stack spacing={4}>
          <Box sx={{ px: { xs: 0.5, md: 2 } }}>
            <Paper
              elevation={0}
              sx={{
                mx: 'auto',
                width: '100%',
                maxWidth: 1100,
                borderRadius: 2.5,
                py: 1.75,
                px: 2,
                textAlign: 'center',
                color: 'common.white',
                background:
                  'linear-gradient(180deg, rgba(167,177,192,1) 0%, rgba(136,148,165,1) 100%)',
                boxShadow: '0 18px 36px rgba(71, 85, 105, 0.18)',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: '8%',
                  right: '8%',
                  bottom: -12,
                  height: 18,
                  borderRadius: '50%',
                  background: 'rgba(148, 163, 184, 0.18)',
                  filter: 'blur(8px)',
                },
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                }}
              >
                Màn hình rạp chiếu
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', pb: 1 }}>
            <Box
              sx={{
                display: 'grid',
                gap: { xs: 1, md: 1.35 },
                alignItems: 'center',
                gridTemplateColumns: hasBatchActions
                  ? `44px repeat(${cinemaTheater.numberOfColumn ?? 0}, minmax(58px, 1fr)) repeat(2, 52px)`
                  : `44px repeat(${cinemaTheater.numberOfColumn ?? 0}, minmax(58px, 1fr))`,
              }}
            >
              {renderSeatRows()}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default SeatGrid;
