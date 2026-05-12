import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  extractMovieTheaterList,
  findAllMovieTheaterByProvinceId,
} from '@apis/movieTheaterService';
import { extractProvinceList, findAll as findAllProvince } from '@apis/provinceService';

const initialMovieTheater = {
  title: '',
  id: null,
  provinceId: null,
  provinceTitle: '',
};

const initialProvince = {
  title: '',
  id: null,
  submenu: [],
  kind: 'province',
};

const initialState = {
  movieTheater: initialMovieTheater,
  listMovieTheater: [],
  selectedProvince: initialProvince,
  hasCompletedInitialSelection: false,
};

const normalizeMovieTheater = (movieTheater, province) => ({
  title: movieTheater?.name ?? movieTheater?.title ?? '',
  id: movieTheater?.movieTheaterId ?? movieTheater?.id ?? null,
  provinceId:
    province?.id ?? movieTheater?.province?.id ?? movieTheater?.provinceId ?? null,
  provinceTitle:
    province?.name ??
    movieTheater?.province?.name ??
    movieTheater?.provinceTitle ??
    '',
  address: movieTheater?.address ?? '',
  hotline: movieTheater?.hotline ?? '',
  iframeCode: movieTheater?.iframeCode ?? '',
  kind: 'movieTheater',
});

const normalizeProvinceList = (provinces = []) =>
  provinces.map((province) => ({
    title: province?.name ?? '',
    id: province?.id ?? null,
    kind: 'province',
    submenu: (province?.movieTheaters ?? []).map((movieTheater) =>
      normalizeMovieTheater(movieTheater, province)
    ),
  }));

const findMovieTheaterById = (provinceList = [], movieTheaterId) => {
  if (movieTheaterId == null) {
    return null;
  }

  for (const province of provinceList) {
    const matchedMovieTheater = province?.submenu?.find(
      (movieTheater) => movieTheater?.id === movieTheaterId
    );

    if (matchedMovieTheater) {
      return matchedMovieTheater;
    }
  }

  return null;
};

const findProvinceByMovieTheater = (provinceList = [], movieTheater) => {
  if (movieTheater?.provinceId != null) {
    const matchedProvince = provinceList.find(
      (province) => province?.id === movieTheater.provinceId
    );

    if (matchedProvince) {
      return matchedProvince;
    }
  }

  if (movieTheater?.id == null) {
    return null;
  }

  return (
    provinceList.find((province) =>
      province?.submenu?.some((submenu) => submenu?.id === movieTheater.id)
    ) ?? null
  );
};

const getDefaultMovieTheater = (provinceList = []) => {
  for (const province of provinceList) {
    const firstMovieTheater = province?.submenu?.find(
      (movieTheater) => movieTheater?.id != null
    );

    if (firstMovieTheater) {
      return firstMovieTheater;
    }
  }

  return initialMovieTheater;
};

const resolveMovieTheaterSelection = (provinceList = [], selection) => {
  if (Array.isArray(selection?.submenu) && selection.submenu.length > 0) {
    return resolveMovieTheaterSelection(provinceList, selection.submenu[0]);
  }

  const matchedMovieTheater = findMovieTheaterById(provinceList, selection?.id);
  if (matchedMovieTheater) {
    return matchedMovieTheater;
  }

  return getDefaultMovieTheater(provinceList);
};

const resolveProvinceSelection = (provinceList = [], movieTheater) =>
  findProvinceByMovieTheater(provinceList, movieTheater) ??
  provinceList.find((province) => province?.submenu?.length > 0) ??
  provinceList[0] ??
  initialProvince;

const loadMovieTheatersForProvince = async (province) => {
  try {
    const response = await findAllMovieTheaterByProvinceId(province?.id);
    const movieTheaters = extractMovieTheaterList(response).filter(
      (movieTheater) => movieTheater?.status !== false
    );

    return {
      ...province,
      movieTheaters,
    };
  } catch (error) {
    console.log(error);
    return {
      ...province,
      movieTheaters: [],
    };
  }
};

export const fetchProvince = createAsyncThunk(
  'movieTheater/fetchProvince',
  async (_, { rejectWithValue }) => {
    try {
      const response = await findAllProvince();
      const provinces = extractProvinceList(response).filter(
        (province) => province?.active !== false
      );

      const provinceWithMovieTheaters = await Promise.all(
        provinces.map((province) => loadMovieTheatersForProvince(province))
      );

      return normalizeProvinceList(provinceWithMovieTheaters);
    } catch (err) {
      console.log(err);
      if (err.response?.status >= 400) {
        return rejectWithValue(err.response.data.message);
      }

      return rejectWithValue('Không thể tải danh sách rạp');
    }
  }
);

export const movieTheaterSlice = createSlice({
  name: 'movieTheater',
  initialState,
  reducers: {
    setMovieTheater: (state, action) => {
      const nextMovieTheater = resolveMovieTheaterSelection(
        state.listMovieTheater,
        action.payload
      );

      state.movieTheater = nextMovieTheater;
      state.selectedProvince = resolveProvinceSelection(
        state.listMovieTheater,
        nextMovieTheater
      );
      state.hasCompletedInitialSelection = true;
    },
    completeMovieTheaterSelection: (state) => {
      const nextMovieTheater = state.movieTheater?.id
        ? state.movieTheater
        : resolveMovieTheaterSelection(state.listMovieTheater, initialMovieTheater);

      state.movieTheater = nextMovieTheater;
      state.selectedProvince = resolveProvinceSelection(
        state.listMovieTheater,
        nextMovieTheater
      );
      state.hasCompletedInitialSelection = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProvince.fulfilled, (state, action) => {
      const previousSelectionId = state.movieTheater?.id;

      state.listMovieTheater = action.payload ?? [];
      state.movieTheater = resolveMovieTheaterSelection(
        state.listMovieTheater,
        state.movieTheater
      );
      state.selectedProvince = resolveProvinceSelection(
        state.listMovieTheater,
        state.movieTheater
      );

      if (!state.hasCompletedInitialSelection && previousSelectionId != null) {
        state.hasCompletedInitialSelection = true;
      }
    });
  },
});

export const { setMovieTheater, completeMovieTheaterSelection } =
  movieTheaterSlice.actions;
export default movieTheaterSlice.reducer;
