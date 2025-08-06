const MembershipCard = () => {
  return (
    <div>
      <h1 className="mb-3 text-[18px] font-medium uppercase text-primary underline">
        Thẻ thành viên
      </h1>
      <p className="mb-2 border-b-2 pb-2 font-bold text-primary">
        Cấp độ thẻ: <span className="uppercase text-pink-500">VIP</span>
      </p>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-medium text-primary">Thông tin cấp độ thẻ</h2>
          <div className="flex gap-3">
            <p className="min-w-[150px]">Member</p>
            <p className="font-bold text-pink-500">0</p>
            <span>Điểm</span>
          </div>
          <div className="flex gap-3">
            <p className="min-w-[150px]">Gold:</p>
            <p className="font-bold text-pink-500">0</p> <span>Điểm</span>
          </div>
          <div className="flex gap-3">
            <p className="min-w-[150px]">Platinum:</p>
            <p className="font-bold text-pink-500">0</p> <span>Điểm</span>
          </div>
          <div className="flex gap-3">
            <p className="min-w-[150px]">Diamond:</p>
            <p className="font-bold text-pink-500">0</p> <span>Điểm</span>
          </div>
        </div>
        <div>
          <h2 className="font-medium text-primary">Thông tin tích lũy điểm</h2>
          <div className="flex gap-3">
            <p className="min-w-[150px]">Điểm đã tích lũy</p>
            <p className="font-bold text-pink-500">0</p>
          </div>
          <div className="flex gap-3">
            <p className="min-w-[150px]">Điểm đã sử dụng:</p>
            <p className="font-bold text-pink-500">0</p>
          </div>
          <div className="flex gap-3">
            <p className="min-w-[150px]">Điểm đã còn lại:</p>
            <p className="font-bold text-pink-500">0</p>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <h2 className="mb-4 border-b-2 font-medium text-primary">
          Lịch sử điểm
        </h2>
        <table>
          <thead>
            <tr>
              <th className="w-[150px] text-primary">Thời gian</th>
              <th className="w-[150px] text-primary">Điểm thay đổi</th>
              <th className="w-[150px] text-primary">Nội dung sử dụng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>01/01/2023</td>
              <td>+100</td>
              <td>Đăng ký thành viên</td>
            </tr>
            <tr>
              <td>01/01/2023</td>
              <td>+100</td>
              <td>Đăng ký thành viên</td>
            </tr>
            <tr>
              <td>01/01/2023</td>
              <td>+100</td>
              <td>Đăng ký thành viên</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default MembershipCard;
