import Loading from '@component/Loading';
import { GOOGLE_AUTH_POPUP_MESSAGE } from '@component/auth/useGoogleAuthPopup';
import { loginGoogle } from '@redux/slices/authSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearAuthRedirect, resolveAuthRedirect } from '@utils/authRedirect';

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const location = useLocation();
  const redirectUrl = resolveAuthRedirect(location.state?.from, '/');

  useEffect(() => {
    const openerWindow = window.opener;
    const canNotifyOpener =
      Boolean(openerWindow) &&
      openerWindow !== window &&
      !openerWindow.closed;

    if (canNotifyOpener) {
      openerWindow.postMessage(
        {
          type: GOOGLE_AUTH_POPUP_MESSAGE,
          status: code ? 'success' : 'error',
          code,
          message: error || 'Đăng nhập Google thất bại.',
        },
        window.location.origin
      );

      window.close();
      return;
    }

    const login = async () => {
      if (!code) {
        toast.error(error || 'Đăng nhập Google thất bại.');
        navigate('/auth/login?auth=login', { replace: true });
        return;
      }

      try {
        await dispatch(loginGoogle(code)).unwrap();
        toast.success('Đăng nhập thành công!');
        clearAuthRedirect();
        navigate(redirectUrl, { replace: true });
      } catch (loginError) {
        toast.error(loginError);
        navigate('/auth/login?auth=login', { replace: true });
      }
    };

    login();
  }, [code, dispatch, error, navigate, redirectUrl]);

  return (
    <div className="flex h-[300px] flex-col items-center justify-center gap-3">
      <Loading content="Xử lý đăng nhập Google..." />
    </div>
  );
};

export default GoogleCallback;
