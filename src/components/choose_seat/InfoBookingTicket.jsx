import { FaEthernet, FaRegCalendarAlt, FaTag } from 'react-icons/fa';
import { GiTheater } from 'react-icons/gi';
import { CiClock2 } from 'react-icons/ci';
import { PiSeatFill } from 'react-icons/pi';
import CustomButton from '@component/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import ImageComponent from '@component/ImageComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateInvoice } from '@redux/slices/invoiceSlice';
import { useModelContext } from '@context/ModalContext';
import { IoClose } from 'react-icons/io5';
import { useRef } from 'react';
import { update } from '@apis/invoiceService';
import { createMultiple } from '@apis/detailBookingSnack';

const InfoBookingTicket = ({ showTime }) => {
  const { movieTheater } = useSelector((state) => state.movieTheater);
  const { selectedSeats } = useSelector((state) => state.ticket);
  const { invoices } = useSelector((state) => state.invoice);
  const { snackSelected } = useSelector((state) => state.snack);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openPopup, closeTopModal } = useModelContext();
  const inputRef = useRef(null);

  /* Xử lý chuyển sang trang thanh toán */
  const handleBeforePayment = () => {
    if (selectedSeats.length <= 0) {
      toast.info('Vui lòng chọn ghế trước khi thanh toán');
    } else {
      const invoice = invoices.find((i) => i.showTimeId === showTime.id);
      const totalMoneyTicket = selectedSeats.reduce(
        (total, item) => total + item.price,
        0
      );
      const infoUpdateInvoice = {
        ...invoice,
        invoice: {
          ...invoice.invoice,
          totalTicket: selectedSeats.length,
          totalMoneyTicket,
          totalMoney: totalMoneyTicket,
        },
      };
      dispatch(updateInvoice(infoUpdateInvoice));
      // Cập nhật hóa đơn //
      update({
        id: infoUpdateInvoice.invoice.id,
        email: infoUpdateInvoice.invoice.email,
        phoneNumber: infoUpdateInvoice.invoice.phoneNumber,
        paymentMethod: infoUpdateInvoice.invoice.paymentMethod,
        totalTicket: selectedSeats.length,
        customerId: infoUpdateInvoice.invoice.customerId,
        staffId: infoUpdateInvoice.invoice.staffId || null,
      })
        .then((res) => {
          console.log(res.data);
          return navigate(`/payment?st=${showTime.id}`);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleNavigatePayment = async () => {
    if (!inputRef.current.checked) {
      return toast.info('Vui lòng chấp nhận điều khoản đặt vé.');
    }
    const invoice = invoices.find((i) => i.showTimeId === showTime.id);
    if (invoice) {
      const newSnackSelected = snackSelected.map((item) => ({
        snackId: item.id,
        totalSnack: item.quantity,
        invoiceId: invoice.invoice.id,
      }));
      createMultiple(newSnackSelected)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => console.log(error));
    }
  };

  const renderTermOfPayment = () => {
    return (
      <div className={'w-[50vw] rounded-md bg-white p-5 leading-8'}>
        <span
          className={'absolute right-3 top-3 hover:cursor-pointer'}
          onClick={() => closeTopModal()}
        >
          <IoClose size={25} />
        </span>
        <h2 className={'mb-3 border-b-2 px-2 text-[20px] font-bold uppercase'}>
          Điều khoản thanh toán
        </h2>
        <div className="max-h-[70vh] overflow-y-auto text-gray-500 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-500">
          <h2 className="font-medium text-black">
            Chào mừng Quý khách hàng đến với Hệ thống Bán Vé Online của chuỗi
            Rạp Chiếu Phim CINEMAN CINEMAS!
          </h2>
          <p>
            Xin cảm ơn và chúc Quý khách hàng có những giây phút xem phim tuyệt
            vời tại CINEMAN CINEMAS!
          </p>
          <div className="mt-4">
            <h2 className="font-medium text-black">
              Sau đây là một số lưu ý trước khi thanh toán trực tuyến:
            </h2>
            <ol className="list-decimal pl-5">
              <li className="whitespace-normal">
                Thẻ phải được kích hoạt chức năng thanh toán trực tuyến, và có
                đủ hạn mức/ số dư để thanh toán. Quý khách cần nhập chính xác
                thông tin thẻ (tên chủ thẻ, số thẻ, ngày hết hạn, số CVC,
                OTP,...).
              </li>
              <li className="whitespace-normal">
                Vé và hàng hóa đã thanh toán thành công không thể hủy/đổi
                trả/hoàn tiền vì bất kỳ lý do gì. Beta Cinemas chỉ thực hiện
                hoàn tiền trong trường hợp thẻ của Quý khách đã bị trừ tiền
                nhưng hệ thống của Beta không ghi nhận việc đặt vé/đơn hàng của
                Quý khách, và Quý khách không nhận được xác nhận đặt vé/đơn hàng
                thành công.
              </li>
              <li className="whitespace-normal">
                Trong vòng 30 phút kể từ khi thanh toán thành công, Beta Cinemas
                sẽ gửi Quý khách mã xác nhận thông tin vé/ đơn hàng qua email
                của Quý khách. Nếu Quý khách cần hỗ trợ hay thắc mắc, khiếu nại
                về xác nhận mã vé/đơn hàng thì vui lòng phản hồi về Fanpage
                Facebook Beta Cinemas trong vòng 60 phút kể từ khi thanh toán vé
                thành công. Sau khoảng thời gian trên, Beta Cinemas sẽ không
                chấp nhận giải quyết bất kỳ khiếu nại nào.
              </li>
              <li className="whitespace-normal">
                Beta Cinemas không chịu trách nhiệm trong trường hợp thông tin
                địa chỉ email, số điện thoại Quý khách nhập không chính xac dẫn
                đen không nhan đưoc thu xac nhan. Vui lòng kiểm tra kỹ cac thông
                tin nay truoc khi thực hiện thanh toán. Beta Cinemas không hỗ
                trợ xử lý và không chịu trách nhiệm trong trường hợp đã gửi thư
                xác nhận mã vé/đơn hàng đến địa chỉ email của Quý khách nhưng vì
                một lý do nào đó mà Quý khách không thể đến xem phim.
              </li>
              <li className="whitespace-normal">
                Beta Cinemas không chịu trách nhiệm trong trường hợp thông tin
                địa chỉ email, số điện thoại Quý khách nhập không chính xac dẫn
                đen không nhan đưoc thu xac nhan. Vui lòng kiểm tra kỹ cac thông
                tin nay truoc khi thực hiện thanh toán. Beta Cinemas không hỗ
                trợ xử lý và không chịu trách nhiệm trong trường hợp đã gửi thư
                xác nhận mã vé/đơn hàng đến địa chỉ email của Quý khách nhưng vì
                một lý do nào đó mà Quý khách không thể đến xem phim.
              </li>
              <li className="whitespace-normal">
                Beta Cinemas không chịu trách nhiệm trong trường hợp thông tin
                địa chỉ email, số điện thoại Quý khách nhập không chính xac dẫn
                đen không nhan đưoc thu xac nhan. Vui lòng kiểm tra kỹ cac thông
                tin nay truoc khi thực hiện thanh toán. Beta Cinemas không hỗ
                trợ xử lý và không chịu trách nhiệm trong trường hợp đã gửi thư
                xác nhận mã vé/đơn hàng đến địa chỉ email của Quý khách nhưng vì
                một lý do nào đó mà Quý khách không thể đến xem phim.
              </li>
            </ol>
          </div>
        </div>
        <div className="mt-3 border-t-2 pt-3">
          <label htmlFor="term-payment">
            <input ref={inputRef} type="checkbox" id="term-payment" />
            <span className="font-bold">
              Tôi đồng ý với điều khoản sử dụng và mua vé cho người có độ tuổi
              phù hợp
            </span>
          </label>
          <div
            className="mx-auto max-w-[150px]"
            onClick={handleNavigatePayment}
          >
            <CustomButton title={'Thanh toán'} />
          </div>
        </div>
      </div>
    );
  };

  const handlePayment = () => {
    openPopup(renderTermOfPayment());
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
          <h3 className={'font-medium text-primary lg:text-[20px]'}>
            {showTime?.movie?.title}
          </h3>
          <span className={'font-medium uppercase'}>
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
                <p className="font-medium">
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
                <span className="font-medium">{showTime?.movie?.duration}</span>{' '}
                <span className="font-medium">Phút</span>
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
                <p className="font-medium">{movieTheater?.title}</p>
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
                <span className="font-medium">{showTime.showDate}</span>
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
                <span className="font-medium">{showTime?.startTime}</span>
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
                <span className="font-medium">
                  {showTime?.cinemaTheater?.name}
                </span>
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
                <span className="font-medium">
                  {selectedSeats.map((item) => item.seat.label).join(', ')}
                </span>
              </div>
            </div>
          </li>
          <li>
            <div className={'flex items-center justify-center gap-3'}>
              {pathname.includes('payment') && (
                <div
                  className="min-w-[100px]"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  <CustomButton title={'Quay lại'} />
                </div>
              )}
              {!pathname.includes('payment') ? (
                <div
                  onClick={() => {
                    handleBeforePayment();
                  }}
                  className="min-w-[100px]"
                >
                  <CustomButton title={'Tiếp tục'} />
                </div>
              ) : (
                <div
                  onClick={() => {
                    handlePayment();
                  }}
                  className="min-w-[100px]"
                >
                  <CustomButton title={'Tiếp tục'} />
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};
export default InfoBookingTicket;
