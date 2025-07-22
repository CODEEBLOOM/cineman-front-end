import Breadcrumb from '@component/Breakcrumb';
import FormMovie from './FormMovie';
import { useState } from 'react';
import { Button, Switch } from '@mui/material';

const ListMovie = () => {
  const [checked, setChecked] = useState(false);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div>
      <div className="mb-5 flex justify-between bg-white px-5 py-2 shadow-sm">
        <p className="font-bold uppercase">Quản lý phim</p>
        <Breadcrumb current={'Danh sách phim'} />
      </div>
      <div className="mx-5 grid gap-5 lg:grid-cols-12">
        <div className="col-span-9 rounded-sm bg-white px-4 py-3">
          <h2 className="mb-3 border-b-2 pb-2 font-medium capitalize">
            Thông tin bộ phim
          </h2>
          <FormMovie />
        </div>
        <div className="col-span-3">
          <div className="rounded-sm bg-white px-4 py-3">
            <h2 className="mb-3 border-b-2 pb-2 font-medium capitalize">
              Thêm mới
            </h2>
            <p>
              <span>Nổi bật</span>
              <Switch
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </p>
            <div className="flex">
              <Button variant="contained" className="!mx-auto">
                Xuất bản
              </Button>
            </div>
          </div>

          <div className="mt-3 rounded-sm bg-white px-4 py-3">
            <h2 className="mb-3 border-b-2 pb-2 font-medium capitalize">
              <span className="text-red-500">* </span>
              Hình ảnh
            </h2>
            inp
          </div>
        </div>
      </div>
    </div>
  );
};
export default ListMovie;
