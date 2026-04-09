import {
  createMovieReview,
  deleteMovieReview,
  getMovieReviewEligibility,
  getMovieReviews,
  updateMovieReview,
} from '@apis/movieReviewService';
import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import LoginRounded from '@mui/icons-material/LoginRounded';
import RateReviewRounded from '@mui/icons-material/RateReviewRounded';
import StarBorderRounded from '@mui/icons-material/StarBorderRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import VerifiedRounded from '@mui/icons-material/VerifiedRounded';
import DateFormatter from '@utils/DateFormatter';
import { persistAuthRedirect } from '@utils/authRedirect';
import { containsProfanity } from '@utils/profanityFilter';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  <div className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm">
    <div className="animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-slate-200" />
        <div className="flex-1">
          <div className="h-4 w-36 rounded-full bg-slate-200" />
          <div className="mt-3 h-4 w-24 rounded-full bg-slate-200" />
          <div className="mt-4 h-3 w-full rounded-full bg-slate-100" />
          <div className="mt-2 h-3 w-[88%] rounded-full bg-slate-100" />
        </div>
      </div>
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
      <div className="overflow-hidden rounded-[12px] border border-[#d9e4f0] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_50%,#f1f6fb_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <div className="border-b border-[#dde7f2] px-5 py-6 md:px-7 md:py-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#3b82b6]">
                Movie Reviews
              </p>
              <h2 className="mt-2 text-[28px] font-bold leading-tight text-[#15314b] md:text-[34px]">
                Cảm nhận của khán giả về {movieTitle || 'bộ phim này'}
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[12px] border border-[#ffe4a6] bg-[#fff9ea] px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b7791f]">
                  Điểm trung bình
                </p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-[30px] font-extrabold text-[#9a5a00]">
                    {currentAverageRating}
                  </span>
                  <span className="pb-1 text-sm font-medium text-[#9a5a00]">
                    / 5
                  </span>
                </div>
                <div className="mt-2">
                  <StarRow
                    value={Math.round(resolveNumber(eligibility.averageRating))}
                  />
                </div>
              </div>

              <div className="rounded-[12px] border border-[#d4e1ef] bg-white px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Lượt đánh giá
                </p>
                <p className="mt-2 text-[30px] font-extrabold text-[#15314b]">
                  {eligibility.reviewCount}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Tổng số nhận xét công khai hiện có cho phim này.
                </p>
              </div>

              <div className="rounded-[12px] border border-[#d4e1ef] bg-[#f6fbff] px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Quyền của bạn
                </p>
                <p className="mt-2 text-[22px] font-bold text-[#15314b]">
                  {hasExistingReview
                    ? 'Đã có review'
                    : eligibility.canReview
                      ? 'Có thể đánh giá'
                      : 'Chỉ xem'}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {hasExistingReview
                    ? 'Bạn có thể cập nhật hoặc xóa review của chính mình.'
                    : eligibility.canReview
                      ? 'Backend xác nhận tài khoản của bạn đủ điều kiện gửi review.'
                      : 'Bạn vẫn xem được toàn bộ đánh giá công khai của phim.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-5 py-6 md:px-7 md:py-7 lg:grid-cols-[minmax(0,1.35fr)_380px]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f1fb] text-[#1e5d8c]">
                <ChatBubbleOutlineRounded />
              </div>
              <div>
                <h3 className="text-[22px] font-bold text-[#15314b]">
                  Đánh giá công khai
                </h3>
                <p className="text-sm text-slate-500">
                  Danh sách review mới nhất từ cộng đồng Poly Cinemas.
                </p>
              </div>
            </div>

            <div className="space-y-4">
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
                      className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
                    >
                      <div className="flex gap-4">
                        {review.avatar ? (
                          <img
                            src={review.avatar}
                            alt={review.fullName}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${gradientClass} text-sm font-bold text-white`}
                          >
                            {getInitials(review.fullName)}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-[17px] font-bold text-slate-800">
                                  {review.fullName}
                                </h4>
                                {review.isMine ? (
                                  <span className="rounded-full bg-[#e7f6ef] px-3 py-1 text-xs font-semibold text-[#127a47]">
                                    Bạn
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-1 text-sm text-slate-500">
                                {formatDateTime(
                                  review.updatedAt || review.createdAt
                                )}
                              </p>
                            </div>

                            <div className="flex flex-col items-start gap-1 md:items-end">
                              <StarRow value={review.ratingScore} />
                              <span className="text-sm font-semibold text-[#a45e00]">
                                {review.ratingScore}/5 sao
                              </span>
                            </div>
                          </div>

                          <p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-slate-600">
                            {review.comment ||
                              'Người dùng chưa để lại bình luận.'}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="rounded-[12px] border border-dashed border-slate-300 bg-white/80 px-5 py-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef6ff] text-[#1e5d8c]">
                    <RateReviewRounded />
                  </div>
                  <h4 className="mt-4 text-[22px] font-bold text-[#15314b]">
                    Chưa có đánh giá nào
                  </h4>
                  <p className="mx-auto mt-2 max-w-xl text-[15px] leading-7 text-slate-500">
                    Bộ phim này vẫn chưa có review công khai. Người dùng đủ điều
                    kiện có thể để lại nhận xét đầu tiên sau khi hoàn tất thanh
                    toán vé.
                  </p>
                </div>
              )}
            </div>

            {pageNumbers.length > 1 ? (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prevState) => prevState - 1)}
                  disabled={currentPageIndex <= 0}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#1e5d8c] hover:text-[#1e5d8c] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Trang trước
                </button>

                {pageNumbers.map((pageNumber) => {
                  const isActive = pageNumber === currentPageIndex;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`h-10 min-w-10 rounded-full px-3 text-sm font-bold transition ${
                        isActive
                          ? 'bg-[#1e5d8c] text-white shadow-md'
                          : 'border border-slate-300 bg-white text-slate-700 hover:border-[#1e5d8c] hover:text-[#1e5d8c]'
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
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#1e5d8c] hover:text-[#1e5d8c] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Trang sau
                </button>
              </div>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-0 lg:self-start">
            <div className="rounded-[12px] border border-[#d6e3ef] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#edf5fd] text-[#1e5d8c]">
                  <EditRounded />
                </div>
                <div>
                  <h3 className="text-[22px] font-bold text-[#15314b]">
                    Review của bạn
                  </h3>
                </div>
              </div>

              {!isViewerAuthenticated ? (
                <div className="mt-5 rounded-[12px] border border-dashed border-[#cbd9e6] bg-[#f8fbff] p-5">
                  <p className="text-[15px] leading-7 text-slate-600">
                    Bạn đang ở chế độ xem. Hãy đăng nhập để hệ thống kiểm tra
                    xem tài khoản của bạn có đủ điều kiện tạo review cho phim
                    này hay không.
                  </p>
                  <button
                    type="button"
                    onClick={handleRequireLogin}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1e5d8c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16496f]"
                  >
                    <LoginRounded fontSize="small" />
                    Đăng nhập để đánh giá
                  </button>
                </div>
              ) : canManageOwnReview ? (
                <form className="mt-5" onSubmit={handleSubmitReview}>
                  <div className="rounded-[12px] border border-[#dce8f2] bg-[#f8fbff] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1e5d8c]">
                        {hasExistingReview ? 'Chỉnh sửa review' : 'Tạo review'}
                      </p>
                      {hasExistingReview ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f6ef] px-3 py-1 text-xs font-semibold text-[#127a47]">
                          <VerifiedRounded sx={{ fontSize: 16 }} />
                          Review của bạn
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {hasExistingReview
                        ? 'Bạn có thể cập nhật nội dung hoặc xóa review hiện tại của mình.'
                        : 'Hãy cho biết mức độ hài lòng của bạn sau khi xem phim.'}
                    </p>

                    <div className="mt-4">
                      <p className="mb-2 text-sm font-semibold text-slate-700">
                        Số sao đánh giá
                      </p>
                      <StarRow
                        value={reviewForm.ratingScore}
                        interactive
                        onSelect={handleChangeRating}
                        sizeClassName="text-[28px]"
                      />
                    </div>

                    <div className="mt-5">
                      <label
                        htmlFor="movie-review-comment"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Bình luận
                      </label>
                      <textarea
                        id="movie-review-comment"
                        rows={6}
                        maxLength={1000}
                        value={reviewForm.comment}
                        onChange={handleChangeComment}
                        placeholder="Chia sẻ cảm nhận của bạn về phim, diễn xuất, cảm xúc hoặc chất lượng suất chiếu..."
                        className="w-full rounded-[12px] border border-slate-300 bg-white px-4 py-3 text-[15px] leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#1e5d8c] focus:ring-4 focus:ring-[#d6e8f7]"
                      />
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="text-xs text-slate-500">
                          Bình luận tối đa 1000 ký tự.
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {reviewForm.comment.length}/1000
                        </p>
                      </div>
                      {profanityValidationMessage ? (
                        <p className="mt-2 text-xs font-semibold text-[#c24141]">
                          {profanityValidationMessage}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting || Boolean(profanityValidationMessage)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#1e5d8c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16496f] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <RateReviewRounded fontSize="small" />
                      {isSubmitting
                        ? 'Đang lưu...'
                        : hasExistingReview
                          ? 'Cập nhật đánh giá'
                          : 'Gửi đánh giá'}
                    </button>

                    {hasExistingReview ? (
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleDeleteReview}
                        className="inline-flex items-center gap-2 rounded-full border border-[#efb1b1] bg-[#fff6f6] px-5 py-3 text-sm font-semibold text-[#c24141] transition hover:bg-[#feecec] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <DeleteOutlineRounded fontSize="small" />
                        Xóa review
                      </button>
                    ) : null}
                  </div>
                </form>
              ) : (
                <div className="mt-5 rounded-[12px] border border-dashed border-[#cbd9e6] bg-[#f8fbff] p-5">
                  <p className="text-[15px] leading-7 text-slate-600">
                    Tài khoản của bạn hiện chỉ có quyền xem review công khai cho
                    phim này.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default MovieReviewSection;
