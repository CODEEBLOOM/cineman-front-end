import { useEffect, useState } from 'react';
import './seatMapComponent.scss';
import { findAll } from '@apis/cinemaTheaterService';
import { update } from '@apis/cinemaTheaterService.js';
import CinemaTheaterTable from './CinemaTheaterTable';

import CreateCinemaTheater from './CreateCinemaTheater';

const CinemaTheater = () => {
  const [tab, setTab] = useState(0);
  const [cinemaTheaters, setCinemaTheaters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  /* Get data */
  const fetchCinemaTheaters = async ({ page, size, status = null }) => {
    const res = await findAll({
      page,
      size,
      status,
    });
    setCinemaTheaters(res?.data?.cinemaTheaters);
    setTotalCount(res.data?.meta?.totalElements);
    setPaginationModel({
      page: res.data?.meta?.currentPage,
      pageSize: res.data?.meta.pageSize,
    });
  };

  useEffect(() => {
    fetchCinemaTheaters({
      page: paginationModel.page,
      size: paginationModel.pageSize,
    });
  }, []);

  const handleChangeStatus = async (event, value) => {
    const status = event.target.checked;
    const tabActive = tab < 1 ? null : tab === 1;
    const updateCinemaTheater = { ...value, status };
    await update({ id: value.id, data: updateCinemaTheater });
    await fetchCinemaTheaters({
      page: paginationModel.page,
      size: paginationModel.pageSize,
      status: tabActive,
    });
  };

  return (
    <>
      <div className={'flex items-center justify-between bg-white px-5 py-2'}>
        <h2 className="font-medium uppercase">Quản lý phòng chiếu</h2>
      </div>
      <div className="p-10">
        <div className="rounded-md bg-white p-5">
          <CreateCinemaTheater fetchCinemaTheaters={fetchCinemaTheaters} />
          {/*  Phần chính */}
          <CinemaTheaterTable
            tab={tab}
            setTab={setTab}
            fetchCinemaTheaters={fetchCinemaTheaters}
            paginationModel={paginationModel}
            handleChangeStatus={handleChangeStatus}
            cinemaTheaters={cinemaTheaters}
            totalCount={totalCount}
          />
        </div>
      </div>
    </>
  );
};

export default CinemaTheater;
