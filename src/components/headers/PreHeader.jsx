import { Link } from 'react-router-dom';

const PreHeader = () => {
  return (
    <div className="bg-black">
      <div className="container flex items-end justify-end text-center text-white">
        <ul className="flex gap-5 pr-2">
          <li>
            <Link
              to={'/login?auth=login'}
              className="text-[13px] text-white hover:underline"
            >
              Đăng nhập
            </Link>
          </li>
          <li>
            <Link
              to={'/login?auth=register'}
              className="text-[13px] text-white hover:underline"
            >
              Đăng kí
            </Link>
          </li>
        </ul>
        <div className="h-6 w-6">
          <a href="#">
            <img
              src="https://toppng.com/uploads/preview/vietnam-large-flag-11547887920ptaqfn7euo.png"
              alt=""
              className="w-full object-cover"
            />
          </a>
        </div>
      </div>
    </div>
  );
};
export default PreHeader;
