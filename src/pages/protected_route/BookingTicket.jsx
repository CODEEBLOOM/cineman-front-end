import { motion } from 'framer-motion';
import { create, findInvoiceByUserIdAndShowTimeId } from '@apis/invoiceService';
import { findById } from '@apis/showTimeService';
import InfoBookingTicket from '@component/choose_seat/InfoBookingTicket';
import {
  removeInvoice,
  setInvoice,
  setSavePointRedeem,
  setVoucher,
  updateInvoice,
} from '@redux/slices/invoiceSlice';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ChooseSeatPage from './ChooseSeatsPage';
import PaymentPage from './PaymentPage';

const BookingTicket = () => {
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.user);
  const { invoices } = useSelector((state) => state.invoice);

  const [searchParams] = useSearchParams();
  const showTimeId = searchParams.get('st');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [totalMoneyTicket, setTotalMoneyTicket] = useState(0);

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
            (item) => item.invoice.id === invoiceData.id
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
          const isReceptionist = user.roles.some(
            (role) => role.roleId === 'RCP'
          );
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
  }, [dispatch, invoices, showTimeId, user]);

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
  }, [navigate, showTimeId]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('bookingDeadline');
      dispatch(setVoucher(null));
      dispatch(setSavePointRedeem(0));
    };
  }, [dispatch]);

  const isPaymentPage = pathname.includes('payment');

  return (
    <div className="bg-slate-50 py-6 md:py-10">
      <div className="container">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            {isPaymentPage ? (
              <PaymentPage showTime={showTime} />
            ) : (
              showTime?.id && (
                <ChooseSeatPage
                  isPayment={isPaymentPage}
                  showTime={showTime}
                  setTotalMoneyTicket={setTotalMoneyTicket}
                  totalMoneyTicket={totalMoneyTicket}
                />
              )
            )}
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="self-start xl:sticky xl:top-28"
            >
              {showTime?.id && <InfoBookingTicket showTime={showTime} />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingTicket;
