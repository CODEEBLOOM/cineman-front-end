import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  snackSelected: [],
};

export const snackSlice = createSlice({
  name: 'snack',
  initialState,
  reducers: {
    setSnack: (state, action) => {
      state.snackSelected = action.payload;
    },
    clearSnack: () => {
      return initialState;
    },
  },
});

export const { setSnack, clearSnack } = snackSlice.actions;
export default snackSlice.reducer;
