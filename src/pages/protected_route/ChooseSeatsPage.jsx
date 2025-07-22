import { IoIosArrowForward } from 'react-icons/io';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

import { findById } from '@apis/showTimeService';
import InfoBookingTicket from '@component/choose_seat/InfoBookingTicket';
import RegularSeat from '@component/seat/RegularSeat';
import { COLOR_SEAT } from '@utils/colorSeatConstant';
import DoubleSeat from '@component/seat/DoubleSeat';
import VIPSeat from '@component/seat/VIPSeat';
import TicketGrid from '@component/choose_seat/TicketGrid';
import Timer from '@component/Timer';
import { create } from '@apis/invoiceService';
import Payment from '@component/Payment';

const ChooseSeatPage = () => {
  const { pathname } = useLocation();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isPayment, setIsPayment] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);
  const [searchParams] = useSearchParams();
  const showTimeId = searchParams.get('st');
  const { user } = useSelector((state) => state.user);

  // Cuộn thành Scroll về đầu trang
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.title = 'Chọn Ghế - Cineman Cinemas';
  }, [pathname]);

  // Tạo hóa đơn cho người dùng - Trạng thái PEDDING //
  useEffect(() => {
    create({
      email: user.email,
      phoneNumber: user.phoneNumber,
      customerId: user.userId,
      staffId: null,
    })
      .then((res) => {
        setInvoiceId(res.data.id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  /* Lây thông tin của rạp chiếu */
  const [showTime, setShowTime] = useState({});
  useEffect(() => {
    findById(showTimeId)
      .then((res) => {
        setShowTime(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [showTimeId]);

  return (
    <>
      <div className={'container pb-6'}>
        <div
          className={
            'mt-5 grid grid-cols-1 gap-6 lg:grid-flow-row-dense lg:grid-cols-3'
          }
        >
          <div className={'lg:col-span-2'}>
            {/*Phần heder*/}
            <div>
              <ul className={'flex items-center gap-2'}>
                <li>
                  <Link
                    to={'/'}
                    className={
                      'font-bold text-primary hover:underline lg:text-[25px]'
                    }
                  >
                    Trang chủ
                  </Link>
                </li>
                <IoIosArrowForward />
                <li>
                  <a
                    href=""
                    className={
                      'font-bold text-primary hover:underline lg:text-[25px]'
                    }
                  >
                    Đặt vé
                  </a>
                </li>
                <IoIosArrowForward />
                <li>
                  <Link
                    to="#"
                    className={
                      'font-bold text-primary hover:underline lg:text-[25px]'
                    }
                  >
                    {' '}
                    {showTime?.movie?.title}
                  </Link>
                </li>
              </ul>
              <div className={'my-3 bg-orange-200 p-2'}>
                <p className={'text-center font-bold text-red-600'}>
                  Theo quy định của cục điện ảnh, phim này không dành cho khán
                  giả dưới {showTime?.movie?.age} tuổi.
                </p>
              </div>
            </div>
            <div>
              {/* Phần chỉnh */}
              <div className={`${isPayment ? 'hidden' : ''}`}>
                {/* Thông tin chú thích ghế */}
                <div
                  className={
                    'flex flex-wrap items-center justify-between gap-2 px-4'
                  }
                >
                  <div className={'flex items-center gap-2'}>
                    <RegularSeat size={`40px`} color={COLOR_SEAT.SEAT_EMPTY} />
                    <p className="text-[14px] font-medium">Ghế trống</p>
                  </div>
                  <div className={'flex items-center gap-2'}>
                    <RegularSeat
                      size={`40px`}
                      color={COLOR_SEAT.SEAT_SELECTED}
                    />
                    <p className="text-[14px] font-medium">Ghế đang chọn </p>
                  </div>
                  <div className={'flex items-center gap-2'}>
                    <RegularSeat size={`40px`} color={COLOR_SEAT.SEAT_HOLDED} />
                    <p className="text-[14px] font-medium">Ghế đang giữ</p>
                  </div>
                  <div className={'flex items-center gap-2'}>
                    <RegularSeat size={`40px`} color={COLOR_SEAT.SEAT_SOLD} />
                    <p className="text-[14px] font-medium">Ghế đã bán</p>
                  </div>
                  <div className={'flex items-center gap-2'}>
                    <RegularSeat size={`40px`} color={COLOR_SEAT.SEAT_BOOKED} />
                    <p className="text-[14px] font-medium">Ghế đặt trước</p>
                  </div>
                </div>
                {/*Phần render và chọn ghế */}
                <div
                  className={
                    'mt-5 justify-items-center overflow-x-scroll scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400'
                  }
                >
                  <div className="float-left space-y-2">
                    {/* Ảnh màn hình */}
                    <img
                      src="/ic-screen.png"
                      alt="img"
                      className="block h-auto w-full"
                    />
                    <TicketGrid
                      showTime={showTime}
                      invoiceId={invoiceId}
                      selectedSeats={selectedSeats}
                      setSelectedSeats={setSelectedSeats}
                    />
                  </div>
                </div>
              </div>

              {/*  Phần cuối */}
              <div
                className={
                  'mt-10 flex flex-col flex-wrap justify-between md:flex-row'
                }
              >
                <div className={'flex flex-wrap items-center gap-2'}>
                  <RegularSeat size={`40px`} color={COLOR_SEAT.SEAT_EMPTY} />
                  <span
                    className={'whitespace-normal font-medium md:text-[18px]'}
                  >
                    Ghế <br /> thường
                  </span>
                </div>
                <div className={'flex items-center gap-2'}>
                  <DoubleSeat size={`60px`} color={COLOR_SEAT.SEAT_EMPTY} />
                  <span
                    className={'whitespace-normal font-medium md:text-[18px]'}
                  >
                    Ghế <br /> đôi
                  </span>
                </div>
                <div className={'flex items-center gap-2 border-r-2 pr-2'}>
                  <VIPSeat size={`40px`} color={COLOR_SEAT.SEAT_EMPTY} />
                  <span
                    className={'whitespace-normal font-medium md:text-[18px]'}
                  >
                    Ghế <br /> <span className="uppercase">vip</span>
                  </span>
                </div>

                <div className={'flex items-center gap-2 border-r-2 pr-2'}>
                  <p className={'whitespace-normal font-medium md:text-[18px]'}>
                    Tổng tiền
                  </p>
                  <p className={'font-medium text-primary md:text-[18px]'}>
                    <span>500 000</span> VNĐ
                  </p>
                </div>
                <div className={'flex items-center gap-2'}>
                  <p className="whitespace-pre-line font-medium md:text-[18px]">
                    Thời gian còn lại
                  </p>
                  <Timer deadlineTime={10} />
                </div>
              </div>
            </div>

            <div className={`${isPayment ? '' : 'hidden'}`}>
              <Payment />
            </div>
          </div>

          <div className={'lg:col-span-1'}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="sticky top-[100px] self-start"
            >
              <InfoBookingTicket
                showTime={showTime}
                selectedSeats={selectedSeats}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChooseSeatPage;
