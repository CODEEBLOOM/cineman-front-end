import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@apis/axiosClient';
const initialState = {
  accessToken: null,
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
    setAuthState: (state, action) => {
      state.isAuthentication = action.payload.isAuthentication;
      state.accessToken = action.payload.accessToken;
      state.status = 'fulfilled';
    },
    clearInfoAuth: () => {
      return initialState;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthentication = true;
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
        console.log(action.payload);
        state.status = 'fulfilled';
        state.accessToken = action.payload.accessToken;
        state.isAuthentication = true;
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
      const res = await axios.post('/auth/login', data);
      axios.defaults.headers.common['Authorization'] =
        `Bearer ${res.accessToken}`;
      return res;
    } catch (err) {
      if (err.response?.status >= 400) {
        return rejectWithValue(err.response.data.message);
      }
      console.error(err);
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
      const res = await axios.post(`/auth/logout`);
      return res;
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
      const res = await axios.get(
        `/auth/social/callback`,
        {
          params: {
            code,
            login_type: 'google',
          },
        },
        {
          withCredentials: true,
        }
      );
      axios.defaults.headers.common['Authorization'] =
        `Bearer ${res.accessToken}`;
      return res;
    } catch (err) {
      console.log(err);
      if (err.response.status >= 400) {
        return rejectWithValue(err.response.data.message);
      }
    }
  }
);

export const { setIsAuthentication, clearInfoAuth, setAccessToken } =
  authSlice.actions;
export default authSlice.reducer;
