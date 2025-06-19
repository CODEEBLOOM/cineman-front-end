import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@apis/axiosClient';

const initialState = {
  accessToken: null,
  refreshToken: null,
  isAuthentication: false,
  status: 'idle',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.isAuthentication = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(fetchLogin.rejected, (state) => {
        state.status = 'rejected';
      });
  },
});

export const fetchLogin = createAsyncThunk(
  'auth/fetchLogin',
  async (data, { rejectWithValue }) => {
    try {
      return await axios.post('/auth/login', data);
    } catch (err) {
      console.log(err);
      if (err.response.status >= 400) {
        return rejectWithValue(err.response.data.message);
      }
    }
  }
);

export default authSlice.reducer;
