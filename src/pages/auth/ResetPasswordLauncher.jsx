import ResetPasswordModal from '@component/auth/ResetPasswordModal';
import { useModelContext } from '@context/ModalContext.jsx';
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPasswordLauncher = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openPopup } = useModelContext();
  const launchedRef = useRef(false);

  useEffect(() => {
    if (launchedRef.current) return;
    launchedRef.current = true;
    const token =
      searchParams.get('token') || searchParams.get('resetToken') || '';
    openPopup(<ResetPasswordModal token={token} />);
    navigate('/', { replace: true });
  }, [navigate, openPopup, searchParams]);

  return null;
};

export default ResetPasswordLauncher;
