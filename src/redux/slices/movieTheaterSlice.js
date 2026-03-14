import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '@apis/axiosClient';

const initialMovieTheater = {
  title: '',
  id: null,
  submenu: [],
};

const initialState = {
  movieTheater: initialMovieTheater,
  listMovieTheater: [],
};

export const movieTheaterSlice = createSlice({
  name: 'movieTheater',
  initialState,
  reducers: {
    setMovieTheater: (state, action) => {
      state.movieTheater = action.payload ?? initialMovieTheater;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProvince.fulfilled, (state, action) => {
      state.listMovieTheater = action.payload ?? [];
      state.movieTheater = action.payload?.[0] ?? initialMovieTheater;
    });
  },
});

export const fetchProvince = createAsyncThunk(
  'movieTheater/fetchProvince',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/admin/province/all`);
      const listItems =
        res?.data?.map((item) => {
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
        }) ?? [];
      return listItems;
    } catch (err) {
      console.log(err);
      if (err.response?.status >= 400) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue('Không thể tải danh sách rạp');
    }
  }
);

export const { setMovieTheater } = movieTheaterSlice.actions;
export default movieTheaterSlice.reducer;
