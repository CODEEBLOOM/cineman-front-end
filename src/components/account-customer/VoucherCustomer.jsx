const VoucherCustomer = () => {
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
            <th className="w-[220px]">Nội dung</th>
            <th className="w-[150px]">Mã giảm giá</th>
            <th className="w-[100px]">Ngày bắt đầu</th>
            <th className="w-[100px]">Ngày kết thúc</th>
            <th className="w-[50px]">Phần trăm</th>
            <th className="w-[150px]">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>VOUCHER123</td>
            <td>Giảm giá 20%</td>
            <td>Giảm giá cho tất cả các vé xem phim</td>
            <td>VOUCHER20</td>
            <td>01/01/2023</td>
            <td>31/12/2023</td>
            <td>20%</td>
            <td>
              <p className="rounded-lg bg-green-400 p-1 text-center text-white">
                Chưa dùng
              </p>
            </td>
          </tr>
          <tr>
            <td>VOUCHER123</td>
            <td>Giảm giá 20%</td>
            <td>Giảm giá cho tất cả các vé xem phim</td>
            <td>VOUCHER20</td>
            <td>01/01/2023</td>
            <td>31/12/2023</td>
            <td>20%</td>
            <td>
              <p className="rounded-lg bg-red-400 p-1 text-center text-white">
                Đã dùng
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default VoucherCustomer;
