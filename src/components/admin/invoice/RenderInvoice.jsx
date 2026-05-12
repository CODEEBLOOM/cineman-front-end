import { updateStatusUsed } from '@apis/invoiceService';
import QRGenerator from '@component/QRGenerator';
import { currencyFormatter } from '@libs/Utils';
import { Button } from '@mui/material';
import DateFormatter from '@utils/DateFormatter';
import React, { useRef } from 'react';
import { MdPrint } from 'react-icons/md';
import { Navigate, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';

const RenderInvoice = ({ invoiceDetail }) => {
  const detailInvoiceRef = useRef(null);
  const navigate = useNavigate();

  const handlePrint = useReactToPrint({
    content: () => detailInvoiceRef.current,

    contentRef: detailInvoiceRef,
    documentTitle: 'Invoice',
    pageStyle: `
      @page { size: A4; margin: 12mm; }
      @media print {
        .no-print { display: none !important; }       /* ẩn nút khi in */
        .print-only { display: block !important; }    /* chỉ hiện khi in */
        .h-screen { height: auto !important; }        /* tránh cắt trang */
        .page-break { break-after: page; page-break-after: always; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
    onAfterPrint: async () => {
      const res = await updateStatusUsed(invoiceDetail?.code);
      if (res.status === 200 || res.status === 201) {
        toast.success('In hóa đơn thành công');
        return navigate('/admin/invoice');
      }
    },
    onPrintError: (where, error) => {
      console.log(where, error);
    },
  });

  return (
    <>
      <div className="mb-3 flex justify-end">
        <Button
          variant="contained"
          color="info"
          startIcon={<MdPrint />}
          onClick={handlePrint}
          disabled={invoiceDetail?.status === 'USED'}
        >
          In vé
        </Button>
      </div>
      <div
        ref={detailInvoiceRef}
        className="print-only"
        style={{ display: 'none' }}
      >
        {/* Hóa đơn chi tiết */}
        <div className="h-screen px-8 py-5 text-center">
          <h1 className="mb-2 border-b-2 border-dashed text-[25px] font-semibold uppercase text-pink-500">
            Hóa đơn chi tiết
          </h1>
          <div className="mb-2 border-b-2 border-dashed py-3 text-start">
            <h2 className="font-semibold">
              Chi nhánh công ty Poly Cinemas -{' '}
              {invoiceDetail?.movieTheater?.name}
            </h2>
            <p>
              <span className="font-bold">Địa chỉ:</span>&nbsp;
              <span>{invoiceDetail?.movieTheater?.address}</span>
            </p>
            <p>
              <span className="font-bold">Hotline:</span>&nbsp;
              <span>{invoiceDetail?.movieTheater?.hotline}</span>
            </p>
          </div>
          <div className="mb-2 border-b-2 border-dashed py-3 text-start">
            <h2 className="font-semibold">
              Rạp chiếu - {invoiceDetail?.movieTheater?.name}
            </h2>
            <p>
              Thời gian đặt vé:{' '}
              {new DateFormatter(invoiceDetail.createdAt).format(
                'HH:mm DD/MM/YYYY'
              )}
            </p>
          </div>
          <div className="mb-2 border-b-2 border-dashed py-3 text-start">
            <h2 className="font-semibold">
              Phim - {invoiceDetail?.movie?.title}
            </h2>
            <p>
              <span className="font-bold">Giới hạn tuổi:</span>&nbsp;
              <span>{invoiceDetail?.movie?.age}&nbsp;tuổi theo quy định</span>
            </p>
            <p>
              <span className="font-bold">Phòng:</span>&nbsp;
              <span>{invoiceDetail?.cinemaTheater?.name}</span>
            </p>
            <p>
              <span className="font-bold">Ghế:</span>&nbsp;
              <span>
                {invoiceDetail?.tickets
                  .map((ticket) => ticket.seat.label)
                  .join(', ')}
              </span>
            </p>
          </div>
          <div className="mb-2 border-b-2 border-dashed py-3 text-start">
            <h2 className="font-semibold">
              Combo kèm theo -{' '}
              {currencyFormatter(invoiceDetail?.totalMoneySnack)}
            </h2>
            <ul>
              {invoiceDetail?.detailBookingSnacks.map((snack) => (
                <li key={snack.id}>
                  <span className="font-semibold">{snack.snack.snackName}</span>{' '}
                  - {snack.totalSnack} x{' '}
                  {currencyFormatter(snack.snack.unitPrice)}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-2 border-b-2 border-dashed py-3 text-start">
            <div className="flex justify-between">
              <h2 className="font-semibold">Giá vé:</h2>
              <h2 className="font-semibold">
                {currencyFormatter(invoiceDetail?.totalMoneyTicket)}
              </h2>
            </div>
            <div className="flex justify-between">
              <h2 className="font-semibold">Giá combo:</h2>
              <h2 className="font-semibold">
                {currencyFormatter(invoiceDetail?.totalMoneySnack)}
              </h2>
            </div>
            <div className="flex justify-between">
              <h2 className="font-semibold">Giảm giá:</h2>
              <h2 className="font-semibold">
                {currencyFormatter(invoiceDetail?.totalMoneyPromotion)}
              </h2>
            </div>
            <div className="flex justify-between">
              <h2 className="font-semibold">Đổi điểm:</h2>
              <h2 className="font-semibold">
                {currencyFormatter(invoiceDetail?.totalMoneyDiscount)}
              </h2>
            </div>
            <div className="flex justify-between">
              <h2 className="font-semibold">Thành tiền:</h2>
              <h2 className="font-semibold">
                {currencyFormatter(invoiceDetail?.totalMoney)}
              </h2>
            </div>
          </div>
        </div>
        <div className="page-break" />
        {/* Hóa đơn Combo */}
        <div className="h-screen px-8 py-5 text-center">
          <h1 className="mb-2 border-b-2 border-dashed text-[25px] font-semibold uppercase text-pink-500">
            Hóa đơn combo
          </h1>
          <div className="mb-2 border-b-2 border-dashed py-3 text-start">
            <h2 className="font-semibold">
              Chi nhánh công ty Poly Cinemas -{' '}
              {invoiceDetail?.movieTheater?.name}
            </h2>
            <p>
              <span className="font-bold">Địa chỉ:</span>&nbsp;
              <span>{invoiceDetail?.movieTheater?.address}</span>
            </p>
            <p>
              <span className="font-bold">Hotline:</span>&nbsp;
              <span>{invoiceDetail?.movieTheater?.hotline}</span>
            </p>
          </div>
          <div className="mb-2 border-b-2 border-dashed py-3 text-start">
            <h2 className="font-semibold">
              Rạp chiếu - {invoiceDetail?.movieTheater?.name}
            </h2>
            <p>
              Thời gian đặt vé:{' '}
              {new DateFormatter(invoiceDetail.createdAt).format(
                'HH:mm DD/MM/YYYY'
              )}
            </p>
          </div>
          <div className="mb-2 border-b-2 border-dashed py-3 text-start">
            <h2 className="font-semibold">
              Combo kèm theo -{' '}
              {currencyFormatter(invoiceDetail?.totalMoneySnack)}
            </h2>
            <ul>
              {invoiceDetail?.detailBookingSnacks.map((snack) => (
                <li key={snack.id}>
                  <span className="font-semibold">{snack.snack.snackName}</span>{' '}
                  - {snack.totalSnack} x{' '}
                  {currencyFormatter(snack.snack.unitPrice)}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-2 border-b-2 border-dashed py-3 text-start">
            <div className="flex justify-between">
              <h2 className="font-semibold">Thành tiền:</h2>
              <h2 className="font-semibold">
                {currencyFormatter(invoiceDetail?.totalMoneySnack)}
              </h2>
            </div>
          </div>
        </div>
        <div className="page-break" />
        {/* Hóa đơn cho từng vé */}
        {invoiceDetail.tickets.map((ticket) => (
          <React.Fragment key={ticket.id}>
            <div className="h-screen px-8 py-5 text-center" key={ticket.id}>
              <h1 className="mb-2 border-b-2 border-dashed text-[25px] font-semibold uppercase text-pink-500">
                vé xem phim
              </h1>
              <div className="mb-2 border-b-2 border-dashed py-3 text-start">
                <h2 className="font-semibold">
                  Chi nhánh công ty Poly Cinemas -{' '}
                  {invoiceDetail?.movieTheater?.name}
                </h2>
                <p>
                  <span className="font-bold">Địa chỉ:</span>&nbsp;
                  <span>{invoiceDetail?.movieTheater?.address}</span>
                </p>
                <p>
                  <span className="font-bold">Hotline:</span>&nbsp;
                  <span>{invoiceDetail?.movieTheater?.hotline}</span>
                </p>
              </div>
              <div className="mb-2 border-b-2 border-dashed py-3 text-start">
                <h2 className="font-semibold">
                  Rạp chiếu - {invoiceDetail?.movieTheater?.name}
                </h2>
                <p>
                  Thời gian đặt vé:{' '}
                  {new DateFormatter(invoiceDetail.createdAt).format(
                    'HH:mm DD/MM/YYYY'
                  )}
                </p>
              </div>
              <div className="mb-2 border-b-2 border-dashed py-3 text-start">
                <h2 className="font-semibold">
                  Phim - {invoiceDetail?.movie?.title}
                </h2>
                <p>
                  <span className="font-bold">Giới hạn tuổi:</span>&nbsp;
                  <span>
                    {invoiceDetail?.movie?.age}&nbsp;tuổi theo quy định
                  </span>
                </p>
                <p>
                  <span className="font-bold">Phòng:</span>&nbsp;
                  <span>{invoiceDetail?.cinemaTheater?.name}</span>
                </p>
                <p>
                  <span className="font-bold">Ghế:</span>&nbsp;
                  <span>{ticket.seat.label}</span>
                </p>
              </div>
              <div>
                <QRGenerator text={invoiceDetail.code} />
              </div>
            </div>
            <div className="page-break" />
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default RenderInvoice;
