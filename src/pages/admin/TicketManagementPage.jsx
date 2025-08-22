import CustomBreadcrumb from '@component/CustomBreakcrumb';
import QRGenerator from '@component/QRGenerator';
import { Button } from '@mui/material';
import { VscSymbolNamespace } from 'react-icons/vsc';

import { MdOutlineMarkEmailRead, MdPrint } from 'react-icons/md';
import { TfiTicket } from 'react-icons/tfi';
import { useParams } from 'react-router-dom';
import { IoIosPhonePortrait } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { findByQRCode } from '@apis/invoiceService';
import ImageComponent from '@component/ImageComponent';
import { currencyFormatter } from '@libs/Utils';

const TicketManagementPage = () => {
  const { qrCode } = useParams();
  const [invoiceDetail, setInvoiceDetail] = useState({});

  useEffect(() => {
    document.title = 'Quản lý xuất vé - POLY CINEMAS';
    const fetchData = async () => {
      try {
        const res = await findByQRCode(qrCode);
        setInvoiceDetail(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const getTickets = (ticketType) => {
    const tickets = [];
    invoiceDetail.tickets.forEach((ticket) => {
      if (ticket.seat.seatType.id === ticketType) tickets.push(ticket);
    });
    return tickets;
  };

  return (
    <>
      <CustomBreadcrumb
        className="mb-2"
        linkComponent={''}
        items={[
          {
            label: 'Xuất vé',
            // isHome: true,
            icon: <TfiTicket fontSize="small" />,
          },
        ]}
        title={'Quản lý xuất vé'}
      />
      <div className="px-2 py-2">
        <div>
          <div className="grid gap-2 md:grid-cols-12">
            <div className="col-span-9 rounded-md bg-white px-3 py-2">
              <div className="mb-3 flex justify-end">
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<MdPrint />}
                >
                  In vé
                </Button>
              </div>
              <div>
                {!invoiceDetail?.id ? (
                  <div className="flex h-64 flex-col items-center justify-center text-center">
                    <p>Danh sách hóa đơn trống</p>
                  </div>
                ) : (
                  <table className="w-full overflow-auto">
                    <thead>
                      <tr>
                        <th className="w-[20%] font-semibold">Phim</th>
                        <th className="w-[15%] font-semibold">Xuất chiếu</th>
                        <th className="w-[25%] font-semibold">Combo</th>
                        <th className="w-[30%] min-w-[150px] font-semibold">
                          Vé
                        </th>
                        <th className="w-[10%] font-semibold">Giá tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="max-w-[140px]">
                          <div>
                            <ImageComponent
                              src={invoiceDetail?.movie?.posterImage}
                              alt="Film Image"
                              className="h-[180px] w-[140px] object-cover"
                              width={140}
                              height={180}
                            />
                            <p className="mt-2 truncate text-center text-[16px] font-semibold text-primary">
                              {invoiceDetail?.movie?.title}
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col space-y-2">
                            <p>
                              <span className="font-semibold">Rạp chiếu:</span>{' '}
                              {invoiceDetail?.movieTheater?.name}
                            </p>
                            <p>
                              <span className="font-semibold">Ngay chiếu:</span>{' '}
                              {invoiceDetail?.showTime?.showDate}
                            </p>
                            <p>
                              {' '}
                              <span className="font-semibold">
                                Giờ chiếu:
                              </span>{' '}
                              {invoiceDetail?.showTime?.startTime} -{' '}
                              <p>{invoiceDetail?.showTime?.endTime}</p>
                            </p>
                          </div>
                        </td>
                        <td className="max-w-[100px]">
                          <div>
                            {(invoiceDetail?.detailBookingSnacks || []).map(
                              (snack) => (
                                <>
                                  <p key={snack.snackId} className="truncate">
                                    <span className="font-semibold">
                                      {snack.snack.snackName}{' '}
                                    </span>
                                  </p>
                                  <span className="text-pink-400">
                                    {currencyFormatter(snack.totalMoney)}
                                  </span>
                                </>
                              )
                            )}
                            {invoiceDetail?.detailBookingSnacks?.length ===
                              0 && (
                              <p className="truncate">
                                <span className="font-semibold">
                                  Không đi kèm
                                </span>
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="max-w-[120px]">
                          <div>
                            {invoiceDetail?.tickets &&
                              getTickets('VIP').length > 0 && (
                                <>
                                  <p>
                                    <span className="font-semibold">
                                      Ghế VIP:
                                    </span>{' '}
                                  </p>
                                  <p className="whitespace-normal">
                                    {getTickets('VIP').map((ticket, index) => (
                                      <span
                                        key={index}
                                        className="text-pink-400"
                                      >
                                        {ticket.seat.label} ,
                                      </span>
                                    ))}
                                  </p>
                                </>
                              )}
                            {invoiceDetail?.tickets &&
                              getTickets('REGULAR').length > 0 && (
                                <>
                                  <p>
                                    <span className="font-semibold">
                                      Ghế thường:
                                    </span>{' '}
                                  </p>
                                  <p className="whitespace-normal">
                                    {getTickets('REGULAR').map(
                                      (ticket, index) => (
                                        <span
                                          key={index}
                                          className="text-pink-400"
                                        >
                                          {ticket.seat.label}{' '}
                                        </span>
                                      )
                                    )}
                                  </p>
                                </>
                              )}
                            {invoiceDetail?.tickets &&
                              getTickets('DOUBLE').length > 0 && (
                                <>
                                  <p>
                                    <span className="font-semibold">
                                      Ghế thường:
                                    </span>{' '}
                                  </p>
                                  <p className="whitespace-normal">
                                    {getTickets('DOUBLE').map(
                                      (ticket, index) => (
                                        <span
                                          key={index}
                                          className="text-pink-400"
                                        >
                                          {ticket.seat.label} ' '
                                        </span>
                                      )
                                    )}
                                  </p>
                                </>
                              )}
                          </div>
                        </td>
                        <td>
                          <div className="grid grid-cols-2">
                            <p className="w-[100px] font-semibold">
                              Tổng tiền vé:{' '}
                            </p>
                            <p className="text-pink-400">
                              {currencyFormatter(
                                invoiceDetail?.totalMoneyTicket
                              )}
                            </p>
                          </div>
                          <p>
                            <span className="font-semibold">
                              Tổng tiền discount:{' '}
                            </span>
                            <span className="text-pink-400">
                              {currencyFormatter(
                                invoiceDetail?.totalMoneyPromotion
                              )}
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold">Đổi điểm: </span>
                            <span className="text-pink-400">
                              {currencyFormatter(
                                invoiceDetail?.totalMoneyDiscount
                              )}
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold">
                              Tổng tiền snack:{' '}
                            </span>
                            <span className="text-pink-400">
                              {currencyFormatter(
                                invoiceDetail?.totalMoneySnack
                              )}
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold">
                              Tổng tiền còn lại:{' '}
                            </span>
                            <span className="text-pink-400">
                              {currencyFormatter(invoiceDetail?.totalMoney)}
                            </span>
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            <div className="col-span-3 flex flex-col space-y-2">
              <div className="rounded-md bg-white px-3 py-2">
                <div className="flex justify-between border-b-2 pb-2">
                  <p className="font-medium">Trạng thái vé: </p>
                  <small className="rounded-sm bg-red-100 p-1 text-red-500">
                    Chưa xuất vé
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
                      {' '}
                      <VscSymbolNamespace size={20} />
                      Họ tên:
                    </p>{' '}
                    <p>
                      {invoiceDetail?.customer?.fullName ||
                        invoiceDetail?.staff?.fullName}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="flex items-center gap-2 font-semibold">
                      {' '}
                      <MdOutlineMarkEmailRead size={20} />
                      Email:
                    </p>{' '}
                    <p className="w-[180px] truncate whitespace-nowrap text-end">
                      {invoiceDetail?.customer?.email ||
                        invoiceDetail?.staff?.email}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="flex items-center gap-2 font-semibold">
                      {' '}
                      <IoIosPhonePortrait size={20} />
                      Sdt:
                    </p>{' '}
                    <p>
                      {invoiceDetail?.customer?.phoneNumber ||
                        invoiceDetail?.staff?.phoneNumber}
                    </p>
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
