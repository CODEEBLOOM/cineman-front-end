import { motion } from 'framer-motion';
import { create, findInvoiceByUserIdAndShowTimeId } from '@apis/invoiceService';
import { findById } from '@apis/showTimeService';
import Footer from '@component/choose_seat/Footer';
import Header from '@component/choose_seat/Header';
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

const surfaceClassName =
  'overflow-hidden rounded-[28px] border border-white/60 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.14)] backdrop-blur';

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

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_55%,#e8edf5_100%)] py-5 md:py-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_62%)]" />
      <div className="pointer-events-none absolute left-[-120px] top-28 h-72 w-72 rounded-full bg-[rgba(148,163,184,0.12)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-[-100px] h-64 w-64 rounded-full bg-[rgba(148,163,184,0.14)] blur-3xl" />

      <div className="container relative">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <section className={surfaceClassName}>
              <div className="border-b border-slate-200/90 px-5 pt-4 md:px-8 md:pt-5">
                <Header showTime={showTime} />
              </div>

              <div className="px-5 pb-5 pt-5 md:px-8 md:pb-7 md:pt-6">
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
              </div>
            </section>

            <section className={surfaceClassName}>
              <div className="px-5 py-5 md:px-8 md:py-6">
                <Footer
                  isPayment={pathname.includes('payment')}
                  totalMoneyTicket={totalMoneyTicket}
                />
              </div>
            </section>
          </div>

          <div className="xl:pl-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="self-start xl:sticky xl:top-0"
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
