import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '@apis/axiosClient';

const initialState = {
  movieTheater: {
    title: '',
    id: null,
    submenu: [],
  },
  listMovieTheater: [
    {
      title: '',
      id: null,
      submenu: [],
    },
  ],
};

export const movieTheaterSlice = createSlice({
  name: 'movieTheater',
  initialState,
  reducers: {
    setMovieTheater: (state, action) => {
      state.movieTheater = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProvince.fulfilled, (state, action) => {
      state.listMovieTheater = action.payload;
      state.movieTheater = action.payload[0];
    });
  },
});

export const fetchProvince = createAsyncThunk(
  'movieTheater/fetchProvince',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/admin/province/all`);
      let listItems = res?.data.map((item) => {
        return {
          title: item.name,
          id: item.id,
          submenu: item.movieTheaters.map((movieTheater) => {
            return {
              title: movieTheater.name,
              id: movieTheater.movieTheaterId,
            };
          }),
        };
      });
      return listItems;
    } catch (err) {
      console.log(err);
      if (err.response.status >= 400) {
        return rejectWithValue(err.response.data.message);
      }
    }
  }
);

export const { setMovieTheater } = movieTheaterSlice.actions;
export default movieTheaterSlice.reducer;
