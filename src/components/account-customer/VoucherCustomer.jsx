import { findAllPromotions } from '@apis/promotionService';
import Loading from '@component/Loading';
import { useEffect, useState } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const VoucherCustomer = () => {
  const { user } = useSelector((state) => state.user);
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Danh sách voucher - POLY CINEMAS';
    setIsLoading(true);
    findAllPromotions(user.userId)
      .then((res) => {
        console.log(res);
        setPromotions(res.data);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, []);

  // Hàm xử lý copy mã //
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success('Sao chép mã: ' + code + ' Thành công'); // Bạn có thể thay bằng toast
    });
  };

  return (
    <div>
      <h1 className="mb-3 text-[18px] font-medium uppercase text-primary underline">
        Danh sách voucher của tôi
      </h1>
      <table>
        <thead>
          <tr>
            <th className="w-[50px]">Mã giảm giá</th>
            <th className="w-[100px]">Tên giảm giá</th>
            <th className="w-[150px]">Mã giảm giá</th>
            <th className="w-[100px]">Ngày bắt đầu</th>
            <th className="w-[100px]">Ngày kết thúc</th>
            <th className="w-[50px]">Phần trăm</th>
            <th className="w-[150px]">Trạng thái</th>
            <th className="w-[220px]">Nội dung</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={8} className="text-center">
              {isLoading && <Loading />}
            </td>
          </tr>
          {promotions.map((promotion) => (
            <tr key={promotion.id} className="select-none">
              <td>{promotion.id}</td>
              <td>{promotion.name}</td>
              <td
                className="relative cursor-pointer px-4 py-2 text-orange-400"
                onClick={() => handleCopy(promotion.code)}
              >
                <span className="mr-3">{promotion.code}</span>

                <span className="absolute right-1 top-1 translate-y-1/2 text-sm text-blue-600 underline">
                  <FaRegCopy size={20} />
                </span>
              </td>
              <td>{promotion.startDate}</td>
              <td>{promotion.endDate}</td>
              <td>{promotion.discount}</td>
              <td>
                {promotion.status === 'ACTIVE' && (
                  <p className="rounded-lg bg-green-400 p-1 text-center text-white">
                    Chưa dùng
                  </p>
                )}
                {promotion.status === 'USED' && (
                  <p className="rounded-lg bg-red-400 p-1 text-center text-white">
                    Đã sử dụng
                  </p>
                )}
              </td>
              <td>{promotion.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default VoucherCustomer;
