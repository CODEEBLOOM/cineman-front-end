import { useEffect, useState } from 'react';
import { useModelContext } from '@context/ModalContext.jsx';
import { IoClose } from 'react-icons/io5';
import CustomButton from '@component/CustomButton.jsx';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getShowTimeDetail } from '@apis/showTimeService';

const ShowTimeDetail = ({ showTimeSelected, movieId }) => {
  const movieTheater = useSelector(
    (state) => state.movieTheater?.movieTheater ?? { id: null }
  );
  const [showTimeDetails, setShowTimeDetails] = useState();

  const groupShowtimesByTheater = (list) => {
    return list.reduce((acc, item) => {
      const id = item.cinemaTheater.cinemaTheaterId;

      if (!acc[id]) {
        acc[id] = {
          theater: item.cinemaTheater,
          items: [],
        };
      }

      acc[id].items.push(item);
      return acc;
    }, {});
  };

  useEffect(() => {
    if (!showTimeSelected || !movieId || !movieTheater?.id) return;
    getShowTimeDetail({
      movieId: movieId,
      movieTheaterId: movieTheater.id,
      showDate: showTimeSelected?.showDate,
    })
      .then((res) => {
        const grouped = groupShowtimesByTheater(res.data);
        Object.values(grouped).forEach((g) => {
          g.items.sort((a, b) =>
            a.showTime.startTime.localeCompare(b.showTime.startTime)
          );
        });
        setShowTimeDetails(grouped);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [showTimeSelected, movieTheater?.id, movieId]);

  const { openPopup, closeTopModal, resetModal } = useModelContext();

  const renderPopup = (showTime) => {
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
        <div className={'border-b-2 px-4'}>
          <p className={'font-bold uppercase lg:text-[25px]'}>
            Bạn đang đặt vé xem phim
          </p>
        </div>
        <div className={'flex-grow border-b-2 px-4 text-center'}>
          <h1
            className={
              'border-b-2 py-6 font-bold uppercase text-primary lg:text-[25px]'
            }
          >
            {showTime.movie.title}
          </h1>
          <table className={'w-full'}>
            <thead>
              <tr className={'h-[50px]'}>
                <td className={'w-[30%]'}>
                  <h4 className={'lg:text-[20px]'}>Rạp chiếu</h4>
                </td>
                <td className={'w-[30%]'}>
                  <h4 className={'lg:text-[20px]'}>Ngày chiếu</h4>
                </td>
                <td className={'w-[30%]'}>
                  <h4 className={'lg:text-[20px]'}>Giờ chiếu</h4>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr className={'h-[50px]'}>
                <td>
                  <h3 className={'font-bold lg:text-[25px]'}>
                    {showTime.cinemaTheater.name}
                  </h3>
                </td>
                <td>
                  <h3 className={'font-bold lg:text-[25px]'}>
                    {showTime.showTime.showDate}
                  </h3>
                </td>
                <td>
                  <h3 className={'font-bold lg:text-[25px]'}>
                    {showTime.showTime.startTime}
                  </h3>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={'mx-auto p-2 px-4'} onClick={() => resetModal()}>
          <Link to={`/choose-seat?st=${showTime.showTime.id}`}>
            <div className="min-w-[150px] max-w-[150px]">
              <CustomButton title="Đồng ý" />
            </div>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div>
      {showTimeDetails &&
        Object.values(showTimeDetails)?.map((showTimeGroup) => (
          <div
            className="flex flex-col flex-wrap gap-2 md:gap-3"
            key={showTimeGroup.theater.id}
          >
            {showTimeGroup.items.length > 0 && (
              <div>
                <p className="font-semibold">{`${showTimeGroup.theater.name} - ${showTimeGroup.items[0]?.movieVariation?.name}`}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2 md:gap-3">
              {showTimeGroup.items.map((showTimeDetail) => (
                <div
                  className={'flex flex-col text-center'}
                  key={showTimeDetail.showTime.id}
                  onClick={() => openPopup(renderPopup(showTimeDetail))}
                >
                  <p
                    className={
                      'inline-block bg-[#e5e5e5] px-10 py-2 transition-colors duration-200 hover:cursor-pointer hover:bg-slate-300'
                    }
                  >
                    {showTimeDetail.showTime.startTime}
                  </p>
                  <small>
                    <span>{showTimeDetail.totalSeatEmpty}</span> ghế trống
                  </small>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ShowTimeDetail;