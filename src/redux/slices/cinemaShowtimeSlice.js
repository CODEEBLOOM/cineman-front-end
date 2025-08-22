import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '@apis/axiosClient';

const initialState = {
  showDates: null,
  showDateActive: null,
};

export const fetchShowDates = createAsyncThunk(
  'cinemaShowtime/fetchShowDates',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/show-times/cinema-theater/${id}`);
      return res.data;
    } catch (err) {
      if (err.response?.status >= 400) {
        return rejectWithValue(err.response.data.message);
      }
    }
  }
);

export const cinemaShowtimeSlice = createSlice({
  name: 'cinemaShowtime',
  initialState,
  reducers: {
    setShowDates: (state, action) => {
      state.showDates = action.payload;
    },
    setShowDateActive: (state, action) => {
      state.showDateActive = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchShowDates.fulfilled, (state, action) => {
      state.showDates = action.payload;
      state.showDateActive = action.payload && action.payload[0];
    });
  },
});

export const { setShowDates, setShowDateActive } = cinemaShowtimeSlice.actions;
export default cinemaShowtimeSlice.reducer;
