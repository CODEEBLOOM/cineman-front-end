import axios from '@apis/axiosClient';

export const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/files/photo/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response?.data ?? '';
};
