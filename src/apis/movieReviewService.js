import axios from '@apis/axiosClient';

export const getMovieReviews = async (movieId, { page = 0, size = 6 } = {}) => {
  const url = `/movie/${movieId}/reviews`;

  return await axios.get(url, {
    params: {
      page,
      size,
    },
  });
};

export const getMovieReviewEligibility = async (movieId) => {
  const url = `/movie/${movieId}/reviews/eligibility`;
  return await axios.get(url);
};

export const createMovieReview = async (movieId, payload) => {
  const url = `/movie/${movieId}/reviews`;
  return await axios.post(url, payload);
};

export const updateMovieReview = async (movieId, payload) => {
  const url = `/movie/${movieId}/reviews`;
  return await axios.put(url, payload);
};

export const deleteMovieReview = async (movieId) => {
  const url = `/movie/${movieId}/reviews`;
  return await axios.delete(url);
};
