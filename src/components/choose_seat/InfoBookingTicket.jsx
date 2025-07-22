import { FaEthernet, FaRegCalendarAlt, FaTag } from 'react-icons/fa';
import { GiTheater } from 'react-icons/gi';
import { CiClock2 } from 'react-icons/ci';
import { PiSeatFill } from 'react-icons/pi';
import CustomButton from '@component/CustomButton';
import { useSelector } from 'react-redux';
import ImageComponent from '@component/ImageComponent';

const InfoBookingTicket = ({
  showTime,
  isPayment,
  setIsPayment,
  selectedSeats,
}) => {
  const { movieTheater } = useSelector((state) => state.movieTheater);
  /* Xử lý chuyển sang trang thanh toán */
  const handlePayment = () => {
    if (selectedSeats.length <= 0) {
      alert('bạn cần phải chọn ghế trước khi thanh toán ');
    } else {
      setIsPayment(true);
    }
  };
  return (
    <>
      <div className={'flex items-start gap-10'}>
        <div className={'w-[150px] flex-none'}>
          <ImageComponent
            src={showTime?.movie?.posterImage}
            width={150}
            height={225}
            className={'w-full object-cover'}
          />
        </div>
        <div className={'pt-10'}>
          <h3 className={'font-bold text-primary lg:text-[20px]'}>
            {showTime?.movie?.title}
          </h3>
          <span className={'font-bold uppercase'}>
            {showTime?.cinemaTheater?.name}
          </span>
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
                <p>
                  {showTime?.movie?.genres.map((item) => item.name).join(', ')}
                </p>
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
                <span>{showTime?.movie?.duration}</span> Phút
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div>
        <ul className={'border-dashed py-3'}>
          <li>
            <div className={'flex items-center gap-10 py-2 pl-8'}>
              <div className={'w-[150px] flex-none'}>
                <p className={'flex items-center gap-1'}>
                  <FaEthernet fill={'gray'} />
                  Rạp chiếu
                </p>
              </div>
              <div>
                <p>{movieTheater?.title}</p>
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
                <span>{showTime.showDate}</span>
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
                <span>{showTime?.startTime}</span>
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
                <span>{showTime?.cinemaTheater?.name}</span>
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
                className="min-w-[100px]"
              >
                <CustomButton title={'Tiếp tục'} />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};
export default InfoBookingTicket;
