import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from '@redux/slices/authSlice.js';
import snackbarReducer from '@redux/slices/snackbarSlice';
import userReducer from '@redux/slices/userSlice.js';
import movieReducer from '@redux/slices/movieSlice.js';
import ticketReducer from '@redux/slices/ticketSlice.js';
import invoiceReducer from '@redux/slices/invoiceSlice.js';
import snackReducer from '@redux/slices/snackSlice.js';
import movieTheaterReducer from '@redux/slices/movieTheaterSlice.js';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: storage,
};

/**
 * Mục đích để tự động map dữ liệu vào localStorage tự động
 * @type
 */
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    user: userReducer,
    snackbar: snackbarReducer,
    movie: movieReducer,
    movieTheater: movieTheaterReducer,
    ticket: ticketReducer,
    invoice: invoiceReducer,
    snack: snackReducer,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PERSIST, PURGE, REGISTER, PAUSE],
      },
    }),
});

export const persistor = persistStore(store);
