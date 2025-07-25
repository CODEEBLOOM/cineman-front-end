import DoubleSeat from '@component/seat/DoubleSeat';
import RegularSeat from '@component/seat/RegularSeat';
import VIPSeat from '@component/seat/VIPSeat';
import Timer from '@component/Timer';
import { COLOR_SEAT } from '@utils/colorSeatConstant';

const Footer = ({ isPayment = false, totalMoneyTicket }) => {
  return (
    <>
      <div
        className={'mt-10 flex flex-col flex-wrap justify-between md:flex-row'}
      >
        {!isPayment && (
          <>
            <div className={'flex flex-wrap items-center gap-2'}>
              <RegularSeat size={`40px`} color={COLOR_SEAT.SEAT_EMPTY} />
              <span className={'whitespace-normal font-medium md:text-[18px]'}>
                Ghế <br /> thường
              </span>
            </div>
            <div className={'flex items-center gap-2'}>
              <DoubleSeat size={`60px`} color={COLOR_SEAT.SEAT_EMPTY} />
              <span className={'whitespace-normal font-medium md:text-[18px]'}>
                Ghế <br /> đôi
              </span>
            </div>
            <div className={'flex items-center gap-2 border-r-2 pr-2'}>
              <VIPSeat size={`40px`} color={COLOR_SEAT.SEAT_EMPTY} />
              <span className={'whitespace-normal font-medium md:text-[18px]'}>
                Ghế <br /> <span className="uppercase">vip</span>
              </span>
            </div>

            <div className={'flex items-center gap-2 border-r-2 pr-2'}>
              <p className={'whitespace-normal font-medium md:text-[18px]'}>
                Tổng tiền
              </p>
              <p className={'font-medium text-primary md:text-[18px]'}>
                <span>{totalMoneyTicket}</span> VNĐ
              </p>
            </div>
          </>
        )}
        {isPayment && (
          <div>
            <p className="italic">
              Vui lòng kiểm tra thông tin đầy đủ trước khi qua bước tiếp theo.
            </p>
            <p className="italic">
              <span className="text-red-500">*</span>Vé mua rồi không hoàn trả
              lại dưới mọi hình thức.
            </p>
          </div>
        )}
        <div className={'flex items-center gap-2'}>
          <p className="whitespace-pre-line font-medium md:text-[18px]">
            Thời gian còn lại
          </p>
          <Timer deadlineTime={10} />
        </div>
      </div>
    </>
  );
};
export default Footer;
