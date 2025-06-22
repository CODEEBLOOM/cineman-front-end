import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@apis/axiosClient';
import { snackbarSlice } from '@redux/slices/snackbarSlice.js';

const initialState = {
  accessToken: null,
  refreshToken: null,
  isAuthentication: false,
  status: 'idle',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthentication: (state, action) => {
      state.isAuthentication = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /* Fetch login */
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
      })

      /* fetch logout */
      .addCase(fetchLogout.fulfilled, (state) => {
        state.status = 'idle';
        state.isAuthentication = false;
        state.accessToken = null;
        state.refreshToken = null;
      });
  },
});

/**
 * AsyncThunk login
 */
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

/**
 * AsyncThunk logout
 */
export const fetchLogout = createAsyncThunk(
  'auth/fetchLogout',
  async (_, { rejectWithValue }) => {
    try {
      return await axios.post('/auth/logout');
    } catch (err) {
      console.log(err);
      if (err.response.status >= 400) {
        return rejectWithValue(err.response.data.message);
      }
    }
  }
);

export const { setIsAuthentication } = authSlice.actions;
export default authSlice.reducer;
