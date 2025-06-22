import { FaCirclePlay } from 'react-icons/fa6';
import { IoClose, IoTicket } from 'react-icons/io5';
import ImageComponent from './ImageComponent';
import { Link } from 'react-router-dom';
import { useModelContext } from '@context/ModalContext.jsx';
import CustomButton from '@component/CustomButton.jsx';

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
  const { openPopup, setIsShowing } = useModelContext();

  return (
    <>
      <div className="mb-14 flex w-full gap-5 px-4 pb-4 sm:block">
        <div className="relative flex-1">
          <div className="w-full max-w-[250px] overflow-hidden rounded-2xl">
            <ImageComponent
              className="w-full animate-fade-in rounded-lg object-cover opacity-0"
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
                      onClick={() => setIsShowing(false)}
                    >
                      <IoClose size={25} />
                    </span>
                    <p className={'mb-3 border-b-2 px-2 text-[20px]'}>
                      Đất Rừng Phương Nam
                    </p>
                    <iframe
                      title={'Trailer'}
                      src={
                        'https://www.youtube.com/embed/hktzirCnJmQ?si=hoZIqYe5AegaBzIO'
                      }
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
              className="mb-2 mt-2 max-h-[30px] min-h-[30px] cursor-pointer truncate text-[18px] font-bold text-primary hover:underline lg:text-[20px]"
            >
              {title}
            </Link>
            <ul>
              <li className="truncate">
                <span className="font-bold">Thể loại:</span>&nbsp;{' '}
                <span className="lowercase">
                  {genres.map((genre) => genre.name).join(', ')}
                </span>
              </li>

              <li>
                <span className="font-bold">Thời lượng:</span>&nbsp; {duration}{' '}
                <span>Phút</span>
              </li>
              {isUpcoming && (
                <li>
                  <span className="font-bold">Ngày khởi chiếu:</span>&nbsp;
                  <span className="font-bold text-primary">{releaseDate}</span>
                </li>
              )}
            </ul>
          </div>
          <CustomButton title={'Mua vé'} />
        </div>
      </div>
    </>
  );
};
export default CardItemFilm;
