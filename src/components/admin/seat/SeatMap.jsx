import { getSeatMap } from '@apis/cinemaTheaterService';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import { RiSofaFill } from 'react-icons/ri';
import SeatGrid from './SeatGrid';

const SeatMap = () => {
  const [seats, setSeats] = useState([]);
  const [cinemaTheater, setCinemaTheater] = useState({});
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    getSeatMap(id).then((res) => {
      const { seats, ...restData } = res.data;
      setSeats(seats);
      setCinemaTheater(restData);
    });
  }, [id, setSeats]);

  return (
    <div className="grid gap-4 p-10 lg:grid-cols-12">
      <div className="col-span-12 rounded-md bg-white p-5 lg:col-span-9">
        <div className="border-b-2 pb-2">
          <p className="text-[18px] font-medium">Sơ đồ ghế</p>
        </div>
        <div className="mx-auto mt-5 max-w-[800px] overflow-x-auto border-2">
          <SeatGrid seats={seats} cinemaTheater={cinemaTheater} />
        </div>
      </div>
      <div className="col-span-12 flex flex-col space-y-6 lg:col-span-3">
        <div className="flex flex-col space-y-5 rounded-md bg-white p-5">
          <div className="border-b-2 pb-2">
            <p className="text-[18px] font-medium">Cập nhật</p>
          </div>
          <p>
            <span className="font-medium">Trạng thái: </span>Nháp
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="outlined" color="info">
              Quay lại
            </Button>
            <Button variant="contained" color="primary">
              Xuất bản
            </Button>
          </div>
        </div>
        <div className="flex flex-col space-y-5 rounded-md bg-white p-5">
          <div className="border-b-2 pb-2">
            <p className="text-[18px] font-medium">Chú thích theo loại ghế</p>
          </div>
          <div className="flex items-center justify-between">
            <p>Ghế thường</p>
            <EventSeatIcon className="text-gray-600" fontSize="large" />
          </div>
          <div className="flex items-center justify-between">
            <p>Ghế VIP</p>
            <RiSofaFill className="text-gray-600" size={35} />
          </div>
          <div className="flex items-center justify-between">
            <p>Ghế đôi</p>
            <div className="flex">
              <RiSofaFill className="text-gray-600" size={35} />
              <RiSofaFill className="text-gray-600" size={35} />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-5 rounded-md bg-white p-5">
          <div className="border-b-2 pb-2">
            <p className="text-[18px] font-medium">Chú thích theo bảng màu</p>
          </div>
          <div className="flex items-center justify-between">
            <p>Ghế thường</p>
            <div className="h-[35px] w-[35px] bg-orange-200"></div>
          </div>
          <div className="flex items-center justify-between">
            <p>Ghế VIP</p>
            <div className="h-[35px] w-[35px] bg-gray-300"></div>
          </div>
          <div className="flex items-center justify-between">
            <p>Ghế đôi</p>
            <div className="h-[35px] w-[35px] bg-red-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SeatMap;
