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
      });
  },
});

export const fetchLogin = createAsyncThunk('auth/fetchLogin', async (data) => {
  const res = await axios.post('/auth/login', data);
  return res;
});

export default authSlice.reducer;
