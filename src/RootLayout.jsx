// Supports weights 100-900
import '@fontsource-variable/roboto';
import { Alert, Snackbar } from '@mui/material';
import { closeSnackbar } from '@redux/slices/snackbarSlice';
import { Suspense, useEffect } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import ModalProvider from '@context/ModalContext.jsx';

function RootLayout() {
  const { open, type, message } = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  const handleScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <ModalProvider>
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
        <div
          className="fixed bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-black/20 transition-all duration-200 hover:cursor-pointer hover:bg-black/50"
          onClick={() => handleScroll()}
        >
          <IoIosArrowUp size={30} color="white" />
        </div>
      </div>
    </ModalProvider>
  );
}

export default RootLayout;
