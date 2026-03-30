import { loginWithGoogle } from '@apis/authService';
import { loginGoogle } from '@redux/slices/authSlice';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

export const GOOGLE_AUTH_POPUP_MESSAGE = 'poly-cinemas:google-auth';

const GOOGLE_POPUP_NAME = 'poly-cinemas-google-login';
const GOOGLE_POPUP_WIDTH = 560;
const GOOGLE_POPUP_HEIGHT = 720;

const openCenteredPopup = (url) => {
  const dualScreenLeft = window.screenLeft ?? window.screenX ?? 0;
  const dualScreenTop = window.screenTop ?? window.screenY ?? 0;
  const viewportWidth =
    window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
  const viewportHeight =
    window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;

  const left = Math.max(
    0,
    Math.round(dualScreenLeft + (viewportWidth - GOOGLE_POPUP_WIDTH) / 2)
  );
  const top = Math.max(
    0,
    Math.round(dualScreenTop + (viewportHeight - GOOGLE_POPUP_HEIGHT) / 2)
  );

  return window.open(
    url,
    GOOGLE_POPUP_NAME,
    [
      'popup=yes',
      `width=${GOOGLE_POPUP_WIDTH}`,
      `height=${GOOGLE_POPUP_HEIGHT}`,
      `left=${left}`,
      `top=${top}`,
      'resizable=yes',
      'scrollbars=yes',
    ].join(',')
  );
};

export const useGoogleAuthPopup = ({
  dispatch,
  navigate,
  redirectUrl = '/',
  onLoadingChange,
}) => {
  const popupRef = useRef(null);
  const popupWatcherRef = useRef(null);

  const clearPopupWatcher = useCallback(() => {
    if (popupWatcherRef.current) {
      window.clearInterval(popupWatcherRef.current);
      popupWatcherRef.current = null;
    }
  }, []);

  const resetPopupState = useCallback(() => {
    clearPopupWatcher();
    popupRef.current = null;
    onLoadingChange?.(false);
  }, [clearPopupWatcher, onLoadingChange]);

  const startPopupWatcher = useCallback(() => {
    clearPopupWatcher();

    popupWatcherRef.current = window.setInterval(() => {
      if (popupRef.current && popupRef.current.closed) {
        resetPopupState();
      }
    }, 400);
  }, [clearPopupWatcher, resetPopupState]);

  const startGoogleAuth = useCallback(() => {
    onLoadingChange?.(true);

    loginWithGoogle()
      .then((res) => {
        const authUrl = res?.data;

        if (!authUrl) {
          throw new Error('Không lấy được đường dẫn đăng nhập Google.');
        }

        const popup = openCenteredPopup(authUrl);

        if (!popup) {
          throw new Error('Trình duyệt đã chặn popup đăng nhập Google.');
        }

        popupRef.current = popup;
        popup.focus?.();
        startPopupWatcher();
      })
      .catch((error) => {
        resetPopupState();
        toast.error(
          error?.message || 'Không thể khởi tạo đăng nhập Google lúc này.'
        );
      });
  }, [onLoadingChange, resetPopupState, startPopupWatcher]);

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type !== GOOGLE_AUTH_POPUP_MESSAGE) {
        return;
      }

      resetPopupState();

      if (event.data?.status !== 'success' || !event.data?.code) {
        toast.error(event.data?.message || 'Đăng nhập Google thất bại.');
        return;
      }

      try {
        await dispatch(loginGoogle(event.data.code)).unwrap();
        toast.success('Đăng nhập thành công!');
        navigate(redirectUrl, { replace: true });
      } catch (error) {
        toast.error(error || 'Đăng nhập Google thất bại.');
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearPopupWatcher();
    };
  }, [clearPopupWatcher, dispatch, navigate, redirectUrl, resetPopupState]);

  return { startGoogleAuth };
};
