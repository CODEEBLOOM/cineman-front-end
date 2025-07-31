import { MdKeyboardArrowRight } from 'react-icons/md';
import { TfiYoutube } from 'react-icons/tfi';
import { RiFacebookBoxLine } from 'react-icons/ri';
import { AiFillTikTok } from 'react-icons/ai';
import { FaInstagramSquare } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="border-t-2 pb-10">
      <footer className="container pt-10">
        <div className="md:flex-wrap lg:flex lg:flex-nowrap">
          <div className="basic-[200px]">
            <div className="max-w-[120px] overflow-hidden">
              <img
                src="/logo-new-v01.png"
                alt="cineman"
                className="mb-4 w-full object-cover"
              />
            </div>
            <ul className="flex flex-col space-y-1 text-left">
              <li className="flex items-start justify-start gap-1">
                <MdKeyboardArrowRight />
                <a href="#1" className="font-bold">
                  Giới thiệu
                </a>
              </li>
              <li className="flex items-start justify-start gap-1">
                <MdKeyboardArrowRight />
                <a href="#1" className="font-bold">
                  Tuyển dụng
                </a>
              </li>
              <li className="flex items-start justify-start gap-1">
                <MdKeyboardArrowRight />
                <a href="#1" className="font-bold">
                  Liên hệ
                </a>
              </li>

              <li className="flex items-start justify-start gap-1">
                <MdKeyboardArrowRight />
                <a href="#1" className="font-bold">
                  Điều khoản sử dụng
                </a>
              </li>

              <li className="flex items-start justify-start gap-1">
                <MdKeyboardArrowRight />
                <a href="#1" className="font-bold">
                  Chính sách thanh toán và hoàn đổi trả - hoàn vé
                </a>
              </li>

              <li className="flex items-start justify-start gap-1">
                <MdKeyboardArrowRight />
                <a href="#1" className="font-bold">
                  Điều khoản bảo mật
                </a>
              </li>
              <li className="flex items-start justify-start gap-1">
                <MdKeyboardArrowRight />
                <a href="#1" className="font-bold">
                  Hướng dẫn đặt vé
                </a>
              </li>
            </ul>
          </div>
          <div className="grow-1 gap-6 px-4 pb-2 md:flex-wrap lg:flex lg:flex-nowrap">
            <div className="flex-shrink-1 w-[80%] text-justify">
              <p className="custom-border mb-4 inline-block border-b-4 pb-2 text-[20px] font-bold uppercase">
                Cụm rạp cineman
              </p>
              <ul className="flex flex-col space-y-1">
                <li className="flex items-center justify-start gap-1">
                  <MdKeyboardArrowRight />
                  <a href="#1" className="font-bold">
                    Beta Cinemas Xuân Thủy, Hà Nội - Hotline 0333 023 183
                  </a>
                </li>
                <li className="flex items-center justify-start gap-1">
                  <MdKeyboardArrowRight />
                  <a href="#1" className="font-bold">
                    Beta Cinemas Tây Sơn, Hà Nội - Hotline 0976 894 773
                  </a>
                </li>
                <li className="flex items-center justify-start gap-1">
                  <MdKeyboardArrowRight />
                  <a href="#1" className="font-bold">
                    Beta Cinemas Vĩnh Yên, Vĩnh Phúc - Hotline 0977 632 215
                  </a>
                </li>

                <li className="flex items-center justify-start gap-1">
                  <MdKeyboardArrowRight />
                  <a href="#1" className="font-bold">
                    Beta Cinemas Ung Văn Khiêm, TP Hồ Chí Minh - Hotline 0969
                    874 873
                  </a>
                </li>

                <li className="flex items-center justify-start gap-1">
                  <MdKeyboardArrowRight />
                  <a href="#1" className="font-bold">
                    Beta Cinemas Lào Cai - Hotline 0358 968 970
                  </a>
                </li>

                <li className="flex items-center justify-start gap-1">
                  <MdKeyboardArrowRight />
                  <a href="#1" className="font-bold">
                    Beta Cinemas Tân Uyên, Bình Dương - Hotline 0937 905 925
                  </a>
                </li>
                <li className="flex items-center justify-start gap-1">
                  <MdKeyboardArrowRight />
                  <a href="#1" className="font-bold">
                    Beta Cinemas Nha Trang, Khánh Hòa - Hotline 0399 475 165
                  </a>
                </li>
                <li className="flex items-center justify-start gap-1">
                  <MdKeyboardArrowRight />
                  <a href="#1" className="font-bold">
                    Beta Cinemas Biên Hòa, Đồng Nai - Hotline 0979 460 002
                  </a>
                </li>
                <li className="flex items-center justify-start gap-1">
                  <MdKeyboardArrowRight />
                  <a href="#1" className="font-bold">
                    Beta Cinemas Thanh Hóa - Hotline 0325 360 249
                  </a>
                </li>
              </ul>
            </div>
            <div className="">
              <p className="custom-border mb-4 inline-block border-b-4 pb-2 text-[20px] font-bold uppercase">
                Kết nối với chúng tôi
              </p>
              <ul className="flex">
                <li>
                  <a href="#1">
                    <RiFacebookBoxLine size={40} />
                  </a>
                </li>
                <li>
                  <a href="#1">
                    <TfiYoutube size={40} />
                  </a>
                </li>
                <li>
                  <a href="#1">
                    <AiFillTikTok size={40} />
                  </a>
                </li>
                <li>
                  <a href="#1">
                    <FaInstagramSquare size={40} />
                  </a>
                </li>
              </ul>
            </div>
            <div className="">
              <p className="custom-border mb-4 inline-block border-b-4 pb-2 text-[20px] font-bold uppercase">
                Liên hệ
              </p>
              <p className="text-[16px] uppercase">CÔNG TY CỔ PHẦN CINEMAN</p>
              <p className="mb-3">
                Địa chỉ trụ sở: Tân Chánh Hiệp - Quận 12 - Thành Phố Hồ Chí Minh
              </p>
              <p className="mb-3">
                <span>Hotline: </span>
                1900 636807 / 1900 636808
              </p>
              <p className="mb-3">
                <span>Email: </span>
                ad@cineman.vn
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Footer;
