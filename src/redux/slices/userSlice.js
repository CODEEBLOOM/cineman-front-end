import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@apis/axiosClient';

const initialState = {
  status: 'idle',
  user: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInfoUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInfoUser.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.user = action.payload;
      })
      .addCase(fetchInfoUser.rejected, (state) => {
        state.status = 'rejected';
      });
  },
});

/**
 * Fetch thông tin người dùng qua access token
 */
export const fetchInfoUser = createAsyncThunk(
  'auth/user',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post('/auth/user');
      return res.data;
    } catch (err) {
      console.log(err);
      if (err.response.status >= 400) {
        return rejectWithValue(err.response.data.message);
      }
    }
  }
);

export default userSlice.reducer;
