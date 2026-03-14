import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  createdDate: null,
  query: null,
  snacks: [],
  snacksSelected: [],
};

export const invoiceASlice = createSlice({
  name: 'invoiceASlice',
  initialState,
  reducers: {
    setCreatedDate: (state, action) => {
      state.createdDate = action.payload;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setSnacks: (state, action) => {
      state.snacks = action.payload;
    },
    setSnacksSelected: (state, action) => {
      state.snacksSelected = action.payload;
    },
  },
});

export const { setCreatedDate, setQuery, setSnacks, setSnacksSelected } =
  invoiceASlice.actions;
export default invoiceASlice.reducer;
