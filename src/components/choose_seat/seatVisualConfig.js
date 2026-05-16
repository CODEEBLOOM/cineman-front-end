export const SEAT_TYPE_PALETTE = {
  REGULAR: {
    background: '#ffffff',
    border: '#cbd5e1',
    text: '#334155',
    swatch: '#ffffff',
    swatchBorder: '#cbd5e1',
  },
  VIP: {
    background: '#ede9fe',
    border: '#c4b5fd',
    text: '#5b21b6',
    swatch: '#c4b5fd',
    swatchBorder: '#a78bfa',
  },
  DOUBLE: {
    background: '#fef3c7',
    border: '#fcd34d',
    text: '#78350f',
    swatch: '#fcd34d',
    swatchBorder: '#f59e0b',
  },
};

export const SEAT_STATUS_PALETTE = {
  EMPTY: null,
  SELECTED: {
    background: '#0a4d9c',
    border: '#083d7c',
    text: '#ffffff',
    swatch: '#0a4d9c',
    swatchBorder: '#083d7c',
    showCheck: true,
  },
  HOLDED: {
    background: '#dbeafe',
    border: '#93c5fd',
    text: '#1e3a8a',
    swatch: '#bfdbfe',
    swatchBorder: '#93c5fd',
    showCheck: true,
  },
  SOLD: {
    background: '#fecaca',
    border: '#fca5a5',
    text: '#7f1d1d',
    swatch: '#fca5a5',
    swatchBorder: '#f87171',
    showCheck: false,
  },
  BOOKED: {
    background: '#fed7aa',
    border: '#fdba74',
    text: '#7c2d12',
    swatch: '#fdba74',
    swatchBorder: '#fb923c',
    showCheck: false,
  },
};

export const getSeatStyle = (status, seatTypeId) => {
  const type = SEAT_TYPE_PALETTE[seatTypeId] || SEAT_TYPE_PALETTE.REGULAR;
  const state = SEAT_STATUS_PALETTE[status];

  if (status === 'SELECTED' && state) {
    return {
      background: state.background,
      border: state.border,
      text: state.text,
      showCheck: true,
    };
  }

  if (state) {
    return {
      background: state.background,
      border: state.border,
      text: state.text,
      showCheck: !!state.showCheck,
    };
  }

  return {
    background: type.background,
    border: type.border,
    text: type.text,
    showCheck: false,
  };
};

export const seatLegendItems = [
  {
    key: 'EMPTY',
    label: 'Ghế trống',
    swatch: SEAT_TYPE_PALETTE.REGULAR.swatch,
    swatchBorder: SEAT_TYPE_PALETTE.REGULAR.swatchBorder,
    checked: false,
  },
  {
    key: 'SELECTED',
    label: 'Ghế đã chọn',
    swatch: SEAT_STATUS_PALETTE.SELECTED.swatch,
    swatchBorder: SEAT_STATUS_PALETTE.SELECTED.swatchBorder,
    checked: true,
    checkColor: '#ffffff',
  },
  {
    key: 'HOLDED',
    label: 'Ghế đang giữ',
    swatch: SEAT_STATUS_PALETTE.HOLDED.swatch,
    swatchBorder: SEAT_STATUS_PALETTE.HOLDED.swatchBorder,
    checked: true,
    checkColor: '#1e3a8a',
  },
  {
    key: 'SOLD',
    label: 'Ghế đã bán',
    swatch: SEAT_STATUS_PALETTE.SOLD.swatch,
    swatchBorder: SEAT_STATUS_PALETTE.SOLD.swatchBorder,
    checked: true,
    checkColor: '#7f1d1d',
  },
  {
    key: 'DOUBLE',
    label: 'Ghế đôi',
    swatch: SEAT_TYPE_PALETTE.DOUBLE.swatch,
    swatchBorder: SEAT_TYPE_PALETTE.DOUBLE.swatchBorder,
    checked: true,
    checkColor: '#78350f',
  },
  {
    key: 'VIP',
    label: 'Ghế VIP',
    swatch: SEAT_TYPE_PALETTE.VIP.swatch,
    swatchBorder: SEAT_TYPE_PALETTE.VIP.swatchBorder,
    checked: true,
    checkColor: '#5b21b6',
  },
];
