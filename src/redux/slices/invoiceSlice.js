import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invoices: [],
  customer: null,
  voucher: null,
  savePointRedeem: 0,
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
        if (invoice.invoice.id === action.payload.invoice.id) {
          return action.payload;
        }
        return invoice;
      });
    },
    clearInvoice: () => {
      return initialState;
    },
    removeInvoice: (state, action) => {
      state.invoices = state.invoices.filter(
        (i) => i.invoice.id !== action.payload
      );
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    setVoucher: (state, action) => {
      state.voucher = action.payload;
    },
    setSavePointRedeem: (state, action) => {
      state.savePointRedeem = action.payload;
    },
  },
});

export const {
  setInvoice,
  updateInvoice,
  clearInvoice,
  removeInvoice,
  setCustomer,
  setVoucher,
  setSavePointRedeem,
} = invoiceSlice.actions;
export default invoiceSlice.reducer;
