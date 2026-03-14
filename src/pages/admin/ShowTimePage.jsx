import { findAll } from '@apis/showTimeService';
import PopupShowTime from '@component/admin/showtimes/PopupShowTime';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteSweep } from 'react-icons/md';

const ShowTimePage = () => {
  const { openPopup } = useModelContext();
  const [showTimes, setShowTimes] = useState([]);

  useEffect(() => {
    document.title = 'Quản lý suất chiếu - POLY CINEMAS';
  }, []);

  useEffect(() => {
    findAll()
      .then((res) => {
        console.log(res);
        setShowTimes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleOpenPopup = (showTime, movieId, movieTheaterId) => {
    openPopup(
      <PopupShowTime
        showTime={showTime}
        movieId={movieId}
        variantId={movieTheaterId}
        movieTheaterId={movieTheaterId}
      />
    );
  };

  return (
    <>
      <CustomBreadcrumb
        className="mb-2"
        linkComponent={''}
        items={[
          {
            label: 'Quản lý suất chiếu',
          },
        ]}
        title={'Quản lý suất chiếu'}
      />
      <div className="px-2 py-3">
        <div className="border-slate-200 bg-white p-2">
          <div className="mb-2 border-b-2">
            <div className="my-2 flex items-end justify-between">
              <h1 className="font-semibold">Danh sách suất chiếu</h1>
              <Button
                variant="contained"
                color="info"
                type="submit"
                size="medium"
                onClick={handleOpenPopup}
              >
                Tạo mới
              </Button>
            </div>
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th className="px-2 py-2">STT</th>
                  <th className="px-2 py-2">Phim</th>
                  <th className="px-2 py-2">Ngày chiếu</th>
                  <th className="px-2 py-2">Giờ chiếu</th>
                  <th className="px-2 py-2">Biến thể</th>
                  <th className="px-2 py-2">Trạng thái</th>
                  <th className="px-2 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {showTimes.length > 0 &&
                  showTimes.map((showTime, index) => (
                    <tr key={showTime.showTime.id}>
                      {console.log(showTime)}
                      <td>{index + 1}</td>
                      <td>{showTime.movie.title}</td>
                      <td>{showTime.cinemaTheater.name}</td>
                      <td>{showTime.showTime.showDate}</td>
                      <td>{showTime.movieVariation.name}</td>
                      <td>
                        <p
                          className={`${showTime.showTime.status === 'VALID' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'} inline-block rounded-full px-2 py-1 text-xs font-semibold`}
                        >
                          {showTime.showTime.status === 'VALID'
                            ? 'Công chiếu'
                            : ' Chưa công chiếu'}
                        </p>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            className="mr-2"
                            onClick={() =>
                              handleOpenPopup(
                                showTime,
                                showTime.movie.movieId,
                                showTime.cinemaTheater.cinemaTheaterId
                              )
                            }
                          >
                            <CiEdit size={25} fill="#FFC107" />
                          </button>
                          <button className="mr-2">
                            <MdDeleteSweep size={25} fill="red" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
export default ShowTimePage;
