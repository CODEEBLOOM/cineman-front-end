import { FaEthernet, FaRegCalendarAlt, FaTag } from 'react-icons/fa';
import { GiTheater } from 'react-icons/gi';
import { CiClock2 } from 'react-icons/ci';
import { PiSeatFill } from 'react-icons/pi';
import CustomButton from '@component/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import ImageComponent from '@component/ImageComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearInvoice, updateInvoice } from '@redux/slices/invoiceSlice';
import { useModelContext } from '@context/ModalContext';
import { IoClose } from 'react-icons/io5';
import { useRef, useState } from 'react';
import { update, updateIxnRef } from '@apis/invoiceService';
import { createMultiple } from '@apis/detailBookingSnack';
import { getURLPayment } from '@apis/paymentService';
import { clearSnack } from '@redux/slices/snackSlice';
import { clearSelectedSeats } from '@redux/slices/ticketSlice';
import { createUserHistoryPoint } from '@apis/userPointHistoryService';

const InfoBookingTicket = ({ showTime }) => {
  const { movieTheater } = useSelector((state) => state.movieTheater);
  const { selectedSeats } = useSelector((state) => state.ticket);
  const { invoices, savePointRedeem } = useSelector((state) => state.invoice);
  const { snackSelected } = useSelector((state) => state.snack);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openPopup, closeTopModal } = useModelContext();
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  /* Xử lý chuyển sang trang thanh toán */
  const handleBeforePayment = () => {
    if (selectedSeats.length <= 0) {
      toast.info('Vui lòng chọn ghế trước khi thanh toán');
    } else {
      setIsLoading(true);
      const existingInvoice = invoices.find(
        (i) => i.showTimeId === showTime.id
      );
      if (!existingInvoice) {
        return toast.error('Lỗi khi cập nhật hóa đơn !');
      }
      // Cập nhật hóa đơn //
      const totalMoneyTicket = selectedSeats.reduce(
        (total, item) => total + item.price,
        0
      );
      update({
        id: existingInvoice.invoice.id,
        email: existingInvoice.invoice.email,
        phoneNumber: existingInvoice.invoice.phoneNumber,
        paymentMethod: existingInvoice.invoice.paymentMethod,
        totalAmount: totalMoneyTicket,
        totalMoneyTicket: totalMoneyTicket,
        totalTicket: selectedSeats.length,
        customerId: existingInvoice.invoice.customerId,
        staffId: existingInvoice.invoice.staffId || null,
        promotionId: null,
        invoiceStatus: 'PROCESSING',
      })
        .then((res) => {
          dispatch(
            updateInvoice({
              showTimeId: showTime.id,
              invoice: {
                ...res.data,
              },
            })
          );
          return navigate(`/payment?st=${showTime.id}`);
        })
        .catch((error) => console.log(error))
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleNavigatePayment = async () => {
    if (!inputRef.current.checked) {
      return toast.info('Vui lòng chấp nhận điều khoản đặt vé.');
    }
    const invoice = invoices.find((i) => i.showTimeId === showTime.id);
    if (invoice) {
      setIsLoading(true);
      const newSnackSelected = snackSelected.map((item) => ({
        snackId: item.id,
        totalSnack: item.quantity,
        invoiceId: invoice.invoice.id,
      }));

      try {
        if (newSnackSelected.length > 0) {
          await createMultiple(newSnackSelected);
        }

        // Nếu có điểm tích lũy nghĩa là người dùng muốn đổi điểm - cần phải tạo lịch sử đổi điểm cho người dùng //
        if (savePointRedeem > 0) {
          // Chỉ cần biết là có điểm tích lũy hay không vì dù thành toán tại rạp hay thanh toán online thì đều có thể tích điểm cho người dùng //
          try {
            await createUserHistoryPoint({
              userId: invoice.invoice.customerId,
              invoiceId: invoice.invoice.id,
              changePoint: savePointRedeem,
              reason: `Đổi điểm tích lũy thanh toán hóa đơn`,
            });
          } catch (error) {
            console.error('Error creating user history point:', error);
            toast.error('Có lỗi xảy ra khi đổi điểm tích lũy!');
          }
        }

        // Nếu thanh toán tại quầy //
        if (invoice.invoice.paymentMethod === 'CASH') {
          try {
            const res = await update({
              id: invoice.invoice.id,
              email: invoice.invoice.email,
              phoneNumber: invoice.invoice.phoneNumber,
              paymentMethod: invoice.invoice.paymentMethod,
              totalAmount: invoice.invoice.totalMoney,
              totalTicket: invoice.invoice.totalTicket,
              customerId: invoice.invoice.customerId,
              staffId: invoice.invoice.staffId,
              promotionId: invoice.invoice.promotionId,
              invoiceStatus: 'PAID',
            });
            if (res && res.data) {
              // Xóa sạch các thông tin liên quan //
              dispatch(clearInvoice());
              dispatch(clearSnack());
              dispatch(clearSelectedSeats());
              closeTopModal();
              toast.success('Thanh toán thành công !');
              return navigate('/', { replace: true });
            }
          } catch (err) {
            console.log('Error updating invoice:', err);
            if (err.response.status >= 400) {
              return toast.error(err.response.data.message);
            }
          }
        }
        const paymentRes = await getURLPayment({
          amount: invoice.invoice.totalMoney,
        });

        // Lấy URL thanh toán - khi thanh toán qua VNPay //
        const paymentUrl = paymentRes.data;
        const vnp_TxnRef =
          new URL(paymentUrl).searchParams.get('vnp_TxnRef') || '';

        try {
          await updateIxnRef({
            invoiceId: invoice.invoice.id,
            txnRef: vnp_TxnRef,
            promotionId: invoice.invoice.promotionId,
            totalMoney: invoice.invoice.totalMoney,
          });
        } catch (error) {
          if (error.response.status >= 400) {
            return toast.error(error.response.data.message);
          }
        } finally {
          setIsLoading(false);
        }
        window.location.href = paymentUrl;
      } catch (error) {
        console.error(error);
        toast.error('Có lỗi xảy ra khi thanh toán hoặc cập nhật thông tin!');
      } finally {
        setIsLoading(false);
      }
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
            className="mx-auto max-w-[200px]"
            onClick={handleNavigatePayment}
          >
            <CustomButton title={'Thanh toán'} isLoading={isLoading} />
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
                <p className="truncate whitespace-nowrap font-medium">
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
                <p className="truncate whitespace-nowrap font-medium">
                  {movieTheater?.title}
                </p>
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
                <span className="truncate whitespace-nowrap font-medium">
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
                <span className="truncate whitespace-nowrap font-medium">
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
                  <CustomButton title={'Tiếp tục'} isLoading={isLoading} />
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
