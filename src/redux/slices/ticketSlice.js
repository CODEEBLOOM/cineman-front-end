import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedSeats: [],
};

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    setSelectedSeats: (state, action) => {
      state.selectedSeats = action.payload;
    },
    clearSelectedSeats: () => {
      return initialState;
    },
  },
});

export const { setSelectedSeats, clearSelectedSeats } = ticketSlice.actions;
export default ticketSlice.reducer;
