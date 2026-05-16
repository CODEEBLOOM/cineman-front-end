import ImageComponent from '@component/ImageComponent';
import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import VerifiedRounded from '@mui/icons-material/VerifiedRounded';
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';

const toTitleCase = (value) =>
  (value ?? '')
    .toString()
    .toLocaleLowerCase('vi-VN')
    .replace(/(^|\s)\S/g, (char) => char.toLocaleUpperCase('vi-VN'));

const MovieInfoDetailComponent = ({ movie = {} }) => {
  const displayTitle = toTitleCase(movie?.title);
  const averageRating = Number(movie?.averageRating ?? 0);
  const reviewCount = Number(movie?.reviewCount ?? 0);
  const reviewBadgeLabel = movie?.hasReviewed
    ? 'Bạn đã đánh giá phim này'
    : movie?.canReview
      ? 'Bạn có thể đánh giá phim này'
      : 'Bạn đang ở chế độ xem đánh giá';

  return (
    <div className="container pb-10">
      <nav
        aria-label="breadcrumb"
        className="my-4 flex items-center gap-2 text-sm md:text-base"
      >
        <Link
          to="/"
          className="font-semibold text-gray-700 transition-colors hover:text-primary"
        >
          Trang chủ
        </Link>
        <IoIosArrowForward className="text-gray-400" />
        <span className="font-semibold text-primary line-clamp-1">
          {displayTitle}
        </span>
      </nav>

      <div className="gap-8 md:flex">
        <div className="w-[260px] flex-none rounded-2xl">
          <ImageComponent
            src={movie?.posterImage}
            width={260}
            height={412}
            className="h-full w-full rounded-3xl object-cover"
          />
        </div>

        <div className="flex-1">
          <h1 className="mb-2 text-[25px] font-bold text-primary md:text-4xl">
            {displayTitle}
          </h1>

          <div className="mb-5 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffe3a3] bg-[#fff8e8] px-4 py-2 text-sm font-semibold text-[#a15f00]">
              <StarRounded sx={{ fontSize: 20 }} />
              {reviewCount > 0
                ? `${averageRating.toFixed(1)}/5 từ ${reviewCount} đánh giá`
                : 'Chưa có đánh giá'}
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#d6e4f2] bg-[#f6fbff] px-4 py-2 text-sm font-semibold text-[#0a4d9c]">
              <ChatBubbleOutlineRounded sx={{ fontSize: 20 }} />
              {reviewCount} nhận xét công khai
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#d7eee2] bg-[#eef9f3] px-4 py-2 text-sm font-semibold text-[#127a47]">
              <VerifiedRounded sx={{ fontSize: 20 }} />
              {reviewBadgeLabel}
            </div>
          </div>

          <p className="py-3 text-justify leading-relaxed">
            {movie?.detailDescription}
          </p>

          <div className="space-y-1.5">
            <div className="flex">
              <p className="w-[200px] flex-none font-bold">Đạo diễn:</p>
              {(movie?.directors || [])
                .map((director) => director.nickname)
                .join(', ')}
            </div>

            <div className="flex">
              <p className="w-[200px] flex-none font-bold">Diễn viên:</p>
              {(movie?.casts || []).map((cast) => cast.nickname).join(', ')}
            </div>

            <div className="flex">
              <p className="w-[200px] flex-none font-bold">Thể loại:</p>
              {(movie?.genres || []).map((genre) => genre.name).join(', ')}
            </div>

            <div className="flex">
              <p className="w-[200px] flex-none font-bold">Thời lượng:</p>
              <p>
                <span>{movie?.duration}</span> Phút
              </p>
            </div>

            <div className="flex">
              <p className="w-[200px] flex-none font-bold">Ngôn ngữ:</p>
              <p>{movie?.language}</p>
            </div>

            <div className="flex">
              <p className="w-[200px] flex-none font-bold">Ngày khởi chiếu:</p>
              <p>{movie?.releaseDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfoDetailComponent;
