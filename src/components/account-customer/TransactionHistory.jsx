import { findAllByUserId } from '@apis/invoiceService';
import DataGridTable from '@component/DataGridTable';
import ImageComponent from '@component/ImageComponent';
import Loading from '@component/Loading';
import { currencyFormatter } from '@libs/Utils';
import { Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const TransactionHistory = () => {
  const { user } = useSelector((state) => state.user);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    document.title = 'Lịch sử giao dịch - POLY CINEMAS';
    findAllByUserId(user.userId)
      .then((res) => {
        setInvoices(res.data);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, [user.userId]);

  const rows = useMemo(
    () => invoices.map((invoice, index) => ({ ...invoice, gridIndex: index + 1 })),
    [invoices]
  );

  const columns = [
    { field: 'id', headerName: 'Mã đặt vé', width: 140 },
    {
      field: 'posterImage',
      headerName: 'Hình ảnh',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <div className="py-3">
          <ImageComponent
            src={params.row.movie.posterImage}
            alt="Film Image"
            className="h-[260px] w-[170px] object-cover"
            width={170}
            height={260}
          />
        </div>
      ),
    },
    {
      field: 'ticketInfo',
      headerName: 'Thông tin vé',
      flex: 1.3,
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
      headerName: 'Thao tác',
      width: 180,
      sortable: false,
      renderCell: () => (
        <div className="flex flex-col gap-2 py-2">
          <Button variant="outlined" color="primary" className="mb-2">
            Xem chi tiết
          </Button>
          <Button variant="contained" color="primary" className="mb-2">
            Đánh giá
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="mb-3 text-[18px] font-medium uppercase text-primary underline">
        Danh sách lịch sử giao dịch
      </h1>
      {isLoading ? (
        <Loading />
      ) : (
        <DataGridTable
          rows={rows}
          columns={columns}
          hideFooter
          minWidth={980}
          getRowId={(row) => row.id}
          emptyContent="Lịch sử giao dịch trống"
        />
      )}
    </div>
  );
};
export default TransactionHistory;
