// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

import { create, findInvoiceByUserIdAndShowTimeId } from '@apis/invoiceService';
import { findById } from '@apis/showTimeService';
import InfoBookingTicket from '@component/choose_seat/InfoBookingTicket';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ChooseSeatPage from './ChooseSeatsPage';
import Header from '@component/choose_seat/Header';
import PaymentPage from './PaymentPage';
import Footer from '@component/choose_seat/Footer';
import {
  removeInvoice,
  setInvoice,
  setSavePointRedeem,
  setVoucher,
  updateInvoice,
} from '@redux/slices/invoiceSlice';

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
    document.title = 'Chọn Ghế - Poly Cinemas';
  }, [pathname]);

  const invoiceCreatedRef = useRef(false);
  useEffect(() => {
    if (!user?.userId || invoiceCreatedRef.current) return;

    invoiceCreatedRef.current = true;

    const loadInvoice = async () => {
      try {
        const res = await findInvoiceByUserIdAndShowTimeId(
          user.userId,
          Number(showTimeId)
        );
        const invoiceData = res?.data;

        if (invoiceData) {
          const alreadyExists = invoices.some(
            (i) => i.invoice.id === invoiceData.id
          );
          if (alreadyExists) {
            if (invoiceData.showTimeId !== Number(showTimeId)) {
              dispatch(removeInvoice(invoiceData.id));
              dispatch(
                setInvoice({
                  showTimeId: Number(showTimeId),
                  invoice: invoiceData,
                })
              );
            } else {
              dispatch(updateInvoice(invoiceData));
            }
          } else {
            dispatch(
              setInvoice({
                showTimeId: Number(showTimeId),
                invoice: invoiceData,
              })
            );
          }
          setTotalMoneyTicket(invoiceData.totalMoneyTicket);
        } else {
          const isReceptionist = user.roles.some((r) => r.roleId === 'RCP');
          const data = isReceptionist
            ? {
                email: user.email,
                phoneNumber: user.phoneNumber,
                staffId: user.userId,
              }
            : {
                email: user.email,
                phoneNumber: user.phoneNumber,
                customerId: user.userId,
              };

          const newInvoice = await create(data);
          dispatch(
            setInvoice({
              showTimeId: Number(showTimeId),
              invoice: newInvoice.data,
            })
          );
          setTotalMoneyTicket(newInvoice.data.totalMoneyTicket);
        }
      } catch (err) {
        console.error('Error handling invoice:', err);
      }
    };

    loadInvoice();
  }, [dispatch, user, showTimeId, invoices]);

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

  // Clear Timer //
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('bookingDeadline'); // Xóa khi unmount
      dispatch(setVoucher(null));
      dispatch(setSavePointRedeem(0));
    };
  }, [dispatch]);

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
