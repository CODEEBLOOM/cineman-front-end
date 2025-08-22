import {
  findAllByDateAndCinemaTheaterId,
  findByQRCode,
} from '@apis/invoiceService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import ImageComponent from '@component/ImageComponent';
import { currencyFormatter } from '@libs/Utils';
import { Button, TextField } from '@mui/material';
import DateFormatter from '@utils/DateFormatter';
import { useEffect, useState } from 'react';
import { IoEyeOutline, IoQrCodeOutline } from 'react-icons/io5';
import { PiInvoiceBold } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ScanQRCode from './ScanQRCode';
import { useModelContext } from '@context/ModalContext';
import { useNavigate } from 'react-router-dom';

const InvoiceIndex = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [invoices, setInvoices] = useState([]);
  const [meta, setMeta] = useState({});
  const { openPopup, closeTopModal } = useModelContext();

  useEffect(() => {
    findAllByDateAndCinemaTheaterId({
      date: new DateFormatter().format('YYYY-MM-DD'),
      movieTheaterId: user?.movieTheater?.movieTheaterId || null,
      pageNo: 0,
      pageSize: 10,
    })
      .then((res) => {
        console.log(res);
        setInvoices(res.data.invoiceDetailResponses);
        setMeta(res.data.meta);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleShowDetail = (qrCode) => {
    return navigate(`/admin/invoice-detail/${qrCode}`);
  };

  // Xử lý Tìm kiếm theo QRCODE
  const handleFindByQRCode = (event) => {
    event.preventDefault();
    const qrCode = event.currentTarget.qrCode.value.trim();
    findByQRCode(qrCode)
      .then((res) => {
        if (
          res.data === null ||
          res.data.movieTheater.movieTheaterId !==
            user?.movieTheater?.movieTheaterId
        ) {
          return toast.error('Không tìm thấy đơn hóa !');
        }
        setInvoices([res.data]);
        toast.success('Lọc hóa đơn thành công !');
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Tìm kiếm đơn thất bại !');
        }
        setInvoices([]);
      });
  };

  const handleFindByDate = (event) => {
    event.preventDefault();
    const date = event.currentTarget.createdAt.value.trim();
    findAllByDateAndCinemaTheaterId({
      date: new DateFormatter(date).format('YYYY-MM-DD'),
      movieTheaterId: user?.movieTheater?.movieTheaterId || null,
      pageNo: 0,
      pageSize: 10,
    })
      .then((res) => {
        console.log(res);
        setInvoices(res.data.invoiceDetailResponses);
        setMeta(res.data.meta);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <CustomBreadcrumb
        className="mb-4"
        linkComponent={''}
        items={[
          {
            label: 'Hóa đơn',
            href: '/admin/invoice',
            // isHome: true,
            icon: <PiInvoiceBold fontSize="small" />,
          },
        ]}
        title={'Quản lý hóa đơn'}
      />
      <div className="bg-white px-6 py-3">
        <div>
          <div className="md: flex flex-col flex-wrap items-center gap-2 md:flex-row md:justify-between">
            <div className="grid gap-2 md:grid-cols-2">
              <form
                className="flex items-center gap-2"
                onSubmit={handleFindByDate}
              >
                <TextField
                  name="createdAt"
                  type="date"
                  defaultValue={new DateFormatter().format('YYYY-MM-DD')}
                  size="small"
                  fullWidth
                />
                <Button
                  variant="contained"
                  size="medium"
                  type="submit"
                  color="info"
                  className="w-[150px]"
                >
                  Lọc
                </Button>
              </form>
              <form
                className="flex items-center gap-2"
                onSubmit={handleFindByQRCode}
              >
                <TextField
                  name="qrCode"
                  label="Nhập mã QRCode"
                  type="text"
                  size="small"
                  fullWidth
                />
                <Button
                  variant="contained"
                  size="medium"
                  type="submit"
                  color="info"
                  className="w-[150px]"
                >
                  Tìm kiếm
                </Button>
              </form>
            </div>
            <div className="mt-2 md:mt-0">
              <Button
                variant="contained"
                size="medium"
                type="submit"
                color="info"
                startIcon={<IoQrCodeOutline />}
                onClick={() => openPopup(<ScanQRCode />)}
              >
                Quét Mã QRCode
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-10 overflow-auto">
          <h2 className="mb-2 font-semibold">Danh sách hóa đơn</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-[5%] font-semibold">STT</th>
                <th className="w-[15%] font-semibold">Mã vé</th>
                <th className="w-[25%] font-semibold">Thông tin khách hàng</th>
                <th className="w-[15%] min-w-[150px] font-semibold">
                  Hình ảnh
                </th>
                <th className="w-[30%] font-semibold">Thông tin vé</th>
                <th className="w-[10%] font-semibold">Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr key={index}>
                  <td className="w-[5%]">{index + 1}</td>
                  <td className="w-[15%]">{invoice.code}</td>
                  <td className="w-[25%]">
                    <div>
                      <p>
                        <span className="font-bold">Người dùng:</span>{' '}
                        <span>
                          {invoice.customer
                            ? invoice.customer.name
                            : invoice.staff.name}
                        </span>
                      </p>
                      <p>
                        <span className="font-bold">Chức vụ:</span>{' '}
                        <span>
                          {invoice.customer ? 'Khách hàng' : 'Nhân viên'}
                        </span>
                      </p>
                      <p>
                        <span className="font-bold">Email:</span>{' '}
                        <span>{invoice.email}</span>
                      </p>
                      <p>
                        <span className="font-bold">
                          Phương thức thanh toán:
                        </span>{' '}
                        <span>{invoice.paymentMethod}</span>
                      </p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <ImageComponent
                        src={invoice.movie.posterImage}
                        alt="Film Image"
                        className="h-[180px] w-[150px] object-cover"
                        width={150}
                        height={180}
                      />
                    </div>
                  </td>
                  <td className="w-[25%]">
                    <div className="flex flex-col justify-start gap-2">
                      <h2 className="text-[18px] font-medium text-primary">
                        {invoice?.movie?.title}
                      </h2>
                      <p className="font-medium">
                        Ngày chiếu:{' '}
                        <span className="font-normal">
                          {invoice?.showTime?.showDate}
                        </span>
                      </p>
                      <p className="font-medium">
                        Giờ chiếu:{' '}
                        <span className="font-normal">
                          {invoice?.showTime?.startTime}
                        </span>
                      </p>
                      <p className="font-medium">
                        Rạp chiếu:{' '}
                        <span className="font-normal">
                          {invoice?.movieTheater?.name}
                        </span>
                      </p>
                      <p className="font-medium">
                        Trạng thái:{' '}
                        {invoice.status === 'PAID' && (
                          <span className="rounded-lg bg-orange-200 p-1 font-medium text-red-500">
                            Chưa xuất vé
                          </span>
                        )}
                      </p>
                      <p className="font-medium">
                        Tổng tiền thanh toán:{' '}
                        <span className="font-normal">
                          {currencyFormatter(invoice.totalMoney)}
                        </span>
                      </p>
                    </div>
                  </td>
                  <td className="w-[10%]">
                    <Button
                      variant="contained"
                      size="small"
                      color="info"
                      onClick={() => handleShowDetail(invoice.code)}
                    >
                      <IoEyeOutline size={20} className="mr-2" />
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default InvoiceIndex;
