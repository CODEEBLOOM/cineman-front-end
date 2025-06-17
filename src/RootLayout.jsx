// Supports weights 100-900
import '@fontsource-variable/roboto-condensed';
import { Alert, Snackbar } from '@mui/material';
import { closeSnackbar } from '@redux/slices/snackbarSlice';
import { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

function RootLayout() {
  const { open, type, message } = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  return (
    <div>
      <Suspense fallback={<p>Loading ...</p>}>
        <Outlet />
      </Suspense>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => dispatch(closeSnackbar())}
      >
        <Alert severity={type} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default RootLayout;
