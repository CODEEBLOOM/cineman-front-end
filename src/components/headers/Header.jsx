import DropdownHeader from './DropdownHeader';
import PreHeader from './PreHeader';

const Header = () => {
  return (
    <div className="border-b-2 shadow-lg">
      <PreHeader />
      <div className="container flex items-center justify-between">
        <div className="min-h[75px] flex max-h-[75px] items-center">
          <a href="#" className="py-2">
            <img src="logo.png" alt="" className="h-full" />
          </a>
          <DropdownHeader />
        </div>
        <div>
          <ul className="flex gap-6">
            <li>
              <a
                href="#"
                className="text-[1.2vw] font-bold uppercase hover:text-[#337ab7]"
              >
                Lịch chiếu Theo rạp
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-[1.2vw] font-bold uppercase hover:text-[#337ab7]"
              >
                Phim
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-[1.2vw] font-bold uppercase hover:text-[#337ab7]"
              >
                Rạp
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-[1.2vw] font-bold uppercase hover:text-[#337ab7]"
              >
                Giá Vé
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-[1.2vw] font-bold uppercase hover:text-[#337ab7]"
              >
                Tin Tức
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Header;
