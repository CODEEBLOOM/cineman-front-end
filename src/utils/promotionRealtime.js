import { normalizePromotion } from '@apis/promotionAdminService';

export const PROMOTION_ACTIVATED_EVENT = 'promotion:activated';

const REALTIME_PATH = '/cineman-ws';
const PROMOTION_ACTIVATED_TYPE = 'PROMOTION_ACTIVATED';

const unwrapPromotionPayload = (payload) => {
  const candidates = [
    payload?.content,
    payload?.promotion,
    payload?.data,
    payload,
  ];

  return candidates.find(
    (item) => item && typeof item === 'object' && !Array.isArray(item)
  );
};

export const resolveRealtimeBrokerUrl = () => {
  if (import.meta.env.VITE_REALTIME) {
    return import.meta.env.VITE_REALTIME;
  }

  if (!import.meta.env.VITE_HOST) {
    return REALTIME_PATH;
  }

  try {
    const apiUrl = new URL(import.meta.env.VITE_HOST);
    apiUrl.protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    apiUrl.pathname = REALTIME_PATH;
    apiUrl.search = '';
    apiUrl.hash = '';
    return apiUrl.toString();
  } catch (error) {
    console.error('Không thể tạo realtime broker url:', error);
    return REALTIME_PATH;
  }
};

export const parsePromotionActivatedMessage = (frameBody) => {
  if (!frameBody) {
    return null;
  }

  try {
    const payload = JSON.parse(frameBody);
    const type = String(payload?.type ?? PROMOTION_ACTIVATED_TYPE)
      .trim()
      .toUpperCase();

    if (type !== PROMOTION_ACTIVATED_TYPE) {
      return null;
    }

    const promotionSource = unwrapPromotionPayload(payload);

    if (!promotionSource) {
      return null;
    }

    const promotion = normalizePromotion(promotionSource);

    if (!promotion?.id && !promotion?.code && !promotion?.name) {
      return null;
    }

    return {
      type,
      promotion,
      payload,
    };
  } catch (error) {
    console.error('Không thể parse promotion activated message:', error);
    return null;
  }
};

export const emitPromotionActivatedEvent = ({ promotion, payload }) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(PROMOTION_ACTIVATED_EVENT, {
      detail: {
        promotion,
        payload,
      },
    })
  );
};

export const buildPromotionActivatedToastMessage = (promotion) => {
  if (!promotion) {
    return 'Bạn vừa nhận được một voucher mới.';
  }

  if (promotion.code) {
    return `Bạn vừa nhận voucher ${promotion.code}. Mở "Voucher của tôi" để sử dụng ngay.`;
  }

  if (promotion.name) {
    return `Bạn vừa nhận ưu đãi "${promotion.name}". Mở "Voucher của tôi" để xem chi tiết.`;
  }

  return 'Bạn vừa nhận được một voucher mới.';
};

