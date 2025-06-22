import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  movieStatus: 'DC',
};

export const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setMovieStatus: (state, action) => {
      state.movieStatus = action.payload;
    },
  },
});

export const { setMovieStatus } = movieSlice.actions;
export default movieSlice.reducer;
