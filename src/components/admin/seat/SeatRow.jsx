import DeleteSweepRounded from '@mui/icons-material/DeleteSweepRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { createMul, deleteMulSeat } from '@apis/seatService';
import { useEffect, useState } from 'react';
import SeatComponent from './SeatComponent';
import {
  buildSeatLabel,
  getSeatRowLabel,
  toApiSeatPosition,
} from '@utils/seatPosition';

const actionButtonSx = (paletteKey) => ({
  width: 38,
  height: 38,
  borderRadius: 2,
  bgcolor: `${paletteKey}.50`,
  color: `${paletteKey}.main`,
  border: '1px solid',
  borderColor: `${paletteKey}.100`,
  '&:hover': {
    bgcolor: `${paletteKey}.100`,
  },
  '&.Mui-disabled': {
    opacity: 0.45,
    borderColor: 'divider',
  },
});

const SeatRow = ({ seatData = [], cinemaTheaterId, fetchSeatMap, status }) => {
  const [emptySeats, setEmptySeats] = useState([]);
  const [validSeats, setValidSeats] = useState([]);

  useEffect(() => {
    setEmptySeats(
      seatData.filter(
        (seat) =>
          seat.id === null &&
          typeof seat.seatType === 'string' &&
          seat.seatType !== null
      )
    );
    setValidSeats(seatData.filter((seat) => seat.id !== null));
  }, [seatData]);

  const handleCreateMultipleSeat = () => {
    const createSeats = emptySeats.map((seat) => ({
      seatType: seat.seatType,
      ...toApiSeatPosition(seat),
      label: buildSeatLabel(seat.rowIndex, seat.columnIndex),
      cinemaTheaterId,
    }));

    if (createSeats.length === 0) return;

    createMul(createSeats)
      .then((res) => {
        if (res.status === 200) {
          fetchSeatMap();
          setEmptySeats([]);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteMultipleSeat = () => {
    const ids = validSeats.map((seat) => seat.id);
    if (ids.length === 0) return;

    deleteMulSeat(ids)
      .then((res) => {
        if (res.status === 200) {
          fetchSeatMap();
        }
      })
      .catch((err) => console.error(err));
  };

  const renderSeat = () =>
    seatData.map((seat) => {
      const key = `${seat.rowIndex}-${seat.columnIndex}`;
      if (seat.seatType === null) {
        return <Box key={key} sx={{ width: 58, height: 64 }} />;
      }

      return (
        <SeatComponent
          key={key}
          seat={seat}
          cinemaTheaterId={cinemaTheaterId}
          emptySeats={emptySeats}
          setEmptySeats={setEmptySeats}
          setValidSeats={setValidSeats}
          status={status}
        />
      );
    });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 64,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'text.secondary',
          }}
        >
          {getSeatRowLabel(seatData[0].rowIndex)}
        </Typography>
      </Box>

      {renderSeat()}

      {status !== 'PUBLISHED' && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Tooltip title="Tạo toàn bộ ghế trong hàng">
              <span>
                <IconButton
                  onClick={handleCreateMultipleSeat}
                  disabled={emptySeats.length === 0}
                  sx={actionButtonSx('primary')}
                >
                  <AddRounded fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Tooltip title="Xoá toàn bộ ghế đã tạo trong hàng">
              <span>
                <IconButton
                  onClick={handleDeleteMultipleSeat}
                  disabled={validSeats.length === 0}
                  sx={actionButtonSx('error')}
                >
                  <DeleteSweepRounded fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </>
      )}
    </>
  );
};

export default SeatRow;
