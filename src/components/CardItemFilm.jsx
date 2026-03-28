import CustomButton from '@component/CustomButton.jsx';
import { useModelContext } from '@context/ModalContext.jsx';
import PlayCircleFilledWhiteRounded from '@mui/icons-material/PlayCircleFilledWhiteRounded';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import ImageComponent from './ImageComponent';
import ShowTimeComponent from './movie_detail/ShowTimeComponent';

const CardItemFilm = ({
  id,
  title,
  genres,
  duration,
  isUpcoming = false,
  releaseDate,
  age = 13,
  img,
  trailerLink,
}) => {
  const { openPopup, closeTopModal } = useModelContext();
  const movieTheater = useSelector(
    (state) => state.movieTheater?.movieTheater ?? { title: '' }
  );

  const renderPopup = () => {
    return (
      <div
        data-modal-placement="center"
        className="relative flex aspect-video w-full flex-col justify-start rounded-md bg-white p-5 sm:w-[80vw] md:w-[60vw]"
      >
        <span
          className="absolute right-3 top-3 hover:cursor-pointer"
          onClick={() => closeTopModal()}
        >
          <IoClose size={25} />
        </span>
        <div className="border-b-2 px-4">
          <p className="font-bold uppercase lg:text-[25px]">
            Lịch chiếu phim - <span className="capitalize">{title}</span>
          </p>
        </div>
        <div className="pb-3 pt-10 text-center">
          <p className="text-[30px] font-medium uppercase text-primary">
            {movieTheater?.title || 'Chọn rạp'}
          </p>
        </div>
        <ShowTimeComponent movieId={id} />
      </div>
    );
  };

  const handleOpenTrailer = () => {
    openPopup(
      <div data-modal-placement="center" className="relative rounded-md bg-white p-5">
        <span
          className="absolute right-3 top-3 hover:cursor-pointer"
          onClick={() => closeTopModal()}
        >
          <IoClose size={25} />
        </span>
        <p className="mb-3 border-b-2 px-2 text-[20px]">{title}</p>
        <iframe
          title="Trailer"
          src={trailerLink}
          className="aspect-video w-[80vw] md:w-[50vw]"
        />
      </div>
    );
  };

  return (
    <div className="mb-3 flex w-full gap-5 px-4 pb-4 sm:block">
      <div className="w-full min-w-[120px] max-w-[150px] sm:max-w-[300px]">
        <div className="relative aspect-[235/372] overflow-hidden rounded-[26px]">
          <ImageComponent
            className="h-full w-full animate-fade-in object-cover opacity-0"
            width={235}
            height={372}
            src={img}
          />

          <span className="absolute left-2 top-2 z-10">
            <img
              src={`${
                Number(age) >= 18
                  ? 'c-18.png'
                  : Number(age) >= 16
                    ? 'c-16.png'
                    : 'p.png'
              }`}
              alt="Độ tuổi phim"
            />
          </span>

          <button
            type="button"
            className="group absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 hover:bg-black/30"
            onClick={handleOpenTrailer}
          >
            <PlayCircleFilledWhiteRounded
              sx={{
                fontSize: 62,
                color: '#ffffff',
                filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.25))',
                opacity: 0,
                transform: 'scale(0.88)',
                transition: 'opacity 0.25s ease, transform 0.25s ease',
                '.group:hover &': {
                  opacity: 1,
                  transform: 'scale(1)',
                },
              }}
            />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div className="truncate text-left">
          <Link
            to={`/detail-movie/${id}`}
            className="mb-2 mt-2 flex max-h-[30px] min-h-[30px] cursor-pointer flex-wrap text-[18px] font-bold text-primary hover:underline lg:truncate lg:text-[20px]"
          >
            {title}
          </Link>
          <ul>
            <li className="w-full">
              <span className="font-bold">Thể loại:</span>&nbsp;
              <span className="truncate whitespace-nowrap lowercase">
                {genres.map((genre) => genre.name).join(',\u200B ')}
              </span>
            </li>
            <li className="flex flex-wrap">
              <span className="font-bold">Thời lượng:</span>&nbsp; {duration}
              <span>&nbsp;Phút</span>
            </li>
            {isUpcoming && (
              <li className="flex flex-wrap">
                <span className="font-bold">Ngày khởi chiếu:</span>&nbsp;
                <span className="font-bold text-primary">{releaseDate}</span>
              </li>
            )}
          </ul>
        </div>

        {!isUpcoming && (
          <div onClick={() => openPopup(renderPopup())}>
            <CustomButton title="Mua vé" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CardItemFilm;
