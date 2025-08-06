import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invoices: [],
  customer: null,
  voucher: null,
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
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Clear all invoices
     * @returns {object} Initial state of invoices
     */
    /*******  24bbbf81-a4df-4ce1-9e55-037f4ab2e77c  *******/
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
  },
});

export const {
  setInvoice,
  updateInvoice,
  clearInvoice,
  removeInvoice,
  setCustomer,
  setVoucher,
} = invoiceSlice.actions;
export default invoiceSlice.reducer;
