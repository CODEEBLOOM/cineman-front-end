import {
  extractMovieTheaterList,
  findAllClientMovieTheater,
} from '@apis/movieTheaterService';
import { useEffect, useMemo, useState } from 'react';
import { AiFillTikTok } from 'react-icons/ai';
import { FaApple, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { IoLogoGooglePlaystore } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const aboutLinks = [
  'Giới thiệu',
  'Tuyển dụng',
  'Liên hệ',
  'Tin tức',
  'Điều khoản sử dụng',
  'Chính sách bảo mật',
];

const supportLinks = [
  'FAQ',
  'Hướng dẫn đặt vé',
  'Hướng dẫn thanh toán',
  'Chính sách đổi/trả vé',
  'Liên hệ hỗ trợ',
];

const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com', icon: FaFacebookF },
  { label: 'YouTube', href: 'https://youtube.com', icon: FaYoutube },
  { label: 'Instagram', href: 'https://instagram.com', icon: FaInstagram },
  { label: 'TikTok', href: 'https://tiktok.com', icon: AiFillTikTok },
];

const paymentMethods = [
  { label: 'VNPAY', image: '/vnpay-logo.png' },
  { label: 'momo', text: 'momo', accent: '#a50064' },
  { label: 'visa', text: 'VISA', accent: '#1a1f71' },
  { label: 'mastercard', text: 'mastercard', accent: '#eb001b' },
  { label: 'ZaloPay', text: 'ZaloPay', accent: '#008fe5' },
];

const SectionTitle = ({ children }) => (
  <p className="mb-4 text-[15px] font-extrabold uppercase tracking-[0.04em] text-white">
    {children}
  </p>
);

const FooterLink = ({ children, to = '#!' }) => (
  <li>
    <a
      href={to}
      className="block text-[14px] leading-[28px] !text-white/85 transition hover:!text-white"
    >
      {children}
    </a>
  </li>
);

const buildTheaterLabel = (theater) => {
  if (!theater?.name) return '';
  if (theater?.province?.name) {
    return `${theater.name}, ${theater.province.name}`;
  }
  return theater.name;
};

const Footer = () => {
  const [movieTheaters, setMovieTheaters] = useState([]);

  useEffect(() => {
    let isMounted = true;

    findAllClientMovieTheater()
      .then((response) => {
        if (!isMounted) return;
        const theaters = extractMovieTheaterList(response).filter(
          (item) => item?.status !== false
        );
        setMovieTheaters(theaters);
      })
      .catch(() => {
        if (!isMounted) return;
        setMovieTheaters([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const theaterItems = useMemo(
    () => movieTheaters.slice(0, 6).map(buildTheaterLabel).filter(Boolean),
    [movieTheaters]
  );

  return (
    <footer className="bg-primary text-white">
      <div className="container py-10 lg:py-12">
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div className="lg:max-w-[260px]">
            <Link to="/" className="block w-[150px]">
              <img
                src="/logo-new.png"
                alt="Cineman"
                className="h-auto w-full object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-[14px] leading-6 text-white/85">
              Trải nghiệm điện ảnh
              <br />
              đẳng cấp cùng Cineman.
            </p>
            <ul className="mt-6 flex items-center gap-2.5">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-primary"
                  >
                    <Icon size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionTitle>Cụm rạp Cineman</SectionTitle>
            <ul className="space-y-0.5">
              {theaterItems.length > 0
                ? theaterItems.map((label) => (
                    <FooterLink key={label}>{label}</FooterLink>
                  ))
                : [
                    'Poly Cinemas Đà Nẵng',
                    'Poly Cinemas Vũng Tàu',
                    'Poly Cinemas Hà Nội',
                    'Poly Cinemas Hải Phòng',
                    'Poly Cinemas Quảng Ninh',
                    'Poly Cinemas Cần Thơ',
                  ].map((label) => <FooterLink key={label}>{label}</FooterLink>)}
            </ul>
            <Link
              to="/showtimes"
              className="mt-2 inline-flex items-center gap-1 text-[14px] font-semibold !text-white transition hover:opacity-80"
            >
              Xem tất cả rạp <span aria-hidden>→</span>
            </Link>
          </div>

          <div>
            <SectionTitle>Về chúng tôi</SectionTitle>
            <ul className="space-y-0.5">
              {aboutLinks.map((label) => (
                <FooterLink key={label}>{label}</FooterLink>
              ))}
            </ul>
          </div>

          <div>
            <SectionTitle>Hỗ trợ</SectionTitle>
            <ul className="space-y-0.5">
              {supportLinks.map((label) => (
                <FooterLink key={label}>{label}</FooterLink>
              ))}
            </ul>
          </div>

          <div>
            <SectionTitle>Tải ứng dụng</SectionTitle>
            <div className="flex flex-col gap-3">
              <a
                href="#!"
                className="inline-flex items-center gap-3 rounded-xl bg-black px-4 py-2.5 transition hover:opacity-90"
              >
                <FaApple size={28} className="text-white" />
                <div className="leading-tight">
                  <p className="text-[10px] uppercase text-white/80">
                    Tải về trên
                  </p>
                  <p className="text-[16px] font-semibold text-white">
                    App Store
                  </p>
                </div>
              </a>
              <a
                href="#!"
                className="inline-flex items-center gap-3 rounded-xl bg-black px-4 py-2.5 transition hover:opacity-90"
              >
                <IoLogoGooglePlaystore size={28} className="text-white" />
                <div className="leading-tight">
                  <p className="text-[10px] uppercase text-white/80">
                    Tải nội dung trên
                  </p>
                  <p className="text-[16px] font-semibold text-white">
                    Google Play
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-5 md:flex-row">
          <p className="text-[13px] text-white/80">
            © 2026 Cineman. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-2">
            {paymentMethods.map(({ label, image, text, accent }) => (
              <li
                key={label}
                className="flex h-8 min-w-[56px] items-center justify-center rounded-md bg-white px-2 shadow-sm"
                aria-label={label}
              >
                {image ? (
                  <img
                    src={image}
                    alt={label}
                    className="h-5 w-auto object-contain"
                  />
                ) : (
                  <span
                    className="text-[13px] font-extrabold"
                    style={{ color: accent }}
                  >
                    {text}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
