import ImageComponent from '@component/ImageComponent';
import { currencyFormatter } from '@libs/Utils';
import { Button } from '@mui/material';

const TransactionHistory = () => {
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
          <tr>
            <td>04436639453</td>
            <td className="h-[140px] w-[50px] p-2">
              <div>
                <ImageComponent
                  src="https://upload.wikimedia.org/wikipedia/vi/thumb/d/d4/%C3%81p_ph%C3%ADch_ch%C3%ADnh_th%E1%BB%A9c_L%E1%BA%ADt_m%E1%BA%B7t_7.jpg/375px-%C3%81p_ph%C3%ADch_ch%C3%ADnh_th%E1%BB%A9c_L%E1%BA%ADt_m%E1%BA%B7t_7.jpg"
                  alt="Film Image"
                  className="h-full w-full object-cover"
                  width={50}
                  height={140}
                />
              </div>
            </td>
            <td>
              <div className="flex flex-col justify-start gap-2">
                <h2 className="text-[18px] font-medium text-primary">
                  Thiên đường một điều ước
                </h2>
                <p className="font-medium">
                  Ngày chiếu: <span className="font-normal">01/01/2023</span>
                </p>
                <p className="font-medium">
                  Giờ chiếu: <span className="font-normal">10:00</span>
                </p>
                <p className="font-medium">
                  Rạp chiếu:{' '}
                  <span className="font-normal">Poly Cinemas Quang Trung</span>
                </p>
                <p className="font-medium">
                  Trạng thái:{' '}
                  <span className="rounded-lg bg-orange-200 p-1 font-medium text-red-500">
                    Chưa xuất
                  </span>
                </p>
                <p className="font-medium">
                  Tổng tiền thanh toán:{' '}
                  <span className="font-normal">
                    {currencyFormatter(1000000)}
                  </span>
                </p>
              </div>
            </td>
            <td>
              <div className="flex flex-col gap-2">
                <Button variant="outlined" color="primary" className="mb-2">
                  Xem chi tiết
                </Button>
                <Button variant="contained" color="primary" className="mb-2">
                  Đánh giá
                </Button>
              </div>
            </td>
          </tr>
          <tr>
            <td>04436639453</td>
            <td className="h-[140px] w-[50px] p-2">
              <div>
                <ImageComponent
                  src="https://upload.wikimedia.org/wikipedia/vi/thumb/d/d4/%C3%81p_ph%C3%ADch_ch%C3%ADnh_th%E1%BB%A9c_L%E1%BA%ADt_m%E1%BA%B7t_7.jpg/375px-%C3%81p_ph%C3%ADch_ch%C3%ADnh_th%E1%BB%A9c_L%E1%BA%ADt_m%E1%BA%B7t_7.jpg"
                  alt="Film Image"
                  className="h-full w-full object-cover"
                  width={50}
                  height={140}
                />
              </div>
            </td>
            <td>
              <div className="flex flex-col justify-start gap-2">
                <h2 className="text-[18px] font-medium text-primary">
                  Thiên đường một điều ước
                </h2>
                <p className="font-medium">
                  Ngày chiếu: <span className="font-normal">01/01/2023</span>
                </p>
                <p className="font-medium">
                  Giờ chiếu: <span className="font-normal">10:00</span>
                </p>
                <p className="font-medium">
                  Rạp chiếu:{' '}
                  <span className="font-normal">Poly Cinemas Quang Trung</span>
                </p>
                <p className="font-medium">
                  Trạng thái:{' '}
                  <span className="rounded-lg bg-orange-200 p-1 font-medium text-red-500">
                    Chưa xuất
                  </span>
                </p>
                <p className="font-medium">
                  Tổng tiền thanh toán:{' '}
                  <span className="font-normal">
                    {currencyFormatter(1000000)}
                  </span>
                </p>
              </div>
            </td>
            <td>
              <div className="flex flex-col gap-2">
                <Button variant="outlined" color="primary" className="mb-2">
                  Xem chi tiết
                </Button>
                <Button variant="contained" color="primary" className="mb-2">
                  Đánh giá
                </Button>
              </div>
            </td>
          </tr>
          <tr>
            <td>04436639453</td>
            <td className="h-[140px] w-[50px] p-2">
              <div>
                <ImageComponent
                  src="https://upload.wikimedia.org/wikipedia/vi/thumb/d/d4/%C3%81p_ph%C3%ADch_ch%C3%ADnh_th%E1%BB%A9c_L%E1%BA%ADt_m%E1%BA%B7t_7.jpg/375px-%C3%81p_ph%C3%ADch_ch%C3%ADnh_th%E1%BB%A9c_L%E1%BA%ADt_m%E1%BA%B7t_7.jpg"
                  alt="Film Image"
                  className="h-full w-full object-cover"
                  width={50}
                  height={140}
                />
              </div>
            </td>
            <td>
              <div className="flex flex-col justify-start gap-2">
                <h2 className="text-[18px] font-medium text-primary">
                  Thiên đường một điều ước
                </h2>
                <p className="font-medium">
                  Ngày chiếu: <span className="font-normal">01/01/2023</span>
                </p>
                <p className="font-medium">
                  Giờ chiếu: <span className="font-normal">10:00</span>
                </p>
                <p className="font-medium">
                  Rạp chiếu:{' '}
                  <span className="font-normal">Poly Cinemas Quang Trung</span>
                </p>
                <p className="font-medium">
                  Trạng thái:{' '}
                  <span className="rounded-lg bg-orange-200 p-1 font-medium text-red-500">
                    Chưa xuất
                  </span>
                </p>
                <p className="font-medium">
                  Tổng tiền thanh toán:{' '}
                  <span className="font-normal">
                    {currencyFormatter(1000000)}
                  </span>
                </p>
              </div>
            </td>
            <td>
              <div className="flex flex-col gap-2">
                <Button variant="outlined" color="primary" className="mb-2">
                  Xem chi tiết
                </Button>
                <Button variant="contained" color="primary" className="mb-2">
                  Đánh giá
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default TransactionHistory;
