import {
  createMovieReview,
  deleteMovieReview,
  getMovieReviewEligibility,
  getMovieReviews,
  updateMovieReview,
} from '@apis/movieReviewService';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import LoginRounded from '@mui/icons-material/LoginRounded';
import StarBorderRounded from '@mui/icons-material/StarBorderRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import DateFormatter from '@utils/DateFormatter';
import { persistAuthRedirect } from '@utils/authRedirect';
import { containsProfanity } from '@utils/profanityFilter';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const PAGE_SIZE = 6;
const FALLBACK_AVATAR_GRADIENTS = [
  'from-[#fde68a] to-[#f59e0b]',
  'from-[#bfdbfe] to-[#2563eb]',
  'from-[#c4b5fd] to-[#7c3aed]',
  'from-[#a7f3d0] to-[#059669]',
];

const extractPayload = (response) => response?.data ?? {};

const resolveNumber = (...values) => {
  for (const value of values) {
    const nextNumber = Number(value);

    if (!Number.isNaN(nextNumber)) {
      return nextNumber;
    }
  }

  return 0;
};

const resolveText = (...values) => {
  for (const value of values) {
    if (typeof value === 'string') {
      return value;
    }
  }

  return '';
};

const resolveMediaUrl = (value) => {
  if (!value) {
    return '';
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const storageBaseUrl = String(import.meta.env.VITE_STORAGES || '').replace(
    /\/$/,
    ''
  );

  if (!storageBaseUrl) {
    return value;
  }

  return `${storageBaseUrl}/${String(value).replace(/^\//, '')}`;
};

const formatDateTime = (value) => {
  if (!value) {
    return 'Vừa xong';
  }

  const nextDate = new Date(value);

  if (Number.isNaN(nextDate.getTime())) {
    return 'Vừa xong';
  }

  return new DateFormatter(nextDate).format('DD/MM/YYYY HH:mm');
};

const getInitials = (fullName) => {
  const sanitizedName = String(fullName || '').trim();

  if (!sanitizedName) {
    return 'PC';
  }

  return sanitizedName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
};

const normalizeReview = (review, currentUserId) => {
  if (!review || typeof review !== 'object') {
    return null;
  }

  const author =
    review.user || review.customer || review.reviewer || review.account || {};
  const authorUserId =
    author.userId ?? author.id ?? review.userId ?? review.customerId ?? null;
  const fullName = resolveText(
    author.fullName,
    author.name,
    author.username,
    review.fullName,
    review.customerName,
    review.reviewerName,
    'Khán giả Poly Cinemas'
  );

  const normalizedReview = {
    id:
      review.reviewId ??
      review.id ??
      review.movieReviewId ??
      review.commentId ??
      null,
    ratingScore: resolveNumber(
      review.ratingScore,
      review.rating,
      review.score,
      review.star
    ),
    comment: resolveText(review.comment, review.content, review.reviewComment),
    createdAt: resolveText(
      review.createdAt,
      review.createAt,
      review.reviewedAt,
      review.createdDate
    ),
    updatedAt: resolveText(
      review.updatedAt,
      review.updateAt,
      review.modifiedAt,
      review.lastModifiedDate
    ),
    fullName,
    avatar: resolveMediaUrl(
      author.avatar ?? review.avatar ?? review.reviewerAvatar
    ),
    userId: authorUserId,
    isMine: Boolean(
      review.isMine ??
        review.ownedByCurrentUser ??
        review.currentUserReview ??
        (currentUserId && authorUserId === currentUserId)
    ),
  };

  return normalizedReview;
};

const buildEmptyEligibility = () => ({
  averageRating: 0,
  reviewCount: 0,
  authenticated: false,
  canReview: false,
  hasReviewed: false,
  myReview: null,
});

const buildEmptyReviewPage = () => ({
  reviews: [],
  meta: {
    currentPage: 0,
    pageSize: PAGE_SIZE,
    totalPages: 0,
    totalElements: 0,
  },
});

const StarRow = ({
  value = 0,
  onSelect,
  interactive = false,
  sizeClassName = 'text-[20px]',
}) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= value;
      const StarIcon = isActive ? StarRounded : StarBorderRounded;

      if (!interactive) {
        return (
          <span
            key={starValue}
            className={`${sizeClassName} ${isActive ? 'text-[#f59e0b]' : 'text-slate-300'}`}
          >
            <StarIcon fontSize="inherit" />
          </span>
        );
      }

      return (
        <button
          key={starValue}
          type="button"
          onClick={() => onSelect?.(starValue)}
          className={`${sizeClassName} rounded-full p-1 transition hover:scale-105 ${
            isActive ? 'text-[#f59e0b]' : 'text-slate-300 hover:text-[#f59e0b]'
          }`}
          aria-label={`Chọn ${starValue} sao`}
        >
          <StarIcon fontSize="inherit" />
        </button>
      );
    })}
  </div>
);

const ReviewSkeletonCard = () => (
  <div className="flex gap-3 py-4 first:pt-0 last:pb-0">
    <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded-full bg-slate-200" />
    <div className="flex-1 animate-pulse">
      <div className="h-3 w-32 rounded-full bg-slate-200" />
      <div className="mt-2 h-3 w-full rounded-full bg-slate-100" />
      <div className="mt-2 h-3 w-[80%] rounded-full bg-slate-100" />
    </div>
  </div>
);

const MovieReviewSection = ({ movieId, movieTitle, onReviewSummaryChange }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const { isAuthentication } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [reviewPage, setReviewPage] = useState(buildEmptyReviewPage);
  const [eligibility, setEligibility] = useState(buildEmptyEligibility);
  const [reviewForm, setReviewForm] = useState({
    ratingScore: 0,
    comment: '',
  });

  const currentUserId = user?.userId ?? null;

  const loadReviewData = useCallback(async () => {
    if (!movieId) {
      setReviewPage(buildEmptyReviewPage());
      setEligibility(buildEmptyEligibility());
      return;
    }

    setIsLoading(true);

    try {
      const [reviewsResponse, eligibilityResponse] = await Promise.all([
        getMovieReviews(movieId, {
          page: currentPage,
          size: PAGE_SIZE,
        }),
        getMovieReviewEligibility(movieId),
      ]);

      const reviewPayload = extractPayload(reviewsResponse);
      const eligibilityPayload = extractPayload(eligibilityResponse);
      const normalizedReviews = (
        reviewPayload?.reviews ||
        reviewPayload?.content ||
        reviewPayload?.items ||
        []
      )
        .map((review) => normalizeReview(review, currentUserId))
        .filter(Boolean);
      const normalizedMyReview = normalizeReview(
        eligibilityPayload?.myReview,
        currentUserId
      );
      const nextReviewPage = {
        reviews: normalizedReviews,
        meta: {
          currentPage: resolveNumber(
            reviewPayload?.meta?.currentPage,
            reviewPayload?.page,
            currentPage
          ),
          pageSize: resolveNumber(
            reviewPayload?.meta?.pageSize,
            reviewPayload?.size,
            PAGE_SIZE
          ),
          totalPages: resolveNumber(
            reviewPayload?.meta?.totalPages,
            reviewPayload?.totalPages
          ),
          totalElements: resolveNumber(
            reviewPayload?.meta?.totalElements,
            reviewPayload?.totalElements,
            reviewPayload?.reviewCount,
            normalizedReviews.length
          ),
        },
      };
      const nextEligibility = {
        averageRating: resolveNumber(
          eligibilityPayload?.averageRating,
          reviewPayload?.averageRating
        ),
        reviewCount: resolveNumber(
          eligibilityPayload?.reviewCount,
          reviewPayload?.reviewCount,
          nextReviewPage.meta.totalElements
        ),
        authenticated: Boolean(
          eligibilityPayload?.authenticated || isAuthentication
        ),
        canReview: Boolean(eligibilityPayload?.canReview),
        hasReviewed: Boolean(
          eligibilityPayload?.hasReviewed ?? normalizedMyReview?.id
        ),
        myReview: normalizedMyReview,
      };

      setReviewPage(nextReviewPage);
      setEligibility(nextEligibility);
      onReviewSummaryChange?.({
        averageRating: nextEligibility.averageRating,
        reviewCount: nextEligibility.reviewCount,
        canReview: nextEligibility.canReview,
        hasReviewed: nextEligibility.hasReviewed,
        myReview: nextEligibility.myReview,
      });
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || 'Không thể tải danh sách đánh giá.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    currentUserId,
    isAuthentication,
    movieId,
    onReviewSummaryChange,
  ]);

  useEffect(() => {
    loadReviewData();
  }, [loadReviewData]);

  useEffect(() => {
    if (eligibility?.myReview) {
      setReviewForm({
        ratingScore: resolveNumber(eligibility.myReview.ratingScore),
        comment: eligibility.myReview.comment || '',
      });
      return;
    }

    setReviewForm({
      ratingScore: 0,
      comment: '',
    });
  }, [
    eligibility?.myReview?.comment,
    eligibility?.myReview?.id,
    eligibility?.myReview?.ratingScore,
    movieId,
  ]);

  useEffect(() => {
    if (window.location.hash !== '#movie-reviews') {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 250);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [movieId, isLoading]);

  useEffect(() => {
    if (isAuthentication) {
      return;
    }

    setEligibility((prevState) => ({
      ...prevState,
      authenticated: false,
      canReview: false,
      hasReviewed: false,
      myReview: null,
    }));
    setReviewForm({
      ratingScore: 0,
      comment: '',
    });
  }, [isAuthentication]);

  const hasExistingReview = Boolean(
    eligibility?.hasReviewed || eligibility?.myReview?.id
  );
  const isViewerAuthenticated = Boolean(isAuthentication);
  const canManageOwnReview = Boolean(
    isViewerAuthenticated && (eligibility?.canReview || hasExistingReview)
  );
  const currentPageIndex = reviewPage.meta.currentPage || 0;
  const totalPages = reviewPage.meta.totalPages || 0;
  const profanityValidationMessage = useMemo(() => {
    const trimmedComment = reviewForm.comment.trim();

    if (!trimmedComment || !containsProfanity(trimmedComment)) {
      return '';
    }

    return 'Noi dung review khong duoc chua tu ngu tho tuc hoac cong kich.';
  }, [reviewForm.comment]);
  const currentAverageRating = useMemo(() => {
    if (eligibility.reviewCount === 0) {
      return '0.0';
    }

    return resolveNumber(eligibility.averageRating).toFixed(1);
  }, [eligibility.averageRating, eligibility.reviewCount]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) {
      return [];
    }

    return Array.from({ length: totalPages }, (_, index) => index);
  }, [totalPages]);

  const handleChangeRating = (ratingScore) => {
    setReviewForm((prevState) => ({
      ...prevState,
      ratingScore,
    }));
  };

  const handleChangeComment = (event) => {
    setReviewForm((prevState) => ({
      ...prevState,
      comment: event.target.value.slice(0, 1000),
    }));
  };

  const refreshAfterMutation = async () => {
    if (currentPage !== 0) {
      setCurrentPage(0);
      return;
    }

    await loadReviewData();
  };

  const handleRequireLogin = () => {
    persistAuthRedirect({
      pathname: `/detail-movie/${movieId}`,
      hash: '#movie-reviews',
    });
    navigate('/auth/login?auth=login');
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    if (!isViewerAuthenticated) {
      toast.info('Bạn cần đăng nhập để gửi hoặc cập nhật đánh giá.');
      return;
    }

    if (!canManageOwnReview) {
      toast.info(
        'Bạn chỉ có thể đánh giá phim khi đã mua vé và thanh toán thành công.'
      );
      return;
    }

    if (!reviewForm.ratingScore) {
      toast.error('Vui lòng chọn số sao đánh giá.');
      return;
    }

    const trimmedComment = reviewForm.comment.trim();

    if (containsProfanity(trimmedComment)) {
      toast.error(
        'Noi dung review co tu ngu khong phu hop. Vui long chinh sua truoc khi gui.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ratingScore: reviewForm.ratingScore,
        comment: trimmedComment,
      };

      if (hasExistingReview) {
        await updateMovieReview(movieId, payload);
        toast.success('Đã cập nhật đánh giá của bạn.');
      } else {
        await createMovieReview(movieId, payload);
        toast.success('Đã gửi đánh giá thành công.');
      }

      await refreshAfterMutation();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || 'Không thể lưu đánh giá lúc này.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!isViewerAuthenticated) {
      toast.info('Bạn cần đăng nhập để xóa đánh giá.');
      return;
    }

    if (!hasExistingReview) {
      return;
    }

    const confirmed = window.confirm(
      'Bạn có chắc muốn xóa đánh giá của mình cho bộ phim này không?'
    );

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);

    try {
      await deleteMovieReview(movieId);
      toast.success('Đã xóa đánh giá của bạn.');
      setReviewForm({
        ratingScore: 0,
        comment: '',
      });
      await refreshAfterMutation();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || 'Không thể xóa đánh giá lúc này.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="movie-reviews"
      ref={sectionRef}
      className="container mb-12 scroll-mt-24"
    >
      <div className="rounded-[12px] border border-slate-200 bg-white">
        <header className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[18px] font-semibold text-slate-800">
            Đánh giá ({eligibility.reviewCount})
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[20px] font-bold text-[#062d5c]">
              {currentAverageRating}
            </span>
            <StarRow
              value={Math.round(resolveNumber(eligibility.averageRating))}
              sizeClassName="text-[16px]"
            />
            <span className="text-xs text-slate-500">/ 5</span>
          </div>
        </header>

        <div className="px-5 py-4">
          {!isViewerAuthenticated ? (
            <div className="mb-5 flex flex-col gap-2 rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Đăng nhập để gửi đánh giá của bạn.
              </p>
              <button
                type="button"
                onClick={handleRequireLogin}
                className="inline-flex items-center gap-1.5 self-start rounded-md bg-[#0a4d9c] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#083d7c] sm:self-auto"
              >
                <LoginRounded sx={{ fontSize: 16 }} />
                Đăng nhập
              </button>
            </div>
          ) : canManageOwnReview ? (
            <form
              onSubmit={handleSubmitReview}
              className="mb-5 rounded-[10px] border border-slate-200 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">
                  {hasExistingReview ? 'Đánh giá của bạn' : 'Đánh giá'}
                </span>
                <StarRow
                  value={reviewForm.ratingScore}
                  interactive
                  onSelect={handleChangeRating}
                  sizeClassName="text-[22px]"
                />
              </div>

              <textarea
                id="movie-review-comment"
                rows={3}
                maxLength={1000}
                value={reviewForm.comment}
                onChange={handleChangeComment}
                placeholder="Chia sẻ cảm nhận của bạn..."
                className="mt-3 w-full resize-none rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0a4d9c]"
              />

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  {reviewForm.comment.length}/1000
                </p>
                <div className="flex items-center gap-2">
                  {hasExistingReview ? (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleDeleteReview}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#c24141] transition hover:bg-[#fff6f6] disabled:opacity-60"
                    >
                      <DeleteOutlineRounded sx={{ fontSize: 16 }} />
                      Xóa
                    </button>
                  ) : null}
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || Boolean(profanityValidationMessage)
                    }
                    className="inline-flex items-center gap-1 rounded-md bg-[#0a4d9c] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#083d7c] disabled:opacity-60"
                  >
                    {isSubmitting
                      ? 'Đang lưu...'
                      : hasExistingReview
                        ? 'Cập nhật'
                        : 'Gửi'}
                  </button>
                </div>
              </div>
              {profanityValidationMessage ? (
                <p className="mt-2 text-xs text-[#c24141]">
                  {profanityValidationMessage}
                </p>
              ) : null}
            </form>
          ) : null}

          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <>
                <ReviewSkeletonCard />
                <ReviewSkeletonCard />
                <ReviewSkeletonCard />
              </>
            ) : reviewPage.reviews.length > 0 ? (
              reviewPage.reviews.map((review, index) => {
                const gradientClass =
                  FALLBACK_AVATAR_GRADIENTS[
                    index % FALLBACK_AVATAR_GRADIENTS.length
                  ];

                return (
                  <article
                    key={review.id || `${review.fullName}-${index}`}
                    className="flex gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.fullName}
                        className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradientClass} text-xs font-bold text-white`}
                      >
                        {getInitials(review.fullName)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-slate-800">
                          {review.fullName}
                        </span>
                        {review.isMine ? (
                          <span className="rounded bg-[#e7f6ef] px-1.5 py-0.5 text-[10px] font-semibold text-[#127a47]">
                            Bạn
                          </span>
                        ) : null}
                        <StarRow
                          value={review.ratingScore}
                          sizeClassName="text-[14px]"
                        />
                        <span className="text-xs text-slate-400">
                          · {formatDateTime(review.updatedAt || review.createdAt)}
                        </span>
                      </div>
                      {review.comment ? (
                        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                          {review.comment}
                        </p>
                      ) : null}
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-slate-500">
                  Chưa có đánh giá nào cho phim này.
                </p>
              </div>
            )}
          </div>

          {pageNumbers.length > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((prevState) => prevState - 1)}
                disabled={currentPageIndex <= 0}
                className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ‹
              </button>

              {pageNumbers.map((pageNumber) => {
                const isActive = pageNumber === currentPageIndex;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`h-7 min-w-7 rounded-md px-2 text-xs font-semibold transition ${
                      isActive
                        ? 'bg-[#0a4d9c] text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNumber + 1}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setCurrentPage((prevState) => prevState + 1)}
                disabled={currentPageIndex >= totalPages - 1}
                className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ›
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default MovieReviewSection;
