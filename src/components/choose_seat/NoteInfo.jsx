import RegularSeat from '@component/seat/RegularSeat';
import { COLOR_SEAT } from '@utils/colorSeatConstant';

const NoteInfo = () => {
  return (
    <div className={'flex flex-wrap items-center justify-between gap-2 px-4'}>
      <div className={'flex items-center gap-2'}>
        <RegularSeat size={`40px`} color={COLOR_SEAT.SEAT_EMPTY} />
        <p className="text-[14px] font-medium">Ghế trống</p>
      </div>
      <div className={'flex items-center gap-2'}>
        <RegularSeat size={`40px`} color={COLOR_SEAT.SEAT_SELECTED} />
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
  );
};
export default NoteInfo;
