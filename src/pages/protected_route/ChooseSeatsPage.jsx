import TicketGrid from '@component/choose_seat/TicketGrid';
import NoteInfo from '@component/choose_seat/NoteInfo';
import { useSelector } from 'react-redux';

const ChooseSeatPage = ({ isPayment, showTime, setTotalMoneyTicket }) => {
  const { invoices } = useSelector((state) => state.invoice);
  const invoice = invoices.find(
    (invoice) => invoice.showTimeId === showTime.id
  );
  return (
    <>
      {/* Phần sơ đồ ghế */}
      <div>
        {/* Phần chỉnh */}
        <div className={`${isPayment ? 'hidden' : ''}`}>
          {/* Thông tin chú thích ghế */}
          <NoteInfo />

          {/*Phần render và chọn ghế */}
          <div
            className={
              'mt-5 justify-items-center overflow-x-scroll scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400'
            }
          >
            <div className="float-left space-y-2">
              {/* Ảnh màn hình */}
              <img
                src="/ic-screen.png"
                alt="img"
                className="block h-auto w-full"
              />
              {invoice && (
                <TicketGrid
                  showTime={showTime}
                  invoiceId={invoice.invoice.id}
                  setTotalMoneyTicket={setTotalMoneyTicket}
                />
              )}
            </div>
          </div>
        </div>

        {/*  Phần cuối */}
      </div>
    </>
  );
};

export default ChooseSeatPage;
