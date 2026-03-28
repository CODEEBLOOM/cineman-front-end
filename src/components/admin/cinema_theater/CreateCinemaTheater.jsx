import { Button } from '@mui/material';
import { useModelContext } from '@context/ModalContext';
import ModalCreateCinemaTheater from './ModalCreateCinemaTheater';

const CreateCinemaTheater = ({ fetchCinemaTheaters }) => {
  const { openPopup } = useModelContext();

  const handleOpenPopup = () => {
    openPopup(<ModalCreateCinemaTheater fetchCinemaTheaters={fetchCinemaTheaters} />);
  };

  return (
    <div className="mb-4 flex items-center justify-between border-b pb-3">
      <div>
        <h1 className="text-lg font-semibold">Danh sách phòng chiếu</h1>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý cấu hình phòng, sức chứa, loại phòng và sơ đồ ghế cho từng rạp.
        </p>
      </div>

      <Button variant="contained" className="bg-primary" onClick={handleOpenPopup}>
        Thêm mới
      </Button>
    </div>
  );
};

export default CreateCinemaTheater;