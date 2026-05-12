import { useCallback, useEffect, useState } from 'react';
import {
  extractCinemaTheaterList,
  extractCinemaTheaterMeta,
  findAll,
} from '@apis/cinemaTheaterService';
import CreateCinemaTheater from './CreateCinemaTheater';
import CinemaTheaterTable from './CinemaTheaterTable';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import './seatMapComponent.scss';
import { toast } from 'sonner';

const defaultPaginationModel = {
  page: 0,
  pageSize: 5,
};

const CinemaTheater = () => {
  const [tab, setTab] = useState(0);
  const [cinemaTheaters, setCinemaTheaters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState(defaultPaginationModel);

  const fetchCinemaTheaters = useCallback(async ({ page, size, status = null }) => {
    setIsLoading(true);

    try {
      const response = await findAll({ page, size, status });
      const items = extractCinemaTheaterList(response);
      const meta = extractCinemaTheaterMeta(response);

      setCinemaTheaters(items);
      setTotalCount(meta?.totalElements ?? items.length);
      setPaginationModel({
        page: meta?.currentPage ?? page ?? defaultPaginationModel.page,
        pageSize: meta?.pageSize ?? size ?? defaultPaginationModel.pageSize,
      });
    } catch {
      toast.error('Không thể tải danh sách phòng chiếu!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý phòng chiếu - POLY CINEMAS';
    fetchCinemaTheaters({
      page: defaultPaginationModel.page,
      size: defaultPaginationModel.pageSize,
      status: null,
    });
  }, [fetchCinemaTheaters]);

  return (
    <>
      <CustomBreadcrumb items={[{ label: 'Quản lý phòng chiếu' }]} title="Quản lý phòng chiếu" />

      <div className="px-2">
        <div className="rounded-md bg-white p-5">
          <CreateCinemaTheater fetchCinemaTheaters={fetchCinemaTheaters} />
          <CinemaTheaterTable
            tab={tab}
            setTab={setTab}
            isLoading={isLoading}
            fetchCinemaTheaters={fetchCinemaTheaters}
            paginationModel={paginationModel}
            cinemaTheaters={cinemaTheaters}
            totalCount={totalCount}
          />
        </div>
      </div>
    </>
  );
};

export default CinemaTheater;