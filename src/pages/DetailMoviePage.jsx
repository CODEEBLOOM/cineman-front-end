import { findMovieById } from '@apis/movieService';
import MovieInfoDetailComponent from '@component/movie_detail/MovieInfoDetailComponent.jsx';
import MovieReviewSection from '@component/movie_detail/MovieReviewSection.jsx';
import ShowTimeComponent from '@component/movie_detail/ShowTimeComponent.jsx';
import MovieTrailerComponent from '@component/movie_detail/MovieTrailerComponent.jsx';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const DetailMoviePage = () => {
  const [movie, setMovie] = useState();
  const { id } = useParams();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    findMovieById(id)
      .then((res) => {
        setMovie(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    document.title = 'Chi tiết phim - POLY CINEMAS';
  }, []);

  const handleReviewSummaryChange = useCallback((reviewSummary) => {
    setMovie((prevMovie) => {
      if (!prevMovie) {
        return prevMovie;
      }

      const hasSameSummary =
        Number(prevMovie.averageRating ?? 0) ===
          Number(reviewSummary?.averageRating ?? 0) &&
        Number(prevMovie.reviewCount ?? 0) ===
          Number(reviewSummary?.reviewCount ?? 0) &&
        Boolean(prevMovie.canReview) === Boolean(reviewSummary?.canReview) &&
        Boolean(prevMovie.hasReviewed) === Boolean(reviewSummary?.hasReviewed) &&
        JSON.stringify(prevMovie.myReview ?? null) ===
          JSON.stringify(reviewSummary?.myReview ?? null);

      if (hasSameSummary) {
        return prevMovie;
      }

      return {
        ...prevMovie,
        ...reviewSummary,
      };
    });
  }, []);

  return (
    <>
      <MovieInfoDetailComponent movie={movie} />
      <div className="container">
        <ShowTimeComponent movieId={id} />
      </div>
      <MovieReviewSection
        movieId={id}
        movieTitle={movie?.title}
        onReviewSummaryChange={handleReviewSummaryChange}
      />
      <MovieTrailerComponent iframeUrl={movie?.trailerLink} />
    </>
  );
};

export default DetailMoviePage;
