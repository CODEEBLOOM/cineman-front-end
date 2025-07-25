import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';

const Header = ({ showTime }) => {
  return (
    <div>
      <ul className={'flex items-center gap-2'}>
        <li>
          <Link
            to={'/'}
            className={'font-bold text-primary hover:underline lg:text-[25px]'}
          >
            Trang chủ
          </Link>
        </li>
        <IoIosArrowForward />
        <li>
          <a
            href=""
            className={'font-bold text-primary hover:underline lg:text-[25px]'}
          >
            Đặt vé
          </a>
        </li>
        <IoIosArrowForward />
        <li>
          <Link
            to="#"
            className={'font-bold text-primary hover:underline lg:text-[25px]'}
          >
            {' '}
            {showTime?.movie?.title}
          </Link>
        </li>
      </ul>
      <div className={'my-3 bg-orange-200 p-2'}>
        <p className={'text-center font-bold text-red-600'}>
          Theo quy định của cục điện ảnh, phim này không dành cho khán giả dưới{' '}
          {showTime?.movie?.age} tuổi.
        </p>
      </div>
    </div>
  );
};
export default Header;
