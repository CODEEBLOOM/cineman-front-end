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
  reducers: {
    setIsAuthentication: (state, action) => {
      state.isAuthentication = action.payload;
    },
    clearInfoAuth: () => {
      return initialState;
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
      .addCase(fetchLogout.fulfilled, () => {
        return initialState;
      })

      /* fetch login google */
      .addCase(loginGoogle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginGoogle.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.isAuthentication = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginGoogle.rejected, (state) => {
        state.status = 'rejected';
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

/**
 * AsyncThunk login google
 */
export const loginGoogle = createAsyncThunk(
  'auth/loginGoogle',
  async (code, { rejectWithValue }) => {
    try {
      return await axios.get('/auth/social/callback', {
        params: {
          code,
          login_type: 'google',
        },
      });
    } catch (err) {
      console.log(err);
      if (err.response.status >= 400) {
        return rejectWithValue(err.response.data.message);
      }
    }
  }
);

export const { setIsAuthentication, clearInfoAuth } = authSlice.actions;
export default authSlice.reducer;
