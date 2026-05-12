import DoubleSeat from '@component/seat/DoubleSeat';
import RegularSeat from '@component/seat/RegularSeat';
import VIPSeat from '@component/seat/VIPSeat';

export const seatTypeAppearance = {
  REGULAR: {
    icon: RegularSeat,
    baseColor: '#b8c1cc',
    surface: '#f7f4ec',
    border: '#e7dbc2',
  },
  VIP: {
    icon: VIPSeat,
    baseColor: '#aab6c7',
    surface: '#f4f8fd',
    border: '#d7e2ef',
  },
  DOUBLE: {
    icon: DoubleSeat,
    baseColor: '#b8bcb5',
    surface: '#f9f1f3',
    border: '#ebd4da',
  },
};

export const seatStatusAppearance = {
  EMPTY: {
    iconColor: null,
    backgroundColor: null,
    borderColor: null,
    textColor: '#334155',
  },
  SELECTED: {
    iconColor: '#ffffff',
    backgroundColor: '#0a4d9c',
    borderColor: '#083d7c',
    textColor: '#ffffff',
  },
  HOLDED: {
    iconColor: '#4f8fbd',
    backgroundColor: '#edf5fb',
    borderColor: '#bfd6e7',
    textColor: '#1d4f7d',
  },
  SOLD: {
    iconColor: '#d86464',
    backgroundColor: '#fdf0f0',
    borderColor: '#f2c0c0',
    textColor: '#a33e3e',
  },
  BOOKED: {
    iconColor: '#c58b2a',
    backgroundColor: '#fdf7e8',
    borderColor: '#ecd7a2',
    textColor: '#8a641f',
  },
};

export const seatLegendItems = [
  { key: 'EMPTY', label: 'Ghế trống' },
  { key: 'SELECTED', label: 'Ghế đang chọn' },
  { key: 'HOLDED', label: 'Ghế đang giữ' },
  { key: 'SOLD', label: 'Ghế đã bán' },
  { key: 'BOOKED', label: 'Ghế đặt trước' },
];
