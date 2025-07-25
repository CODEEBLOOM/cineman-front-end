import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invoices: [],
};

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setInvoice: (state, action) => {
      state.invoices = [...state.invoices, action.payload];
    },
    updateInvoice: (state, action) => {
      state.invoices = state.invoices.map((invoice) => {
        if (invoice.id === action.payload.id) {
          return action.payload;
        }
        return invoice;
      });
    },
  },
});

export const { setInvoice, updateInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
