import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractPromotionList = (response) => {
  const payload = unwrapData(response);

  const candidates = [
    payload,
    payload?.data,
    payload?.data?.promotions,
    payload?.promotions,
    payload?.items,
    payload?.content,
  ];

  const list = candidates.find((item) => Array.isArray(item));

  return Array.isArray(list) ? list : [];
};

export const extractPromotionDetail = (response) => {
  const payload = unwrapData(response);

  const candidates = [payload?.data, payload?.promotion, payload?.item, payload];
  const detail = candidates.find((item) => item && !Array.isArray(item));

  return detail ?? null;
};

export const normalizePromotion = (promotion) => {
  const staff = promotion?.staff ?? promotion?.createdBy ?? promotion?.employee ?? {};
  const promotionType = promotion?.promotionType ?? {};
  const id = promotion?.id ?? promotion?.promotionId ?? null;
  const staffId =
    promotion?.staffId ?? staff?.id ?? staff?.staffId ?? promotion?.createdById ?? null;
  const membershipRankIds = Array.isArray(promotion?.membershipRankIds)
    ? promotion.membershipRankIds
    : Array.isArray(promotion?.membershipRanks)
      ? promotion.membershipRanks
          .map((rank) => rank?.id ?? rank?.membershipRankId)
          .filter((rankId) => rankId || rankId === 0)
      : [];
  const membershipRankNames = Array.isArray(promotion?.membershipRankNames)
    ? promotion.membershipRankNames
    : Array.isArray(promotion?.membershipRanks)
      ? promotion.membershipRanks.map((rank) => rank?.name).filter(Boolean)
      : [];

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
    promotionTypeId:
      promotion?.promotionTypeId ??
      promotionType?.id ??
      promotionType?.promotionTypeId ??
      null,
    promotionTypeName: promotionType?.name ?? promotion?.promotionTypeName ?? '',
    applicableForAllRanks:
      promotion?.applicableForAllRanks ?? membershipRankIds.length === 0,
    membershipRankIds,
    membershipRankNames,
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
