import DoubleSeat from '@component/seat/DoubleSeat';
import RegularSeat from '@component/seat/RegularSeat';
import VIPSeat from '@component/seat/VIPSeat';
import Timer from '@component/Timer';
import { COLOR_SEAT } from '@utils/colorSeatConstant';

const currencyFormatter = new Intl.NumberFormat('vi-VN');

const Footer = ({ isPayment = false, totalMoneyTicket }) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {!isPayment ? (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-2">
            <RegularSeat size="34px" color={COLOR_SEAT.SEAT_EMPTY} />
            <p className="text-sm font-semibold text-slate-700">Ghế thường</p>
          </div>

          <div className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-2">
            <DoubleSeat size="52px" color={COLOR_SEAT.SEAT_EMPTY} />
            <p className="text-sm font-semibold text-slate-700">Ghế đôi</p>
          </div>

          <div className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-2">
            <VIPSeat size="34px" color={COLOR_SEAT.SEAT_EMPTY} />
            <p className="text-sm font-semibold text-slate-700">Ghế VIP</p>
          </div>

          <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Tổng tiền
            </p>
            <p className="text-lg font-extrabold text-[#23486c]">
              {currencyFormatter.format(totalMoneyTicket || 0)} đ
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-1 text-sm text-slate-600">
          <p>Vui lòng kiểm tra kỹ thông tin trước khi chuyển sang bước tiếp theo.</p>
          <p>
            <span className="font-bold text-red-500">*</span> Vé đã mua sẽ
            không được hoàn trả dưới mọi hình thức.
          </p>
        </div>
      )}

      <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Thời gian còn lại
        </p>
        <Timer
          deadlineTime={10}
          className="text-[1.35rem] font-extrabold text-[#23486c]"
        />
      </div>
    </div>
  );
};

export default Footer;
