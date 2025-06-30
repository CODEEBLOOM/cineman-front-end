import { Button } from '@mui/material';
import ModalCreateSeatMap from './ModalCreateCinemaTheater';
import { useModelContext } from '@context/ModalContext';

const CreateCinemaTheater = ({ fetchCinemaTheaters }) => {
  const { openPopup } = useModelContext();
  const handleOpenPopup = () => {
    openPopup(<ModalCreateSeatMap fetchCinemaTheaters={fetchCinemaTheaters} />);
  };
  return (
    <>
      <div className={'flex items-center justify-between'}>
        <h1 className={'text-[1.2rem]'}>Danh sách phòng chiếu</h1>
        <Button
          variant={'contained'}
          className={'bg-primary'}
          onClick={handleOpenPopup}
        >
          Thêm mới
        </Button>
      </div>
    </>
  );
};

export default CreateCinemaTheater;
