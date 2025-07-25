// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

import { create } from '@apis/invoiceService';
import { findById } from '@apis/showTimeService';
import InfoBookingTicket from '@component/choose_seat/InfoBookingTicket';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ChooseSeatPage from './ChooseSeatsPage';
import Header from '@component/choose_seat/Header';
import PaymentPage from './PaymentPage';
import Footer from '@component/choose_seat/Footer';
import { setInvoice } from '@redux/slices/invoiceSlice';

const BookingTicket = () => {
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.user);
  const { invoices } = useSelector((state) => state.invoice);

  const [searchParams] = useSearchParams();
  const showTimeId = searchParams.get('st');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [totalMoneyTicket, setTotalMoneyTicket] = useState(0);

  // Cuộn thành Scroll về đầu trang
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.title = 'Chọn Ghế - Cineman Cinemas';
  }, [pathname]);

  // Tạo hóa đơn cho người dùng - Trạng thái PEDDING //
  useEffect(() => {
    if (!user) return;
    const invoice = invoices.find((i) => i.showTimeId === Number(showTimeId));
    if (invoice && invoice.invoice.status === 'PENDING') return;
    create(
      {
        email: user.email,
        phoneNumber: user.phoneNumber,
        customerId: user.userId,
      },
      showTimeId
    )
      .then((res) => {
        const existingInvoice = invoices.find(
          (i) => i.invoice.id === res.data.id
        );
        if (existingInvoice) return;
        dispatch(
          setInvoice({ showTimeId: Number(showTimeId), invoice: res.data })
        );
        setTotalMoneyTicket(res.data.totalMoneyTicket);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch, user.email, user.phoneNumber, user.userId]);

  /* Lấy thông tin của rạp chiếu */
  const [showTime, setShowTime] = useState({});
  useEffect(() => {
    findById(showTimeId)
      .then((res) => {
        setShowTime(res.data);
      })
      .catch((error) => {
        console.log(error);
        navigate('/', { replace: true });
      });
  }, [showTimeId, navigate]);
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
            <Header showTime={showTime} />
            {/* Phần sơ đồ ghế */}
            {pathname.includes('payment') ? (
              <PaymentPage showTime={showTime} />
            ) : (
              showTime?.id && (
                <ChooseSeatPage
                  isPayment={pathname.includes('payment')}
                  showTime={showTime}
                  setTotalMoneyTicket={setTotalMoneyTicket}
                  totalMoneyTicket={totalMoneyTicket}
                />
              )
            )}
            <Footer
              isPayment={pathname.includes('payment')}
              totalMoneyTicket={totalMoneyTicket}
            />
          </div>

          <div className={'lg:col-span-1'}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="sticky top-[100px] self-start"
            >
              {showTime?.id && <InfoBookingTicket showTime={showTime} />}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BookingTicket;
