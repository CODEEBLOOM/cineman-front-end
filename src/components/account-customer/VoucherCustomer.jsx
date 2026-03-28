import { findAllPromotions } from '@apis/promotionService';
import DataGridTable from '@component/DataGridTable';
import Loading from '@component/Loading';
import { useEffect, useMemo, useState } from 'react';
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
        setPromotions(res.data);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  }, [user.userId]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success('Sao chép mã: ' + code + ' Thành công');
    });
  };

  const rows = useMemo(
    () => promotions.map((promotion, index) => ({ ...promotion, gridIndex: index + 1 })),
    [promotions]
  );

  const columns = [
    { field: 'id', headerName: 'Mã giảm giá', width: 140 },
    { field: 'name', headerName: 'Tên giảm giá', width: 220 },
    {
      field: 'code',
      headerName: 'Mã sử dụng',
      width: 200,
      renderCell: (params) => (
        <button
          type="button"
          className="flex items-center gap-2 text-orange-400"
          onClick={() => handleCopy(params.value)}
        >
          <span>{params.value}</span>
          <FaRegCopy size={18} className="text-blue-600" />
        </button>
      ),
    },
    { field: 'startDate', headerName: 'Ngày bắt đầu', width: 140 },
    { field: 'endDate', headerName: 'Ngày kết thúc', width: 140 },
    { field: 'discount', headerName: 'Phần trăm', width: 120 },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
      renderCell: (params) =>
        params.value === 'ACTIVE' ? (
          <p className="rounded-lg bg-green-400 px-3 py-1 text-center text-white">Chưa dùng</p>
        ) : (
          <p className="rounded-lg bg-red-400 px-3 py-1 text-center text-white">Đã sử dụng</p>
        ),
    },
    {
      field: 'content',
      headerName: 'Nội dung',
      flex: 1,
      minWidth: 260,
    },
  ];

  return (
    <div>
      <h1 className="mb-3 text-[18px] font-medium uppercase text-primary underline">
        Danh sách voucher của tôi
      </h1>
      {isLoading ? (
        <Loading />
      ) : (
        <DataGridTable
          rows={rows}
          columns={columns}
          hideFooter
          minWidth={1260}
          getRowId={(row) => row.id}
          emptyContent="Bạn chưa có voucher nào"
        />
      )}
    </div>
  );
};
export default VoucherCustomer;
