import { findByQRCode } from '@apis/invoiceService';
import BookingSnack from '@component/admin/invoice/BookingSnack';
import RenderInvoice from '@component/admin/invoice/RenderInvoice';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import ImageComponent from '@component/ImageComponent';
import QRGenerator from '@component/QRGenerator';
import { currencyFormatter } from '@libs/Utils';
import { setSnacks } from '@redux/slices/invoiceASlide';
import { useEffect, useMemo, useState } from 'react';
import { MdOutlineMarkEmailRead } from 'react-icons/md';
import { IoIosPhonePortrait } from 'react-icons/io';
import { TfiTicket } from 'react-icons/tfi';
import { VscSymbolNamespace } from 'react-icons/vsc';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const TicketManagementPage = () => {
  const dispatch = useDispatch();
  const { qrCode } = useParams();
  const [invoiceDetail, setInvoiceDetail] = useState({});

  useEffect(() => {
    document.title = 'Quản lý xuất vé - POLY CINEMAS';
    const fetchData = async () => {
      try {
        const res = await findByQRCode(qrCode);
        setInvoiceDetail(res.data);
        const item = res.data.detailBookingSnacks.map((snackItem) => ({
          ...snackItem.snack,
          quantity: snackItem.totalSnack,
        }));
        dispatch(setSnacks(item));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch, qrCode]);

  const getTickets = (ticketType) => {
    const tickets = [];
    (invoiceDetail.tickets || []).forEach((ticket) => {
      if (ticket.seat.seatType.id === ticketType) tickets.push(ticket);
    });
    return tickets;
  };

  const rows = useMemo(
    () =>
      invoiceDetail?.id
        ? [
            {
              id: invoiceDetail.id,
              ...invoiceDetail,
            },
          ]
        : [],
    [invoiceDetail]
  );

  const columns = [
    {
      field: 'movieInfo',
      headerName: 'Phim',
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <div>
          <ImageComponent
            src={params.row?.movie?.posterImage}
            alt="Film Image"
            className="h-[180px] w-[140px] object-cover"
            width={140}
            height={180}
          />
          <p className="mt-2 truncate text-center text-[16px] font-semibold text-primary">
            {params.row?.movie?.title}
          </p>
        </div>
      ),
    },
    {
      field: 'showTimeInfo',
      headerName: 'Xuất chiếu',
      flex: 1,
      minWidth: 260,
      sortable: false,
      renderCell: (params) => (
        <div className="flex flex-col space-y-2 py-2">
          <p>
            <span className="font-semibold">Rạp chiếu:</span> {params.row?.movieTheater?.name}
          </p>
          <p>
            <span className="font-semibold">Ngày chiếu:</span> {params.row?.showTime?.showDate}
          </p>
          <p>
            <span className="font-semibold">Giờ chiếu:</span> {params.row?.showTime?.startTime} - {params.row?.showTime?.endTime}
          </p>
        </div>
      ),
    },
    {
      field: 'comboInfo',
      headerName: 'Combo',
      flex: 1,
      minWidth: 240,
      sortable: false,
      renderCell: (params) => (
        <div className="py-2">
          {(params.row?.detailBookingSnacks || []).map((snack) => (
            <div key={snack.id}>
              <p className="truncate">
                <span className="font-semibold">{snack.snack.snackName} </span>
              </p>
              <span className="text-pink-400">
                {snack.totalSnack} x {currencyFormatter(snack.snack.unitPrice)}
              </span>
            </div>
          ))}
          {params.row?.detailBookingSnacks?.length === 0 && (
            <p className="truncate">
              <span className="font-semibold">Không đi kèm</span>
            </p>
          )}
        </div>
      ),
    },
    {
      field: 'ticketInfo',
      headerName: 'Vé',
      flex: 1.2,
      minWidth: 260,
      sortable: false,
      renderCell: (params) => (
        <div className="py-2">
          {getTickets('VIP').length > 0 && (
            <>
              <p>
                <span className="font-semibold">Ghế VIP:</span>
              </p>
              <p className="whitespace-normal text-pink-400">
                {getTickets('VIP').map((ticket) => ticket.seat.label).join(', ')}
              </p>
            </>
          )}
          {getTickets('REGULAR').length > 0 && (
            <>
              <p>
                <span className="font-semibold">Ghế thường:</span>
              </p>
              <p className="whitespace-normal text-pink-400">
                {getTickets('REGULAR').map((ticket) => ticket.seat.label).join(', ')}
              </p>
            </>
          )}
          {getTickets('DOUBLE').length > 0 && (
            <>
              <p>
                <span className="font-semibold">Ghế đôi:</span>
              </p>
              <p className="whitespace-normal text-pink-400">
                {getTickets('DOUBLE').map((ticket) => ticket.seat.label).join(', ')}
              </p>
            </>
          )}
        </div>
      ),
    },
    {
      field: 'priceInfo',
      headerName: 'Giá tiền',
      flex: 1,
      minWidth: 260,
      sortable: false,
      renderCell: (params) => (
        <div className="py-2">
          <div className="grid grid-cols-2">
            <p className="w-[100px] font-semibold">Tổng tiền vé:</p>
            <p className="text-pink-400">{currencyFormatter(params.row?.totalMoneyTicket)}</p>
          </div>
          <p>
            <span className="font-semibold">Tổng tiền discount: </span>
            <span className="text-pink-400">{currencyFormatter(params.row?.totalMoneyPromotion)}</span>
          </p>
          <p>
            <span className="font-semibold">Đổi điểm: </span>
            <span className="text-pink-400">{currencyFormatter(params.row?.totalMoneyDiscount)}</span>
          </p>
          <p>
            <span className="font-semibold">Tổng tiền snack: </span>
            <span className="text-pink-400">{currencyFormatter(params.row?.totalMoneySnack)}</span>
          </p>
          <p>
            <span className="font-semibold">Tổng tiền còn lại: </span>
            <span className="text-pink-400">{currencyFormatter(params.row?.totalMoney)}</span>
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <CustomBreadcrumb
        className="mb-2"
        linkComponent={''}
        items={[
          {
            label: 'Xuất vé',
            icon: <TfiTicket fontSize="small" />,
          },
        ]}
        title={'Quản lý xuất vé'}
      />
      <div className="px-2 py-2">
        <div>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 rounded-md bg-white px-3 py-2 md:col-span-9">
              {invoiceDetail?.id && <RenderInvoice invoiceDetail={invoiceDetail} />}
              <div className="overflow-auto">
                {!invoiceDetail?.id ? (
                  <div className="flex h-64 flex-col items-center justify-center overflow-auto text-center">
                    <p>Danh sách hóa đơn trống</p>
                  </div>
                ) : (
                  <DataGridTable
                    rows={rows}
                    columns={columns}
                    hideFooter
                    minWidth={1380}
                    getRowId={(row) => row.id}
                  />
                )}
              </div>
              {invoiceDetail?.id && (
                <BookingSnack invoiceId={invoiceDetail?.id} status={invoiceDetail?.status} />
              )}
            </div>
            <div className="col-span-12 flex flex-col space-y-2 md:col-span-3">
              <div className="rounded-md bg-white px-3 py-2">
                <div className="flex justify-between border-b-2 pb-2">
                  <p className="font-medium">Trạng thái vé: </p>
                  <small
                    className={`rounded-sm bg-red-100 p-1 text-red-500 ${invoiceDetail?.status === 'USED' ? 'bg-green-100 !text-green-500' : ''}`}
                  >
                    {invoiceDetail?.status === 'USED' ? 'Đã xuất vé' : 'Chưa xuất vé'}
                  </small>
                </div>
                <QRGenerator text={qrCode} />
              </div>
              <div className="rounded-md bg-white px-3 py-2">
                <div className="flex justify-center border-b-2 pb-2">
                  <p className="font-medium">Thông tin người đặt vé</p>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between">
                    <p className="flex items-center gap-2 font-semibold">
                      <VscSymbolNamespace size={20} />
                      Họ tên:
                    </p>
                    <p>{invoiceDetail?.customer?.fullName || invoiceDetail?.staff?.fullName}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="flex items-center gap-2 font-semibold">
                      <MdOutlineMarkEmailRead size={20} />
                      Email:
                    </p>
                    <p className="w-[180px] truncate whitespace-nowrap text-end">
                      {invoiceDetail?.customer?.email || invoiceDetail?.staff?.email}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="flex items-center gap-2 font-semibold">
                      <IoIosPhonePortrait size={20} />
                      Sdt:
                    </p>
                    <p>{invoiceDetail?.customer?.phoneNumber || invoiceDetail?.staff?.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TicketManagementPage;
