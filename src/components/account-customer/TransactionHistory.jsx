import { findAllByUserId } from '@apis/invoiceService';
import ImageComponent from '@component/ImageComponent';
import Loading from '@component/Loading';
import { currencyFormatter } from '@libs/Utils';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
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
  }, []);

  return (
    <div>
      <h1 className="mb-3 text-[18px] font-medium uppercase text-primary underline">
        Danh sách lịch sử giao dịch
      </h1>
      <table>
        <thead>
          <tr>
            <th className="w-[50px]">Mã đặt vé</th>
            <th className="w-[100px]">Hình ảnh</th>
            <th className="w-[200px]">Thông tin vé</th>
            <th className="w-[150px]">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={4} className="text-center">
                <Loading />
              </td>
            </tr>
          )}
          {invoices.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center text-orange-400">
                Lịch sử giao dịch trống
              </td>
            </tr>
          )}
          {invoices &&
            invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td className="h-[140px] w-[50px] p-2">
                  <div>
                    <ImageComponent
                      src={invoice.movie.posterImage}
                      alt="Film Image"
                      className="h-[260px] w-[170px] object-cover"
                      width={170}
                      height={260}
                    />
                  </div>
                </td>
                <td>
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
                <td>
                  <div className="flex flex-col gap-2">
                    <Button variant="outlined" color="primary" className="mb-2">
                      Xem chi tiết
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className="mb-2"
                    >
                      Đánh giá
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default TransactionHistory;
