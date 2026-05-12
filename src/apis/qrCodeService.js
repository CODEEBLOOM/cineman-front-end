import axios from '@apis/axiosClient';

const QR_CODE_BASE = '/qrcode';

export const createQrCode = async (data) => {
  return await axios.post(`${QR_CODE_BASE}/create`, data);
};
