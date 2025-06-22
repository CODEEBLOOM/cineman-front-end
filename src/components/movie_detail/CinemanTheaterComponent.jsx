import React from 'react';
import { useModelContext } from '@context/ModalContext.jsx';
import { IoClose } from 'react-icons/io5';
import CustomButton from '@component/CustomButton.jsx';
import { Link } from 'react-router-dom';

const MovieTheaterComponent = () => {
  const { openPopup, setIsShowing } = useModelContext();

  return (
    <div className={'container'}>
      <div>
        <p className={'font-bold uppercase'}>2d lồng tiếng</p>
      </div>
      <div className={'flex gap-8'}>
        <div className={'flex flex-col text-center'}>
          <p
            className={
              'inline-block bg-[#e5e5e5] px-10 py-2 transition-colors duration-200 hover:cursor-pointer hover:bg-slate-300'
            }
            onClick={() =>
              openPopup(
                <div
                  className={
                    'relative flex aspect-video w-[80vw] flex-col justify-between bg-white p-5 md:w-[50vw]'
                  }
                >
                  <span
                    className={'absolute right-3 top-3 hover:cursor-pointer'}
                    onClick={() => setIsShowing(false)}
                  >
                    <IoClose size={25} />
                  </span>
                  <div className={'border-b-2 px-4'}>
                    <p className={'font-bold uppercase lg:text-[25px]'}>
                      bạn đang đặt vé xem phim
                    </p>
                  </div>
                  <div className={'flex-grow border-b-2 px-4 text-center'}>
                    <h1
                      className={
                        'border-b-2 py-6 font-bold uppercase text-primary lg:text-[25px]'
                      }
                    >
                      Elio Cậu bé từ trái đất
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
                            <h4 className={'lg:text-[20px]'}>Giờ Chiếu</h4>
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={'h-[50px]'}>
                          <td>
                            <h3 className={'font-bold lg:text-[25px]'}>
                              Cineman Quang Trung
                            </h3>
                          </td>
                          <td>
                            <h3 className={'font-bold lg:text-[25px]'}>
                              20/06/2025
                            </h3>
                          </td>
                          <td>
                            <h3 className={'font-bold lg:text-[25px]'}>
                              13:15
                            </h3>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    className={'p-2 px-4 text-center'}
                    onClick={() => setIsShowing(false)}
                  >
                    <Link to={'/choose-seat'}>
                      <CustomButton title={'Đồng ý'} />
                    </Link>
                  </div>
                </div>
              )
            }
          >
            13:15
          </p>
          <small>
            <span>150</span> ghế trống
          </small>
        </div>
        <div className={'flex flex-col text-center'}>
          <p
            className={
              'inline-block bg-[#e5e5e5] px-10 py-2 transition-colors duration-200 hover:cursor-pointer hover:bg-slate-300'
            }
          >
            13:15
          </p>
          <small>
            <span>150</span> ghế trống
          </small>
        </div>
      </div>
    </div>
  );
};

export default MovieTheaterComponent;
