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
    clearInvoice: () => {
      return initialState;
    },
  },
});

export const { setInvoice, updateInvoice, clearInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
