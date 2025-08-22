import { FaCirclePlay } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import ImageComponent from './ImageComponent';
import { Link } from 'react-router-dom';
import { useModelContext } from '@context/ModalContext.jsx';
import CustomButton from '@component/CustomButton.jsx';
import ShowTimeComponent from './movie_detail/ShowTimeComponent';
import { useSelector } from 'react-redux';
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
  const { movieTheater } = useSelector((state) => state.movieTheater);

  const renderPopup = () => {
    return (
      <div
        className={
          'relative flex aspect-video w-full flex-col justify-start rounded-md bg-white p-5 sm:w-[80vw] md:w-[60vw]'
        }
      >
        <span
          className={'absolute right-3 top-3 hover:cursor-pointer'}
          onClick={() => closeTopModal(false)}
        >
          <IoClose size={25} />
        </span>
        <div className={'border-b-2 px-4'}>
          <p className={'font-bold uppercase lg:text-[25px]'}>
            Lịch chiếu phim - <span className="capitalize">{title}</span>
          </p>
        </div>
        <div className="pb-3 pt-10 text-center">
          <p className="text-[30px] font-medium uppercase text-primary">
            {movieTheater.title}
          </p>
        </div>
        <ShowTimeComponent movieId={id} />
      </div>
    );
  };

  return (
    <>
      <div className="mb-3 flex w-full gap-5 px-4 pb-4 sm:block">
        <div className="relative">
          <div className="h-auto w-full min-w-[100px] max-w-[150px] overflow-hidden rounded-2xl sm:max-w-[300px] md:min-h-[300px] xl:min-h-[370px]">
            <ImageComponent
              className="h-full w-full min-w-[150px] animate-fade-in rounded-lg object-cover opacity-0"
              width={235}
              height={372}
              src={img}
            />
          </div>
          <span className="absolute left-2 top-2">
            <img
              src={`${Number(age) >= 18 ? 'c-18.png' : Number(age) >= 16 ? 'c-16.png' : 'p.png'}`}
              alt="Độ tuổi trên 15"
            />
          </span>
          <div className="group absolute left-0 top-0 h-full w-full transform rounded-2xl hover:bg-custom-transparent">
            <a
              className="hidden cursor-pointer group-hover:block"
              onClick={() =>
                openPopup(
                  <div className={'relative bg-white p-5'}>
                    <span
                      className={'absolute right-3 top-3 hover:cursor-pointer'}
                      onClick={() => closeTopModal()}
                    >
                      <IoClose size={25} />
                    </span>
                    <p className={'mb-3 border-b-2 px-2 text-[20px]'}>
                      {title}
                    </p>
                    <iframe
                      title={'Trailer'}
                      src={trailerLink}
                      className={'aspect-video w-[80vw] md:w-[50vw]'}
                    />
                  </div>
                )
              }
            >
              <FaCirclePlay
                size={50}
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: '100rem',
                }}
                fill="white"
                className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]"
              />
            </a>
          </div>
        </div>
        <div className="flex-1">
          <div className="truncate text-left">
            <Link
              to={`/detail-movie/${id}`}
              className="mb-2 mt-2 max-h-[30px] min-h-[30px] cursor-pointer flex-wrap text-[18px] font-bold text-primary hover:underline lg:truncate lg:text-[20px]"
            >
              {title}
            </Link>
            <ul>
              <li className="w-full">
                <span className="font-bold">Thể loại:</span>&nbsp;{' '}
                <span className="truncate whitespace-normal lowercase">
                  {genres.map((genre) => genre.name).join(',\u200B ')}
                </span>
              </li>

              <li className="flex flex-wrap">
                <span className="font-bold">Thời lượng:</span>&nbsp; {duration}
                <span> &nbsp;Phút</span>
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
              <CustomButton title={'Mua vé'} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default CardItemFilm;
