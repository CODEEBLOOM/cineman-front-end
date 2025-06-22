import Header from '@component/headers/Header.jsx';
import Footer from '@component/Footer.jsx';
import { IoIosArrowForward } from 'react-icons/io';
import { FaEthernet, FaRegCalendarAlt, FaTag } from 'react-icons/fa';
import { CiClock2 } from 'react-icons/ci';
import { GiTheater } from 'react-icons/gi';
import { PiSeatFill } from 'react-icons/pi';
import CustomButton from '@component/CustomButton.jsx';
import { Link, useLocation } from 'react-router-dom';
import Seat from '@component/choose_seat/SeatComponent.jsx';
import ComboComponent from '@component/payment/ComboComponent.jsx';
import TicketSelectComponent from '@component/payment/TicketSelectComponent.jsx';
import InfoUserComponent from '@component/payment/InfoUserOrderComponent.jsx';
import DiscountComponent from '@component/payment/DiscountComponent.jsx';
import { useEffect, useState } from 'react';

const totalRows = 10;
const totalColumns = 15;

const seats = [];

for (let row = 1; row <= totalRows; row++) {
  for (let col = 1; col <= totalColumns; col++) {
    seats.push({
      seatCode: `${row}${col}`,
      row,
      column: col,
      type: row <= 5 ? 'normal' : 'vip',
      status: 'unselect',
    });
  }
}

const ChooseSeatPage = () => {
  const { pathname } = useLocation();
  const [chooseSeat, setChooseSeat] = useState([]);
  const [isPayment, setIsPayment] = useState(false);
  console.log(chooseSeat);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  // // Khởi tạo matrix trống
  const matrix = Array.from({ length: totalRows }, () =>
    Array(totalColumns).fill(null)
  );
  //
  // Gán ghế có thật vào matrix
  seats.forEach((seat) => {
    const rowIndex = seat.row - 1;
    const colIndex = seat.column - 1;
    matrix[rowIndex][colIndex] = seat;
  });

  // Chuyển sang trang thanh toán //
  const handlePayment = () => {
    if (chooseSeat.length <= 0) {
      alert('bạn cần phải chọn ghế trước khi thanh toán ');
    } else {
      setIsPayment(true);
    }
  };

  return (
    <>
      <Header />
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
                    28 Năm Sau: Hậu Tận Thế
                  </Link>
                </li>
              </ul>
              <div className={'my-3 bg-orange-200 p-2'}>
                <p className={'text-center font-bold text-red-700'}>
                  Theo quy định của cục điện ảnh, phim này không dành cho khán
                  giả dưới 18 tuổi.
                </p>
              </div>
            </div>
            <div>
              {/* Phần chỉnh */}
              <div className={`${isPayment ? 'hidden' : ''}`}>
                <div
                  className={
                    'flex flex-wrap items-center justify-between gap-2'
                  }
                >
                  <div className={'flex items-center gap-2'}>
                    <img
                      src="/seat-unselect-normal.png"
                      alt="seat"
                      width={35}
                      height={35}
                    />
                    <span>Ghế trống</span>
                  </div>
                  <div className={'flex items-center gap-2'}>
                    <img
                      src="/seat-select-normal.png"
                      alt="seat"
                      width={35}
                      height={35}
                    />
                    <span>Ghế đang chọn</span>
                  </div>
                  <div className={'flex items-center gap-2'}>
                    <img
                      src="/seat-process-normal.png"
                      alt="seat"
                      width={35}
                      height={35}
                    />
                    <span>Ghế được giữ</span>
                  </div>
                  <div className={'flex items-center gap-2'}>
                    <img
                      src="/seat-buy-normal.png"
                      alt="seat"
                      width={35}
                      height={35}
                    />
                    <span>Ghế đã bán</span>
                  </div>
                  <div className={'flex items-center gap-2'}>
                    <img
                      src="/seat-set-normal.png"
                      alt="seat"
                      width={35}
                      height={35}
                    />
                    <span>Ghế đặt trước</span>
                  </div>
                </div>
                {/*Phần render và chọn ghế */}
                <div className={'mt-5 justify-items-center overflow-x-scroll'}>
                  <div className="float-left space-y-2">
                    {/* Ảnh màn hình */}
                    <img
                      src="/ic-screen.png"
                      alt="img"
                      className="block h-auto w-full"
                    />
                    {matrix.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex gap-2">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded bg-cover bg-center text-sm text-white`}
                        />
                        {row.map((seat, colIndex) =>
                          seat ? (
                            <Seat
                              seat={seat}
                              key={colIndex}
                              setChooseSeat={setChooseSeat}
                            />
                          ) : (
                            <div key={colIndex} className="h-10 w-10" />
                          )
                        )}
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded bg-cover bg-center text-sm text-white`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/*  Phần cuối */}
              <div
                className={
                  'mt-10 flex flex-col flex-wrap justify-between md:flex-row'
                }
              >
                <div className={'flex items-center gap-2'}>
                  <img
                    src="/seat-unselect-normal.png"
                    width={40}
                    height={40}
                    alt=""
                  />
                  <span className={'md:text-[20px]'}>Ghế thường</span>
                </div>
                <div className={'flex items-center gap-2'}>
                  <img
                    src="/seat-unselect-double.png"
                    width={40}
                    height={40}
                    alt=""
                  />
                  <span className={'md:text-[20px]'}>Ghế đôi</span>
                </div>
                <div className={'flex items-center gap-2'}>
                  <img
                    src="/seat-unselect-vip.png"
                    width={40}
                    height={40}
                    alt=""
                  />
                  <span className={'md:text-[20px]'}>Ghế vip</span>
                </div>

                <div className={'flex items-center gap-2'}>
                  <p className={'md:text-[20px]'}>Tổng tiền</p>
                  <p className={'text-primary md:text-[20px]'}>
                    <span>500 000</span> VNĐ
                  </p>
                </div>
              </div>
            </div>

            <div className={`${isPayment ? '' : 'hidden'}`}>
              {/*Phần payment*/}
              <InfoUserComponent />
              <TicketSelectComponent
                ticketTpye={'Ghế VIP'}
                count={1}
                unitPrice={60000}
              />

              <TicketSelectComponent
                ticketTpye={'Ghế thường'}
                count={2}
                unitPrice={60000}
              />
              {/*  Combo ưu đãi*/}
              <ComboComponent />
              <DiscountComponent />
            </div>
          </div>

          <div className={'lg:col-span-1'}>
            <div className={'flex items-start gap-10'}>
              <div className={'w-[150px] flex-none'}>
                <img
                  src="/film-07.jpg"
                  alt="movie"
                  className={'w-full object-cover'}
                />
              </div>
              <div className={'pt-10'}>
                <h3 className={'font-bold text-primary lg:text-[20px]'}>
                  Ba Mặt Lật Kèo
                </h3>
                <span className={'font-bold uppercase'}>2D Phụ đề</span>
              </div>
            </div>
            <div>
              <ul className={'border-b-2 border-dashed py-3'}>
                <li>
                  <div className={'flex items-center gap-10 py-2 pl-8'}>
                    <div className={'w-[150px] flex-none'}>
                      <p className={'flex items-center gap-1'}>
                        <FaTag fill={'gray'} />
                        Thể loại
                      </p>
                    </div>
                    <div>
                      <p>Kinh dị</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={'flex items-center gap-10 py-2 pl-8'}>
                    <div className={'w-[150px] flex-none'}>
                      <p className={'flex items-center gap-1'}>
                        <CiClock2 fill={'gray'} />
                        Thời lượng
                      </p>
                    </div>
                    <div>
                      <span>150</span> Phút
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <ul className={'border-b-2 border-dashed py-3'}>
                <li>
                  <div className={'flex items-center gap-10 py-2 pl-8'}>
                    <div className={'w-[150px] flex-none'}>
                      <p className={'flex items-center gap-1'}>
                        <FaEthernet fill={'gray'} />
                        Rạp chiếu
                      </p>
                    </div>
                    <div>
                      <p>Cinaman Thái Nguyên</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={'flex items-center gap-10 py-2 pl-8'}>
                    <div className={'w-[150px] flex-none'}>
                      <p className={'flex items-center gap-1'}>
                        <FaRegCalendarAlt fill={'gray'} />
                        Ngày chiếu
                      </p>
                    </div>
                    <div>
                      <span>21/06/2025</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={'flex items-center gap-10 py-2 pl-8'}>
                    <div className={'w-[150px] flex-none'}>
                      <p className={'flex items-center gap-1'}>
                        <CiClock2 fill={'gray'} />
                        Giờ chiếu
                      </p>
                    </div>
                    <div>
                      <span>11:15</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={'flex items-center gap-10 py-2 pl-8'}>
                    <div className={'w-[150px] flex-none'}>
                      <p className={'flex items-center gap-1'}>
                        <GiTheater fill={'gray'} />
                        Phòng chiếu
                      </p>
                    </div>
                    <div>
                      <span>P2</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={'flex items-center gap-10 py-2 pl-8'}>
                    <div className={'w-[150px] flex-none'}>
                      <p className={'flex items-center gap-1'}>
                        <PiSeatFill fill={'gray'} />
                        Ghế ngồi
                      </p>
                    </div>
                    <div>
                      <span>C6</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={'flex items-center justify-center gap-3'}>
                    {isPayment && (
                      <div
                        onClick={() => {
                          setIsPayment(false);
                        }}
                      >
                        <CustomButton title={'Quay lại'} />
                      </div>
                    )}
                    <div
                      onClick={() => {
                        handlePayment();
                      }}
                    >
                      <CustomButton title={'Tiếp tục'} />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChooseSeatPage;
