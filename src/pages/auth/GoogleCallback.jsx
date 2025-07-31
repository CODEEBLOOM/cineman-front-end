import Loading from '@component/Loading';
import { loginGoogle } from '@redux/slices/authSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

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
      toast.success('Đăng nhập thành công !');
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
    }
  }, [code, dispatch, navigate, from]);

  return (
    <div className="flex h-[300px] flex-col items-center justify-center gap-3">
      <Loading content={'Xử lý đăng nhập ...'} />
    </div>
  );
};
export default GoogleCallback;
