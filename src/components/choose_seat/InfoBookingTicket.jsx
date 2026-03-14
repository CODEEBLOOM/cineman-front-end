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
  const movieTheater = useSelector(
    (state) => state.movieTheater?.movieTheater ?? { title: '' }
  );
  const { selectedSeats } = useSelector((state) => state.ticket);
  const { invoices, savePointRedeem } = useSelector((state) => state.invoice);
  const { snackSelected } = useSelector((state) => state.snack);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openPopup, closeTopModal } = useModelContext();
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  /* Xá»­ lÃ½ chuyá»ƒn sang trang thanh toÃ¡n */
  const handleBeforePayment = () => {
    if (selectedSeats.length <= 0) {
      toast.info('Vui lÃ²ng chá»n gháº¿ trÆ°á»›c khi thanh toÃ¡n');
    } else {
      setIsLoading(true);
      const existingInvoice = invoices.find(
        (i) => i.showTimeId === showTime.id
      );
      if (!existingInvoice) {
        return toast.error('Lá»—i khi cáº­p nháº­t hÃ³a Ä‘Æ¡n !');
      }
      // Cáº­p nháº­t hÃ³a Ä‘Æ¡n //
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
      return toast.info('Vui lÃ²ng cháº¥p nháº­n Ä‘iá»u khoáº£n Ä‘áº·t vÃ©.');
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

        // Náº¿u cÃ³ Ä‘iá»ƒm tÃ­ch lÅ©y nghÄ©a lÃ  ngÆ°á»i dÃ¹ng muá»‘n Ä‘á»•i Ä‘iá»ƒm - cáº§n pháº£i táº¡o lá»‹ch sá»­ Ä‘á»•i Ä‘iá»ƒm cho ngÆ°á»i dÃ¹ng //
        if (savePointRedeem > 0) {
          // Chá»‰ cáº§n biáº¿t lÃ  cÃ³ Ä‘iá»ƒm tÃ­ch lÅ©y hay khÃ´ng vÃ¬ dÃ¹ thÃ nh toÃ¡n táº¡i ráº¡p hay thanh toÃ¡n online thÃ¬ Ä‘á»u cÃ³ thá»ƒ tÃ­ch Ä‘iá»ƒm cho ngÆ°á»i dÃ¹ng //
          try {
            await createUserHistoryPoint({
              userId: invoice.invoice.customerId,
              invoiceId: invoice.invoice.id,
              changePoint: savePointRedeem,
              reason: `Äá»•i Ä‘iá»ƒm tÃ­ch lÅ©y thanh toÃ¡n hÃ³a Ä‘Æ¡n`,
            });
          } catch (error) {
            console.error('Error creating user history point:', error);
            toast.error('CÃ³ lá»—i xáº£y ra khi Ä‘á»•i Ä‘iá»ƒm tÃ­ch lÅ©y!');
          }
        }

        // Náº¿u thanh toÃ¡n táº¡i quáº§y //
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
              // XÃ³a sáº¡ch cÃ¡c thÃ´ng tin liÃªn quan //
              dispatch(clearInvoice());
              dispatch(clearSnack());
              dispatch(clearSelectedSeats());
              closeTopModal();
              toast.success('Thanh toÃ¡n thÃ nh cÃ´ng !');
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

        // Láº¥y URL thanh toÃ¡n - khi thanh toÃ¡n qua VNPay //
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
        toast.error('CÃ³ lá»—i xáº£y ra khi thanh toÃ¡n hoáº·c cáº­p nháº­t thÃ´ng tin!');
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
          Äiá»u khoáº£n thanh toÃ¡n
        </h2>
        <div className="max-h-[70vh] overflow-y-auto text-gray-500 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-500">
          <h2 className="font-medium text-black">
            ChÃ o má»«ng QuÃ½ khÃ¡ch hÃ ng Ä‘áº¿n vá»›i Há»‡ thá»‘ng BÃ¡n VÃ© Online cá»§a chuá»—i
            Ráº¡p Chiáº¿u Phim CINEMAN CINEMAS!
          </h2>
          <p>
            Xin cáº£m Æ¡n vÃ  chÃºc QuÃ½ khÃ¡ch hÃ ng cÃ³ nhá»¯ng giÃ¢y phÃºt xem phim tuyá»‡t
            vá»i táº¡i CINEMAN CINEMAS!
          </p>
          <div className="mt-4">
            <h2 className="font-medium text-black">
              Sau Ä‘Ã¢y lÃ  má»™t sá»‘ lÆ°u Ã½ trÆ°á»›c khi thanh toÃ¡n trá»±c tuyáº¿n:
            </h2>
            <ol className="list-decimal pl-5">
              <li className="whitespace-normal">
                Tháº» pháº£i Ä‘Æ°á»£c kÃ­ch hoáº¡t chá»©c nÄƒng thanh toÃ¡n trá»±c tuyáº¿n, vÃ  cÃ³
                Ä‘á»§ háº¡n má»©c/ sá»‘ dÆ° Ä‘á»ƒ thanh toÃ¡n. QuÃ½ khÃ¡ch cáº§n nháº­p chÃ­nh xÃ¡c
                thÃ´ng tin tháº» (tÃªn chá»§ tháº», sá»‘ tháº», ngÃ y háº¿t háº¡n, sá»‘ CVC,
                OTP,...).
              </li>
              <li className="whitespace-normal">
                VÃ© vÃ  hÃ ng hÃ³a Ä‘Ã£ thanh toÃ¡n thÃ nh cÃ´ng khÃ´ng thá»ƒ há»§y/Ä‘á»•i
                tráº£/hoÃ n tiá»n vÃ¬ báº¥t ká»³ lÃ½ do gÃ¬. Beta Cinemas chá»‰ thá»±c hiá»‡n
                hoÃ n tiá»n trong trÆ°á»ng há»£p tháº» cá»§a QuÃ½ khÃ¡ch Ä‘Ã£ bá»‹ trá»« tiá»n
                nhÆ°ng há»‡ thá»‘ng cá»§a Beta khÃ´ng ghi nháº­n viá»‡c Ä‘áº·t vÃ©/Ä‘Æ¡n hÃ ng cá»§a
                QuÃ½ khÃ¡ch, vÃ  QuÃ½ khÃ¡ch khÃ´ng nháº­n Ä‘Æ°á»£c xÃ¡c nháº­n Ä‘áº·t vÃ©/Ä‘Æ¡n hÃ ng
                thÃ nh cÃ´ng.
              </li>
              <li className="whitespace-normal">
                Trong vÃ²ng 30 phÃºt ká»ƒ tá»« khi thanh toÃ¡n thÃ nh cÃ´ng, Beta Cinemas
                sáº½ gá»­i QuÃ½ khÃ¡ch mÃ£ xÃ¡c nháº­n thÃ´ng tin vÃ©/ Ä‘Æ¡n hÃ ng qua email
                cá»§a QuÃ½ khÃ¡ch. Náº¿u QuÃ½ khÃ¡ch cáº§n há»— trá»£ hay tháº¯c máº¯c, khiáº¿u náº¡i
                vá» xÃ¡c nháº­n mÃ£ vÃ©/Ä‘Æ¡n hÃ ng thÃ¬ vui lÃ²ng pháº£n há»“i vá» Fanpage
                Facebook Beta Cinemas trong vÃ²ng 60 phÃºt ká»ƒ tá»« khi thanh toÃ¡n vÃ©
                thÃ nh cÃ´ng. Sau khoáº£ng thá»i gian trÃªn, Beta Cinemas sáº½ khÃ´ng
                cháº¥p nháº­n giáº£i quyáº¿t báº¥t ká»³ khiáº¿u náº¡i nÃ o.
              </li>
              <li className="whitespace-normal">
                Beta Cinemas khÃ´ng chá»‹u trÃ¡ch nhiá»‡m trong trÆ°á»ng há»£p thÃ´ng tin
                Ä‘á»‹a chá»‰ email, sá»‘ Ä‘iá»‡n thoáº¡i QuÃ½ khÃ¡ch nháº­p khÃ´ng chÃ­nh xac dáº«n
                Ä‘en khÃ´ng nhan Ä‘Æ°oc thu xac nhan. Vui lÃ²ng kiá»ƒm tra ká»¹ cac thÃ´ng
                tin nay truoc khi thá»±c hiá»‡n thanh toÃ¡n. Beta Cinemas khÃ´ng há»—
                trá»£ xá»­ lÃ½ vÃ  khÃ´ng chá»‹u trÃ¡ch nhiá»‡m trong trÆ°á»ng há»£p Ä‘Ã£ gá»­i thÆ°
                xÃ¡c nháº­n mÃ£ vÃ©/Ä‘Æ¡n hÃ ng Ä‘áº¿n Ä‘á»‹a chá»‰ email cá»§a QuÃ½ khÃ¡ch nhÆ°ng vÃ¬
                má»™t lÃ½ do nÃ o Ä‘Ã³ mÃ  QuÃ½ khÃ¡ch khÃ´ng thá»ƒ Ä‘áº¿n xem phim.
              </li>
              <li className="whitespace-normal">
                Beta Cinemas khÃ´ng chá»‹u trÃ¡ch nhiá»‡m trong trÆ°á»ng há»£p thÃ´ng tin
                Ä‘á»‹a chá»‰ email, sá»‘ Ä‘iá»‡n thoáº¡i QuÃ½ khÃ¡ch nháº­p khÃ´ng chÃ­nh xac dáº«n
                Ä‘en khÃ´ng nhan Ä‘Æ°oc thu xac nhan. Vui lÃ²ng kiá»ƒm tra ká»¹ cac thÃ´ng
                tin nay truoc khi thá»±c hiá»‡n thanh toÃ¡n. Beta Cinemas khÃ´ng há»—
                trá»£ xá»­ lÃ½ vÃ  khÃ´ng chá»‹u trÃ¡ch nhiá»‡m trong trÆ°á»ng há»£p Ä‘Ã£ gá»­i thÆ°
                xÃ¡c nháº­n mÃ£ vÃ©/Ä‘Æ¡n hÃ ng Ä‘áº¿n Ä‘á»‹a chá»‰ email cá»§a QuÃ½ khÃ¡ch nhÆ°ng vÃ¬
                má»™t lÃ½ do nÃ o Ä‘Ã³ mÃ  QuÃ½ khÃ¡ch khÃ´ng thá»ƒ Ä‘áº¿n xem phim.
              </li>
              <li className="whitespace-normal">
                Beta Cinemas khÃ´ng chá»‹u trÃ¡ch nhiá»‡m trong trÆ°á»ng há»£p thÃ´ng tin
                Ä‘á»‹a chá»‰ email, sá»‘ Ä‘iá»‡n thoáº¡i QuÃ½ khÃ¡ch nháº­p khÃ´ng chÃ­nh xac dáº«n
                Ä‘en khÃ´ng nhan Ä‘Æ°oc thu xac nhan. Vui lÃ²ng kiá»ƒm tra ká»¹ cac thÃ´ng
                tin nay truoc khi thá»±c hiá»‡n thanh toÃ¡n. Beta Cinemas khÃ´ng há»—
                trá»£ xá»­ lÃ½ vÃ  khÃ´ng chá»‹u trÃ¡ch nhiá»‡m trong trÆ°á»ng há»£p Ä‘Ã£ gá»­i thÆ°
                xÃ¡c nháº­n mÃ£ vÃ©/Ä‘Æ¡n hÃ ng Ä‘áº¿n Ä‘á»‹a chá»‰ email cá»§a QuÃ½ khÃ¡ch nhÆ°ng vÃ¬
                má»™t lÃ½ do nÃ o Ä‘Ã³ mÃ  QuÃ½ khÃ¡ch khÃ´ng thá»ƒ Ä‘áº¿n xem phim.
              </li>
            </ol>
          </div>
        </div>
        <div className="mt-3 border-t-2 pt-3">
          <label htmlFor="term-payment">
            <input ref={inputRef} type="checkbox" id="term-payment" />
            <span className="font-bold">
              TÃ´i Ä‘á»“ng Ã½ vá»›i Ä‘iá»u khoáº£n sá»­ dá»¥ng vÃ  mua vÃ© cho ngÆ°á»i cÃ³ Ä‘á»™ tuá»•i
              phÃ¹ há»£p
            </span>
          </label>
          <div
            className="mx-auto max-w-[200px]"
            onClick={handleNavigatePayment}
          >
            <CustomButton title={'Thanh toÃ¡n'} isLoading={isLoading} />
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
                  Thá»ƒ loáº¡i
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
                  Thá»i lÆ°á»£ng
                </p>
              </div>
              <div>
                <span className="font-medium">{showTime?.movie?.duration}</span>{' '}
                <span className="font-medium">PhÃºt</span>
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
                  Ráº¡p chiáº¿u
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
                  NgÃ y chiáº¿u
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
                  Giá» chiáº¿u
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
                  PhÃ²ng chiáº¿u
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
                  Gháº¿ ngá»“i
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
                  <CustomButton title={'Quay láº¡i'} />
                </div>
              )}
              {!pathname.includes('payment') ? (
                <div
                  onClick={() => {
                    handleBeforePayment();
                  }}
                  className="min-w-[100px]"
                >
                  <CustomButton title={'Tiáº¿p tá»¥c'} isLoading={isLoading} />
                </div>
              ) : (
                <div
                  onClick={() => {
                    handlePayment();
                  }}
                  className="min-w-[100px]"
                >
                  <CustomButton title={'Tiáº¿p tá»¥c'} />
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
