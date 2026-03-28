import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractPromotionList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.promotions)) {
    return payload.promotions;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const extractPromotionDetail = (response) => {
  const payload = unwrapData(response);

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload?.promotion && !Array.isArray(payload.promotion)) {
    return payload.promotion;
  }

  return payload;
};

export const normalizePromotion = (promotion) => {
  const staff =
    promotion?.staff ??
    promotion?.staffResponse ??
    promotion?.createdBy ??
    promotion?.employee ??
    {};

  const id = promotion?.id ?? promotion?.promotionId ?? null;
  const staffId =
    promotion?.staffId ?? staff?.staffId ?? staff?.userId ?? staff?.id ?? null;
  const staffName =
    promotion?.staffName ??
    staff?.fullName ??
    staff?.name ??
    staff?.username ??
    (staffId ? `#${staffId}` : 'Chưa xác định');

  return {
    ...promotion,
    id,
    code: promotion?.code ?? promotion?.voucherCode ?? '',
    name: promotion?.name ?? '',
    content: promotion?.content ?? promotion?.description ?? '',
    startDate: promotion?.startDate ?? null,
    endDate: promotion?.endDate ?? null,
    discount: Number(promotion?.discount ?? promotion?.percent ?? 0),
    quantity: Number(
      promotion?.quantity ?? promotion?.remainingQuantity ?? promotion?.amount ?? 0
    ),
    limitAmount: Number(
      promotion?.limitAmount ??
        promotion?.minimumOrderAmount ??
        promotion?.minAmount ??
        0
    ),
    status: promotion?.status ?? 'INACTIVE',
    staffId,
    staffName,
  };
};

export const findAllPromotionsAdmin = async (status) => {
  return await axios.get('/admin/promotion/all', {
    params: status ? { status } : undefined,
  });
};

export const findPromotionById = async (id) => {
  return await axios.get(`/admin/promotion/${id}`);
};

export const createPromotion = async (data) => {
  return await axios.post('/admin/promotion/add', data);
};

export const updatePromotion = async (id, data) => {
  return await axios.post(`/admin/promotion/${id}/update`, data);
};

export const applyPromotion = async (id) => {
  return await axios.post(`/admin/promotion/${id}/apply`);
};

export const deletePromotion = async (id) => {
  return await axios.delete(`/admin/promotion/${id}/delete`);
};
