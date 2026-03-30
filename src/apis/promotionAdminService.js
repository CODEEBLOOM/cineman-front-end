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

  if (Array.isArray(payload?.content)) {
    return payload.content;
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
  const staff = promotion?.staff ?? promotion?.createdBy ?? promotion?.employee ?? {};
  const id = promotion?.id ?? promotion?.promotionId ?? null;
  const staffId =
    promotion?.staffId ?? staff?.id ?? staff?.staffId ?? promotion?.createdById ?? null;

  return {
    ...promotion,
    id,
    promotionId: id,
    code: promotion?.code ?? promotion?.promotionCode ?? '',
    name: promotion?.name ?? promotion?.promotionName ?? '',
    content: promotion?.content ?? promotion?.description ?? '',
    startDate: promotion?.startDate ?? promotion?.startAt ?? null,
    endDate: promotion?.endDate ?? promotion?.endAt ?? null,
    discount: Number(promotion?.discount ?? 0),
    quantity: Number(promotion?.quantity ?? promotion?.totalQuantity ?? 0),
    limitAmount: Number(promotion?.limitAmount ?? promotion?.minimumAmount ?? 0),
    staffId,
    staffName:
      promotion?.staffName ??
      staff?.fullName ??
      staff?.name ??
      staff?.staffName ??
      '',
    status: String(promotion?.status ?? 'INACTIVE').toUpperCase(),
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
