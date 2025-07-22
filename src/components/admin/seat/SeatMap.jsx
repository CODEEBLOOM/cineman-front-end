import { getSeatMap, published } from '@apis/cinemaTheaterService';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import SeatGrid from './SeatGrid';
import { RxCross1 } from 'react-icons/rx';
import { useModelContext } from '@context/ModalContext';
import { IoWarningOutline } from 'react-icons/io5';
import RegularSeat from '@component/seat/RegularSeat';
import VIPSeat from '@component/seat/VIPSeat';
import DoubleSeat from '@component/seat/DoubleSeat';

const SeatMap = () => {
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [cinemaTheater, setCinemaTheater] = useState({});
  const { openPopup, setIsShowing } = useModelContext();
  const { id } = useParams();
  const fetchSeatMap = () => {
    getSeatMap(id)
      .then((res) => {
        const { seats, ...restData } = res.data;
        setSeats(seats);
        setCinemaTheater(restData);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchSeatMap();
  }, []);

  const handlePublishedCinemaTheater = () => {
    published(id)
      .then(() => {
        fetchSeatMap();
      })
      .catch((error) => console.log(error))
      .finally(() => setIsShowing(false));
  };

  const renderPopupConfirm = () => {
    return (
      <div className="rounded-md bg-white p-5">
        <div className="bg w-56 text-center">
          <IoWarningOutline size={56} className="mx-auto" color="orange" />
          <div className="mx-auto my-4 w-48">
            <h3 className="text-lg font-black capitalize text-gray-800">
              Xác nhận xuất bản
            </h3>
            <p className="text-gray-500">
              Khi xuất bản bạn sẽ không thể điều chỉnh sơ đồ ghế !
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="contained"
              className="w-full"
              color="warning"
              onClick={handlePublishedCinemaTheater}
            >
              Xác nhận
            </Button>
            <Button
              variant="outlined"
              className="w-full"
              color="info"
              onClick={() => setIsShowing(false)}
            >
              Hủy bỏ
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid gap-4 p-10 lg:grid-cols-12">
      <div className="col-span-12 rounded-md bg-white p-5 lg:col-span-9">
        <div className="border-b-2 pb-2">
          <p className="text-[18px] font-medium">Sơ đồ ghế</p>
        </div>
        <div className="mx-auto mt-5 max-w-[800px] overflow-x-auto">
          <SeatGrid
            seats={seats}
            cinemaTheater={cinemaTheater}
            fetchSeatMap={fetchSeatMap}
          />
        </div>
      </div>
      <div className="col-span-12 flex flex-col space-y-6 lg:col-span-3">
        <div className="flex flex-col space-y-5 rounded-md bg-white p-5">
          <div className="border-b-2 pb-2">
            <p className="text-[18px] font-medium">Cập nhật</p>
          </div>
          <p>
            <span className="font-medium">Trạng thái: </span>
            <span
              className={`rounded-md bg-orange-200 ${cinemaTheater?.status === 'PUBLISHED' && '!bg-green-200'} p-2 font-medium shadow-md`}
            >
              {cinemaTheater?.status}
            </span>
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant="outlined"
              color="info"
              onClick={() => navigate('/admin/phong-chieu')}
            >
              Quay lại
            </Button>
            {cinemaTheater?.status !== 'PUBLISHED' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => openPopup(renderPopupConfirm())}
              >
                Xuất bản
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-5 rounded-md bg-white p-5">
          <div className="border-b-2 pb-2">
            <p className="text-[18px] font-medium">Chú thích theo loại ghế</p>
          </div>
          <div className="flex items-center justify-between">
            <p>Ghế thường</p>
            <RegularSeat />
          </div>
          <div className="flex items-center justify-between">
            <p>Ghế VIP</p>
            <VIPSeat />
          </div>
          <div className="flex items-center justify-between">
            <p>Ghế đôi</p>
            <div className="flex">
              <DoubleSeat />
            </div>
          </div>
        </div>
        {cinemaTheater.status !== 'PUBLISHED' && (
          <div className="flex flex-col space-y-5 rounded-md bg-white p-5">
            <div className="border-b-2 pb-2">
              <p className="text-[18px] font-medium">Chú thích theo bảng màu</p>
            </div>
            <div className="flex items-center justify-between">
              <p>Ghế thường</p>
              <div className="h-[35px] w-[35px] border bg-[#fbf5e7] shadow-md"></div>
            </div>
            <div className="flex items-center justify-between">
              <p>Ghế VIP</p>
              <div className="h-[35px] w-[35px] border bg-[#fbfdfc] shadow-md"></div>
            </div>
            <div className="flex items-center justify-between">
              <p>Ghế đôi</p>
              <div className="h-[35px] w-[35px] border bg-red-200 shadow-md"></div>
            </div>
          </div>
        )}
        {/* Trạng thái ghế */}
        {cinemaTheater.status === 'PUBLISHED' && (
          <div className="flex flex-col space-y-5 rounded-md bg-white p-5">
            <div className="border-b-2 pb-2">
              <p className="text-[18px] font-medium">
                Chú thích trạng thái ghế
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p>Hoạt động ( Active )</p>
              <DoubleSeat />
            </div>
            <div className="flex items-center justify-between">
              <p>Ngưng hoạt động (Inactive)</p>
              <div className="relative">
                <div className="flex">
                  <DoubleSeat />
                </div>
                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                  <RxCross1 size={35} color="red" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default SeatMap;
