const AUTH_REDIRECT_KEY = 'poly-cinemas:auth-redirect';

const sanitizeRedirectUrl = (value, fallback = '/') => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const normalizedValue = value.trim();

  if (!normalizedValue.startsWith('/') || normalizedValue.startsWith('/auth')) {
    return fallback;
  }

  return normalizedValue || fallback;
};

export const buildRedirectUrl = (locationLike, fallback = '/') => {
  if (!locationLike) {
    return fallback;
  }

  if (typeof locationLike === 'string') {
    return sanitizeRedirectUrl(locationLike, fallback);
  }

  const pathname = locationLike.pathname || '';
  const search = locationLike.search || '';
  const hash = locationLike.hash || '';
  const combinedUrl = `${pathname}${search}${hash}`;

  return sanitizeRedirectUrl(combinedUrl, fallback);
};

export const persistAuthRedirect = (locationLike) => {
  if (typeof window === 'undefined') {
    return '/';
  }

  const redirectUrl = buildRedirectUrl(locationLike);

  if (redirectUrl && redirectUrl !== '/') {
    window.sessionStorage.setItem(AUTH_REDIRECT_KEY, redirectUrl);
  } else {
    window.sessionStorage.removeItem(AUTH_REDIRECT_KEY);
  }

  return redirectUrl;
};

export const getStoredAuthRedirect = (fallback = '/') => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  return sanitizeRedirectUrl(
    window.sessionStorage.getItem(AUTH_REDIRECT_KEY),
    fallback
  );
};

export const resolveAuthRedirect = (locationLike, fallback = '/') => {
  const fromLocation = buildRedirectUrl(locationLike, '');

  if (fromLocation) {
    return fromLocation;
  }

  return getStoredAuthRedirect(fallback);
};

export const clearAuthRedirect = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(AUTH_REDIRECT_KEY);
};
