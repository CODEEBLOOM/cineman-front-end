import {
  findAllByDateAndCinemaTheaterId,
  findByQRCode,
} from '@apis/invoiceService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import EmptyList from '@component/cinema_showtime/EmptyList';
import ImageComponent from '@component/ImageComponent';
import { useModelContext } from '@context/ModalContext';
import { currencyFormatter } from '@libs/Utils';
import { setCreatedDate, setQuery } from '@redux/slices/invoiceASlide';
import { Button, TextField } from '@mui/material';
import DateFormatter from '@utils/DateFormatter';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IoEyeOutline, IoQrCodeOutline } from 'react-icons/io5';
import { PiInvoiceBold } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ScanQRCode from './ScanQRCode';

const DEFAULT_PAGE_SIZE = 10;

const InvoiceIndex = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { openPopup } = useModelContext();
  const { createdDate, query } = useSelector((state) => state.invoiceASlice);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [meta, setMeta] = useState({
    totalElements: 0,
    totalPages: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    currentPage: 0,
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const activeDate = createdDate || new DateFormatter(new Date()).format('YYYY-MM-DD');

  const loadInvoicesByDate = useCallback(
    async ({ date, pageNo = 0, pageSize = paginationModel.pageSize }) => {
      setIsLoading(true);

      try {
        const res = await findAllByDateAndCinemaTheaterId({
          date: new DateFormatter(date).format('YYYY-MM-DD'),
          movieTheaterId: user?.movieTheater?.movieTheaterId || null,
          pageNo,
          pageSize,
        });

        setInvoices(res.data.invoiceDetailResponses || []);
        setMeta(
          res.data.meta || {
            totalElements: 0,
            totalPages: 0,
            pageSize,
            currentPage: pageNo,
          }
        );
      } catch (error) {
        console.log(error);
        setInvoices([]);
      } finally {
        setIsLoading(false);
      }
    },
    [paginationModel.pageSize, user?.movieTheater?.movieTheaterId]
  );

  useEffect(() => {
    loadInvoicesByDate({ date: activeDate, pageNo: 0, pageSize: paginationModel.pageSize });
  }, [activeDate, loadInvoicesByDate, paginationModel.pageSize]);

  const handleShowDetail = (qrCode) => navigate(`/admin/invoice-detail/${qrCode}`);

  const handleFindByQRCode = async (event) => {
    event.preventDefault();
    const qrCode = event.currentTarget.qrCode.value.trim();

    if (!qrCode) {
      dispatch(setQuery({ qrCode: '' }));
      await loadInvoicesByDate({ date: activeDate, pageNo: 0, pageSize: paginationModel.pageSize });
      return;
    }

    setIsLoading(true);

    try {
      const res = await findByQRCode(qrCode);

      if (
        res.data === null ||
        res.data.movieTheater.movieTheaterId !== user?.movieTheater?.movieTheaterId
      ) {
        toast.error('Không tìm thấy đơn hóa !');
        setInvoices([]);
        return;
      }

      setInvoices([res.data]);
      setMeta({
        totalElements: 1,
        totalPages: 1,
        pageSize: 1,
        currentPage: 0,
      });
      dispatch(setQuery({ qrCode }));
      setPaginationModel((currentValue) => ({ ...currentValue, page: 0 }));
      toast.success('Lọc hóa đơn thành công !');
    } catch (error) {
      if (error?.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Tìm kiếm đơn thất bại !');
      }
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindByDate = async (event) => {
    event.preventDefault();
    const date = event.target.value || activeDate;

    dispatch(setCreatedDate(date));
    dispatch(setQuery({ qrCode: '' }));
    setPaginationModel((currentValue) => ({ ...currentValue, page: 0 }));
    await loadInvoicesByDate({ date, pageNo: 0, pageSize: paginationModel.pageSize });
    toast.success('Lọc hóa đơn thành công !');
  };

  useEffect(() => {
    if (!query?.qrCode && paginationModel.page !== meta.currentPage) {
      loadInvoicesByDate({
        date: activeDate,
        pageNo: paginationModel.page,
        pageSize: paginationModel.pageSize,
      });
    }
  }, [
    activeDate,
    loadInvoicesByDate,
    meta.currentPage,
    paginationModel.page,
    paginationModel.pageSize,
    query?.qrCode,
  ]);

  const rows = useMemo(
    () =>
      invoices.map((invoice, index) => ({
        ...invoice,
        gridIndex: index + 1 + paginationModel.page * paginationModel.pageSize,
      })),
    [invoices, paginationModel.page, paginationModel.pageSize]
  );

  const columns = [
    {
      field: 'gridIndex',
      headerName: 'STT',
      width: 90,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'code',
      headerName: 'Mã vé',
      width: 180,
      renderCell: (params) => (
        <div className="py-2 text-center">
          <span>{params.value}</span>
          <p>{new DateFormatter(params.row.createdAt).format('HH:mm DD/MM/YYYY')}</p>
        </div>
      ),
    },
    {
      field: 'customerInfo',
      headerName: 'Thông tin khách hàng',
      flex: 1.2,
      minWidth: 260,
      sortable: false,
      renderCell: (params) => (
        <div className="py-2">
          <p>
            <span className="font-bold">Người dùng:</span>{' '}
            <span>{params.row.customer ? params.row.customer.name : params.row.staff.name}</span>
          </p>
          <p>
            <span className="font-bold">Chức vụ:</span>{' '}
            <span>{params.row.customer ? 'Khách hàng' : 'Nhân viên'}</span>
          </p>
          <p>
            <span className="font-bold">Email:</span> <span>{params.row.email}</span>
          </p>
          <p>
            <span className="font-bold">Phương thức thanh toán:</span>{' '}
            <span>{params.row.paymentMethod}</span>
          </p>
        </div>
      ),
    },
    {
      field: 'posterImage',
      headerName: 'Hình ảnh',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <div className="py-3">
          <ImageComponent
            src={params.row.movie.posterImage}
            alt="Film Image"
            className="h-[180px] w-[150px] object-cover"
            width={150}
            height={180}
          />
        </div>
      ),
    },
    {
      field: 'ticketInfo',
      headerName: 'Thông tin vé',
      flex: 1.4,
      minWidth: 320,
      sortable: false,
      renderCell: (params) => (
        <div className="flex flex-col justify-start gap-2 py-2">
          <h2 className="text-[18px] font-medium text-primary">{params.row?.movie?.title}</h2>
          <p className="font-medium">
            Ngày chiếu: <span className="font-normal">{params.row?.showTime?.showDate}</span>
          </p>
          <p className="font-medium">
            Giờ chiếu: <span className="font-normal">{params.row?.showTime?.startTime}</span>
          </p>
          <p className="font-medium">
            Rạp chiếu: <span className="font-normal">{params.row?.movieTheater?.name}</span>
          </p>
          <p className="font-medium">
            Trạng thái:{' '}
            {params.row.status === 'PAID' && (
              <span className="rounded-lg bg-orange-200 p-1 font-medium text-red-500">
                Chưa xuất vé
              </span>
            )}
            {params.row.status === 'USED' && (
              <span className="rounded-lg bg-green-200 p-1 font-medium text-green-500">
                Đã xuất vé
              </span>
            )}
          </p>
          <p className="font-medium">
            Tổng tiền thanh toán:{' '}
            <span className="font-normal">{currencyFormatter(params.row.totalMoney)}</span>
          </p>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Chức năng',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          color="info"
          onClick={() => handleShowDetail(params.row.code)}
        >
          <IoEyeOutline size={20} className="mr-2" />
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <>
      <CustomBreadcrumb
        className="mb-4"
        linkComponent={''}
        items={[
          {
            label: 'Hóa đơn',
            href: '/admin/invoice',
            icon: <PiInvoiceBold fontSize="small" />,
          },
        ]}
        title={'Quản lý hóa đơn'}
      />
      <div className="bg-white px-6 py-3">
        <div>
          <div className="md: flex flex-col flex-wrap items-center gap-2 md:flex-row md:justify-between">
            <div className="grid gap-2 md:grid-cols-2">
              <form className="flex items-center gap-2" onSubmit={handleFindByDate}>
                <TextField
                  onChange={handleFindByDate}
                  name="createdAt"
                  type="date"
                  defaultValue={activeDate}
                  size="small"
                  fullWidth
                />
                <Button
                  variant="outlined"
                  size="medium"
                  type="submit"
                  color="warning"
                  className="w-[150px]"
                >
                  Làm mới
                </Button>
              </form>
              <form className="flex items-center gap-2" onSubmit={handleFindByQRCode}>
                <TextField
                  name="qrCode"
                  label="Nhập mã QRCode"
                  type="text"
                  size="small"
                  defaultValue={query?.qrCode}
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


          <DataGridTable
            rows={rows}
            columns={columns}
            loading={isLoading}
            minWidth={1500}
            hideFooter={Boolean(query?.qrCode)}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            paginationMode="server"
            rowCount={Boolean(query?.qrCode) ? rows.length : meta.totalElements || 0}
            getRowId={(row) => row.id ?? row.code}
            loadingContent="Đang tải danh sách hóa đơn..."
            emptyContent="Danh sách hóa đơn trống"
          />
        </div>
      </div>
    </>
  );
};
export default InvoiceIndex;

