import { CircularProgress } from '@mui/material';
import { loginGoogle } from '@redux/slices/authSlice';
import { openSnackbar } from '@redux/slices/snackbarSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    try {
      dispatch(loginGoogle(code)).unwrap();
      dispatch(openSnackbar({ message: 'Đăng nhập thành công ' }));
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
    }
  }, [code, dispatch, navigate, from]);

  return (
    <div className="flex h-[300px] flex-col items-center justify-center gap-3">
      <CircularProgress size={50} className="mr-2" />
      <p>Xử lý đăng nhập ...</p>
    </div>
  );
};
export default GoogleCallback;
