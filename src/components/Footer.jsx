import {
  extractMovieTheaterList,
  findAllClientMovieTheater,
} from '@apis/movieTheaterService';
import { useEffect, useMemo, useState } from 'react';
import { AiFillTikTok } from 'react-icons/ai';
import {
  FaFacebookF,
  FaInstagram,
  FaRegCheckCircle,
  FaYoutube,
} from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';

const companyLinks = [
  'Giới thiệu',
  'Tuyển dụng',
  'Liên hệ',
  'F.A.Q',
  'Hoạt động xã hội',
  'Điều khoản sử dụng',
  'Chính sách thanh toán, đổi trả - hoàn vé',
  'Liên hệ quảng cáo',
  'Điều khoản bảo mật',
  'Hướng dẫn đặt vé online',
];

const appLinks = ['Cineman cho iOS', 'Cineman cho Android'];

const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com', icon: FaFacebookF },
  { label: 'YouTube', href: 'https://youtube.com', icon: FaYoutube },
  { label: 'TikTok', href: 'https://tiktok.com', icon: AiFillTikTok },
  { label: 'Instagram', href: 'https://instagram.com', icon: FaInstagram },
];

const sectionTitleClass =
  'inline-block border-b-4 border-[#f48fb1] pb-2 text-[18px] font-extrabold uppercase tracking-[0.02em] text-[#ff8fb4] md:text-[20px]';

const ListLink = ({ children }) => (
  <li className="flex items-start gap-1.5 text-[15px] leading-7 text-white">
    <MdKeyboardArrowRight className="mt-1 shrink-0 text-[18px] text-white" />
    <a href="#!" className="block !text-white transition hover:opacity-85">
      {children}
    </a>
  </li>
);

const buildMovieTheaterLabel = (theater) => {
  const segments = [theater?.name].filter(Boolean);

  if (theater?.province?.name) {
    segments.push(theater.province.name);
  }

  const label = segments.join(', ');

  if (theater?.hotline) {
    return `${label} - Hotline ${theater.hotline}`;
  }

  return label;
};

const Footer = () => {
  const [movieTheaters, setMovieTheaters] = useState([]);
  const [isLoadingMovieTheaters, setIsLoadingMovieTheaters] = useState(true);
  const [movieTheaterError, setMovieTheaterError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadMovieTheaters = async () => {
      setIsLoadingMovieTheaters(true);
      setMovieTheaterError('');

      try {
        const response = await findAllClientMovieTheater();

        if (!isMounted) {
          return;
        }

        const theaters = extractMovieTheaterList(response).filter(
          (item) => item?.status !== false
        );

        setMovieTheaters(theaters);
      } catch {
        if (!isMounted) {
          return;
        }

        setMovieTheaterError('Chưa tải được danh sách cụm rạp.');
        setMovieTheaters([]);
      } finally {
        if (isMounted) {
          setIsLoadingMovieTheaters(false);
        }
      }
    };

    loadMovieTheaters();

    return () => {
      isMounted = false;
    };
  }, []);

  const movieTheaterLabels = useMemo(
    () => movieTheaters.map(buildMovieTheaterLabel).filter(Boolean),
    [movieTheaters]
  );

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[180px_minmax(0,1fr)_320px] xl:grid-cols-[190px_minmax(0,1fr)_360px]">
          <div className="md:max-w-[220px]">
            <div className="mb-8 max-w-[170px]">
              <img
                src="/logo-new.png"
                alt="Cineman"
                className="h-auto w-full object-contain brightness-0 invert"
              />
            </div>

            <ul className="space-y-0.5">
              {companyLinks.map((item) => (
                <ListLink key={item}>{item}</ListLink>
              ))}
            </ul>

            <div className="mt-8">
              <p className={sectionTitleClass}>Tải ứng dụng</p>
              <ul className="mt-3 space-y-0.5">
                {appLinks.map((item) => (
                  <ListLink key={item}>{item}</ListLink>
                ))}
              </ul>
            </div>
          </div>

          <div className="min-w-0">
            <p className={sectionTitleClass}>Cụm rạp Cineman</p>

            <div className="mt-4">
              {isLoadingMovieTheaters ? (
                <p className="text-[15px] leading-7 text-white/90">
                  Đang tải danh sách cụm rạp...
                </p>
              ) : null}

              {!isLoadingMovieTheaters && movieTheaterError ? (
                <p className="text-[15px] leading-7 text-white/90">
                  {movieTheaterError}
                </p>
              ) : null}

              {!isLoadingMovieTheaters && !movieTheaterError ? (
                <ul className="space-y-0.5">
                  {movieTheaterLabels.map((label) => (
                    <ListLink key={label}>{label}</ListLink>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-1 lg:max-w-[360px]">
            <p className={sectionTitleClass}>Liên hệ</p>

            <div className="mt-5 space-y-6 text-[15px] leading-7 text-white">
              <div>
                <p className="font-extrabold uppercase">
                  Công ty cổ phần Cineman
                </p>
                <p className="mt-2 text-white/95">
                  Giấy chứng nhận ĐKKD số: 0106633482 - Đăng ký lần đầu ngày
                  08/09/2014 tại Sở Kế hoạch và Đầu tư Thành phố Hà Nội
                </p>
                <p className="mt-2 text-white/95">
                  Địa chỉ trụ sở: Tầng 3, số 595, đường Giải Phóng, phường Tương
                  Mai, Thành phố Hà Nội, Việt Nam
                </p>
              </div>

              <div>
                <p className="font-extrabold uppercase">
                  Liên hệ chăm sóc khách hàng:
                </p>
                <p className="mt-2">Hotline: 1900 636807</p>
                <p>Email: mkt@betacinemas.vn</p>
              </div>

              <div>
                <p className="font-extrabold uppercase">Liên hệ quảng cáo:</p>
                <p className="mt-2">Hotline: 0934 632 682</p>
                <p>Email: ad@betagroup.vn</p>
              </div>

              <div>
                <p className="font-extrabold uppercase">
                  Liên hệ hợp tác kinh doanh:
                </p>
                <p className="mt-2">Hotline: 1800 646420</p>
                <p>Email: bachtx@betagroup.vn</p>
              </div>
            </div>

            <div className="mt-8">
              <p className={sectionTitleClass}>Kết nối với chúng tôi</p>

              <ul className="mt-5 flex items-center gap-2.5">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-primary transition hover:translate-y-[-1px] hover:bg-[#e8f2fb]"
                    >
                      <Icon size={22} />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-5 inline-flex items-center gap-3 rounded-full bg-[#1c8ed8] px-4 py-2.5 text-white">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#1c8ed8]">
                  <FaRegCheckCircle size={30} />
                </div>
                <div className="leading-tight">
                  <p className="text-[22px] font-extrabold uppercase">
                    Đã thông báo
                  </p>
                  <p className="text-[15px] uppercase">Bộ Công Thương</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
