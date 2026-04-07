import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractPromotionTypeList = (response) => {
  const payload = unwrapData(response);

  const candidates = [
    payload,
    payload?.data,
    payload?.data?.promotionTypes,
    payload?.data?.promotionTypeResponses,
    payload?.promotionTypes,
    payload?.promotionTypeResponses,
    payload?.items,
    payload?.content,
  ];

  const list = candidates.find((item) => Array.isArray(item));

  return Array.isArray(list) ? list : [];
};

export const extractPromotionTypeDetail = (response) => {
  const payload = unwrapData(response);

  const candidates = [
    payload?.data,
    payload?.data?.promotionType,
    payload?.promotionType,
    payload?.item,
    payload,
  ];

  const detail = candidates.find((item) => item && !Array.isArray(item));

  return detail ?? null;
};

export const normalizePromotionType = (promotionType) => ({
  ...promotionType,
  promotionTypeId:
    promotionType?.promotionTypeId ?? promotionType?.id ?? null,
  id: promotionType?.id ?? promotionType?.promotionTypeId ?? null,
  code: promotionType?.code ?? '',
  name: promotionType?.name ?? '',
  description: promotionType?.description ?? '',
});

export const findAllPromotionTypesAdmin = async () => {
  return await axios.get('/admin/promotion-type/all');
};

export const findPromotionTypeById = async (id) => {
  return await axios.get(`/admin/promotion-type/${id}`);
};

export const createPromotionType = async (data) => {
  return await axios.post('/admin/promotion-type/add', data);
};

export const updatePromotionType = async (id, data) => {
  return await axios.put(`/admin/promotion-type/${id}`, data);
};

export const deletePromotionType = async (id) => {
  return await axios.delete(`/admin/promotion-type/${id}/delete`);
};
