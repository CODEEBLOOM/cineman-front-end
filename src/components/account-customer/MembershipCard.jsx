import { findAllMembershipRanks } from '@apis/membershipRankService';
import { findAllUserPointHistory } from '@apis/userPointHistoryService';
import { formatNumber } from '@libs/Utils';
import DateFormatter from '@utils/DateFormatter';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const MembershipCard = () => {
  const { user } = useSelector((state) => state.user);
  const [historyPoints, setHistoryPoints] = useState([]);
  const [membershipRanks, setMembershipRanks] = useState([]);

  const totalPoint = historyPoints
    .map((point) => (point.changePoint > 0 ? point.changePoint : 0))
    .reduce((a, b) => a + b, 0);

  const usedPoint = historyPoints
    .map((point) => (point.changePoint < 0 ? Math.abs(point.changePoint) : 0))
    .reduce((a, b) => a + b, 0);

  /**
   * Lấy toàn bộ lịch sử điểm của người dùng
   */
  useEffect(() => {
    /* Lấy toàn bộ membership rank */
    findAllMembershipRanks()
      .then((res) => {
        if (res && res.data) {
          setMembershipRanks(res.data);
        }
      })
      .catch((err) => console.log(err));

    /* Lấy toàn bộ lịch sử giao dịch điểm */
    findAllUserPointHistory(user.userId)
      .then((res) => {
        if (res && res.data) {
          setHistoryPoints(res.data);
        }
      })
      .catch((err) => console.log(err));
  }, [user.userId]);

  return (
    <div>
      <h1 className="mb-3 text-[18px] font-bold uppercase text-primary underline">
        Thẻ thành viên
      </h1>
      <p className="mb-2 border-b-2 pb-2 text-primary">
        Cấp độ thẻ hiện tại của bạn:{' '}
        <span className="uppercase text-pink-500">
          {user?.membershipRank?.name}
        </span>
      </p>
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="font-bold text-primary">Thông tin cấp độ thẻ</h2>
          {membershipRanks.map((membershipRank) => (
            <div className="flex gap-3" key={membershipRank?.id}>
              <p className="min-w-[150px]">{membershipRank?.name}</p>
              <div className="grid grid-cols-2">
                <p className="w-[100px] font-bold text-pink-500">
                  {formatNumber(membershipRank.requiredPoint)}
                </p>
                <span>Điểm</span>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="font-bold text-primary">Thông tin tích lũy điểm</h2>
          <div className="flex gap-3">
            <p className="min-w-[150px]">Điểm đã tích lũy</p>
            <div className="grid grid-cols-2">
              <p className="w-[100px] font-bold text-pink-500">
                {formatNumber(totalPoint)}
              </p>
              <p>Điểm</p>
            </div>
          </div>
          <div className="flex gap-3">
            <p className="min-w-[150px]">Điểm đã sử dụng:</p>
            <div className="grid grid-cols-2">
              <p className="w-[100px] font-bold text-pink-500">
                {formatNumber(usedPoint)}
              </p>
              <p>Điểm</p>
            </div>
          </div>
          <div className="flex gap-3">
            <p className="min-w-[150px]">Điểm đã còn lại:</p>
            <div className="grid grid-cols-2">
              <p className="w-[100px] font-bold text-pink-500">
                {formatNumber(totalPoint - usedPoint)}
              </p>
              <p>Điểm</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <h2 className="mb-4 border-b-2 font-bold text-primary">Lịch sử điểm</h2>
        <table>
          <thead>
            <tr>
              <th className="w-[150px] font-bold text-primary">Thời gian</th>
              <th className="w-[150px] text-center font-bold text-primary">
                Điểm thay đổi
              </th>
              <th className="w-[150px] font-bold text-primary">
                Nội dung sử dụng
              </th>
            </tr>
          </thead>
          <tbody>
            {historyPoints.map((item, index) => (
              <tr key={index}>
                <td>
                  {new DateFormatter(item.createdAt).format(
                    'HH:mm:ss - DD/MM/YYYY'
                  )}
                </td>
                <td
                  className={`text-center font-bold ${item.changePoint < 0 ? 'text-red-500' : 'text-green-500'}`}
                >
                  {item.changePoint}
                </td>
                <td>{item.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default MembershipCard;
