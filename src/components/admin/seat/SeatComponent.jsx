import { changeStatusSeat, create, deleteSeat } from '@apis/seatService';
import DoubleSeat from '@component/seat/DoubleSeat';
import RegularSeat from '@component/seat/RegularSeat';
import VIPSeat from '@component/seat/VIPSeat';
import { buildSeatLabel, toApiSeatPosition } from '@utils/seatPosition';
import AddCircleOutlineRounded from '@mui/icons-material/AddCircleOutlineRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const seatAppearance = {
  REGULAR: {
    icon: RegularSeat,
    color: '#b8c1cc',
    surface: '#f7f4ec',
    border: '#e7dbc2',
  },
  VIP: {
    icon: VIPSeat,
    color: '#aab6c7',
    surface: '#f4f8fd',
    border: '#d7e2ef',
  },
  DOUBLE: {
    icon: DoubleSeat,
    color: '#b8bcb5',
    surface: '#f9f1f3',
    border: '#ebd4da',
  },
};

const SeatComponent = ({
  seat,
  cinemaTheaterId,
  setEmptySeats,
  setValidSeats,
  status = 'DRAFT',
}) => {
  const [idSeat, setIdSeat] = useState(null);
  const [statusSeat, setStatusSeat] = useState(seat.status);
  const [currSeat, setCurrSeat] = useState(null);

  useEffect(() => {
    setIdSeat(seat.id ?? null);
    setStatusSeat(seat.status);
    setCurrSeat(null);
  }, [seat]);

  const seatType =
    typeof seat.seatType === 'string' ? seat.seatType : seat.seatType.id;
  const appearance = seatAppearance[seatType] ?? seatAppearance.REGULAR;
  const isPublished = status === 'PUBLISHED';
  const hasSeat = Boolean(idSeat);
  const isLocked = isPublished && !hasSeat;
  const isDoubleSeat = seatType === 'DOUBLE';

  const seatLabel = useMemo(
    () => seat.label ?? buildSeatLabel(seat.rowIndex, seat.columnIndex),
    [seat]
  );

  const handleUpdateEmptySeats = (isPush) => {
    if (isPush) {
      setEmptySeats((prev) => [
        ...prev,
        {
          seatType:
            typeof seat.seatType === 'string'
              ? seat.seatType
              : seat.seatType.id,
          rowIndex: seat.rowIndex,
          columnIndex: seat.columnIndex,
          id: null,
        },
      ]);
      return;
    }

    setEmptySeats((prev) =>
      prev.filter(
        (s) =>
          !(
            s.rowIndex === seat.rowIndex && s.columnIndex === seat.columnIndex
          )
      )
    );
  };

  const handleChooseSeat = async () => {
    if (isPublished) {
      if (!idSeat) return;

      try {
        const res = await changeStatusSeat(idSeat);
        if (res.status === 200) {
          setStatusSeat(res.data.status);
          toast.success('Cập nhật trạng thái ghế thành công');
          return;
        }
      } catch (res) {
        if (res.response?.status === 400) {
          toast.error(res.response.data.message);
          return;
        }
        toast.error('Cập nhật trạng thái ghế thất bại');
      }
      return;
    }

    if (idSeat) {
      deleteSeat(idSeat)
        .then((res) => {
          if (res.status === 200) {
            setIdSeat(null);
            setCurrSeat({
              seatType,
              ...toApiSeatPosition(seat),
              label: seatLabel,
              cinemaTheaterId,
            });
            handleUpdateEmptySeats(true);
            setValidSeats((prev) =>
              prev.filter(
                (s) =>
                  !(
                    s.rowIndex === seat.rowIndex &&
                    s.columnIndex === seat.columnIndex
                  )
              )
            );
          }
        })
        .catch((err) => console.error('Error deleting seat:', err));
      return;
    }

    const data = currSeat
      ? currSeat
      : {
          ...seat,
          ...toApiSeatPosition(seat),
          cinemaTheaterId,
          label: seatLabel,
        };

    create(data)
      .then((res) => {
        if (res.data && res.status === 200) {
          setIdSeat(res.data.id);
          handleUpdateEmptySeats(false);
          setValidSeats((prev) => [
            ...prev.filter(
              (s) =>
                !(
                  s.rowIndex === seat.rowIndex &&
                  s.columnIndex === seat.columnIndex
                )
            ),
            res.data,
          ]);
        }
      })
      .catch((err) => console.error('Error creating seat:', err));
  };

  const renderSeatVisual = () => {
    const SeatIcon = appearance.icon;
    const iconSize = isDoubleSeat ? '48px' : '42px';

    if (!hasSeat) {
      if (isPublished) {
        return null;
      }

      return (
        <AddCircleOutlineRounded
          sx={{
            fontSize: 22,
            color: 'text.disabled',
          }}
        />
      );
    }

    return (
      <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <SeatIcon size={iconSize} color={appearance.color} />
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: '48%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'text.primary',
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          {seatLabel}
        </Typography>
        {statusSeat === 'INACTIVE' && (
          <CloseRounded
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 28,
              color: 'error.main',
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <Box
      onClick={isLocked ? undefined : handleChooseSeat}
      sx={{
        minHeight: 64,
        minWidth: 58,
        px: isDoubleSeat ? 1.25 : 0.75,
        py: 0.5,
        gridColumn: isDoubleSeat ? 'span 2' : 'span 1',
        borderRadius: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        border: isPublished
          ? '1px solid transparent'
          : `1px ${hasSeat ? 'solid' : 'dashed'} ${appearance.border}`,
        backgroundColor: isPublished
          ? 'transparent'
          : hasSeat
            ? appearance.surface
            : alpha(appearance.border, 0.18),
        transition:
          'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background-color 0.18s ease',
        '&:hover': isLocked
          ? undefined
          : {
              transform: 'translateY(-1px)',
              boxShadow: isPublished
                ? '0 10px 20px rgba(148, 163, 184, 0.12)'
                : '0 10px 24px rgba(15, 23, 42, 0.08)',
              borderColor: isPublished ? 'transparent' : appearance.color,
              backgroundColor: isPublished
                ? alpha('#94a3b8', 0.08)
                : alpha(appearance.surface, 0.92),
            },
      }}
    >
      {renderSeatVisual()}
    </Box>
  );
};

export default SeatComponent;
