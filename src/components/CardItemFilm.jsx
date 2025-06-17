import { FaCirclePlay } from 'react-icons/fa6';
import { IoTicket } from 'react-icons/io5';
import './CardItemFilm.css';
import ImageComponent from './ImageComponent';

const CardItemFilm = ({
  title,
  genres,
  duration,
  isUpcoming = false,
  releaseDate,
  age = 13,
  img,
  trailerLink,
}) => {
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
            {/* <img src={img} alt="" className="w-full object-cover" /> */}
          </div>
          <span className="absolute left-2 top-2">
            <img
              src={`${Number(age) >= 18 ? 'c-18.png' : Number(age) >= 16 ? 'c-16.png' : 'p.png'}`}
              alt="Độ tuổi trên 15"
            />
          </span>
          <div className="img-film-hover absolute left-0 top-0 h-full w-full transform rounded-2xl hover:bg-custom-transparent">
            <a href="#1" className="hidden">
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
          <div className="text-left">
            <p className="mb-2 mt-2 max-h-[30px] min-h-[30px] cursor-pointer truncate text-[16px] font-bold text-primary hover:underline">
              {title}
            </p>
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
          <div className="relative mt-4 text-center">
            <a
              href={trailerLink}
              className="group relative block overflow-hidden rounded-sm bg-gradient-custom-blue p-1 text-[16px] font-bold uppercase text-white transition-all duration-500"
            >
              <span className="absolute inset-0 z-0 bg-gradient-custom-blue-hover opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              <span className="relative z-10 flex items-center justify-center">
                <span className="absolute left-1 top-1/2 -translate-y-1/2 transform">
                  <IoTicket size={50} color="rgba(255, 255, 255, .5)" />
                </span>
                Mua vé
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
export default CardItemFilm;
