import { getShowTimeDetail } from '@apis/showTimeService';
import CustomButton from '@component/CustomButton.jsx';
import DataGridTable from '@component/DataGridTable';
import EmptyList from '@component/cinema_showtime/EmptyList';
import Loading from '@component/Loading';
import { useModelContext } from '@context/ModalContext.jsx';
import { useEffect, useMemo, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const groupShowtimesByTheater = (list = []) => {
  return list.reduce((accumulator, item) => {
    const cinemaTheaterId =
      item?.cinemaTheater?.cinemaTheaterId ?? item?.cinemaTheater?.id;

    if (!cinemaTheaterId) {
      return accumulator;
    }

    if (!accumulator[cinemaTheaterId]) {
      accumulator[cinemaTheaterId] = {
        theater: item.cinemaTheater,
        items: [],
      };
    }

    accumulator[cinemaTheaterId].items.push(item);
    return accumulator;
  }, {});
};

const ShowTimeDetail = ({ showTimeSelected, movieId }) => {
  const movieTheater = useSelector(
    (state) => state.movieTheater?.movieTheater ?? { id: null }
  );
  const { openPopup, closeTopModal, resetModal } = useModelContext();
  const [showTimeDetails, setShowTimeDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!showTimeSelected || !movieId || !movieTheater?.id) {
      setShowTimeDetails({});
      return;
    }

    setIsLoading(true);
    getShowTimeDetail({
      movieId,
      movieTheaterId: movieTheater.id,
      showDate: showTimeSelected.showDate,
    })
      .then((res) => {
        const grouped = groupShowtimesByTheater(res?.data || []);

        Object.values(grouped).forEach((group) => {
          group.items.sort((firstItem, secondItem) =>
            String(firstItem?.showTime?.startTime || '').localeCompare(
              String(secondItem?.showTime?.startTime || '')
            )
          );
        });

        setShowTimeDetails(grouped);
      })
      .catch((error) => {
        console.log(error);
        setShowTimeDetails({});
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [movieId, movieTheater?.id, showTimeSelected]);

  const groupedShowTimes = useMemo(() => {
    return Object.values(showTimeDetails || {});
  }, [showTimeDetails]);

  const renderPopup = (showTime) => {
    const rows = [
      {
        id: showTime.showTime.id,
        cinemaTheaterName: showTime.cinemaTheater.name,
        showDate: showTime.showTime.showDate,
        startTime: showTime.showTime.startTime,
      },
    ];

    const columns = [
      { field: 'cinemaTheaterName', headerName: 'Rạp chiếu', flex: 1, minWidth: 180 },
      { field: 'showDate', headerName: 'Ngày chiếu', flex: 1, minWidth: 160 },
      { field: 'startTime', headerName: 'Giờ chiếu', flex: 1, minWidth: 140 },
    ];

    return (
      <div
        data-modal-placement="center"
        className="relative flex aspect-video w-full flex-col justify-between rounded-md bg-white p-5 sm:w-[80vw] md:w-[50vw]"
      >
        <span
          className="absolute right-3 top-3 hover:cursor-pointer"
          onClick={() => closeTopModal()}
        >
          <IoClose size={25} />
        </span>
        <div className="border-b-2 px-4">
          <p className="font-bold uppercase lg:text-[25px]">Bạn đang đặt vé xem phim</p>
        </div>
        <div className="flex-grow border-b-2 px-4 text-center">
          <h1 className="border-b-2 py-6 font-bold uppercase text-primary lg:text-[25px]">
            {showTime.movie.title}
          </h1>
          <DataGridTable rows={rows} columns={columns} hideFooter minWidth={520} />
        </div>
        <div className="mx-auto p-2 px-4" onClick={() => resetModal()}>
          <Link to={`/choose-seat?st=${showTime.showTime.id}`}>
            <div className="min-w-[150px] max-w-[150px]">
              <CustomButton title="Đồng ý" />
            </div>
          </Link>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <Loading content="Đang tải suất chiếu..." />;
  }

  if (groupedShowTimes.length === 0) {
    return <EmptyList content="Ngày này hiện chưa có suất chiếu khả dụng." />;
  }

  return (
    <div className="space-y-5">
      {groupedShowTimes.map((showTimeGroup) => {
        const movieVariationName =
          showTimeGroup.items[0]?.movieVariation?.name ||
          showTimeGroup.items[0]?.movieVariationName ||
          '';

        return (
          <section
            key={showTimeGroup.theater?.cinemaTheaterId ?? showTimeGroup.theater?.id}
            className="border-b border-slate-200 pb-5 last:border-b-0 last:pb-0"
          >
            <div className="mb-3">
              <p className="text-xl font-bold leading-tight text-slate-900 md:text-2xl">
                {`${showTimeGroup.theater?.name || 'Phòng chiếu'}${movieVariationName ? ` - ${movieVariationName}` : ''}`}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {showTimeGroup.items.map((showTimeDetail) => (
                <button
                  type="button"
                  key={showTimeDetail.showTime.id}
                  title={`${showTimeDetail.totalSeatEmpty ?? '--'} ghế trống`}
                  onClick={() => openPopup(renderPopup(showTimeDetail))}
                  className="min-w-[88px] rounded-[16px] border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-slate-900 shadow-sm transition hover:border-primary hover:text-primary"
                >
                  {showTimeDetail.showTime.startTime}
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ShowTimeDetail;
