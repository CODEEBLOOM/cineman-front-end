import CustomSelect from '@component/form_field/CustomSelect';
import TextAreaInput from '@component/form_field/TextAreaInput';
import TextInput from '@component/form_field/TextInput';
import FormField from '@component/FormField';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { GoPlus } from 'react-icons/go';

const FormMovie = () => {
  const { control, errors } = useForm();

  return (
    <div>
      <FormField
        name="title"
        require={true}
        label="Tên phim"
        control={control}
        Component={TextInput}
        type="text"
        placeHolder="Nhập tên phim"
        // error={errors['title']}
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex w-full">
          <div className="flex-1">
            <FormField
              name="director"
              require={true}
              label="Đạo diễn"
              control={control}
              Component={CustomSelect}
              type="text"
              placeHolder="Chọn đạo diễn có sẵn"
              // error={errors['title']}
            />
          </div>
          <Button
            variant="contained"
            className="!mb-3 !mt-auto h-10 w-[30px] !capitalize"
          >
            <GoPlus />
          </Button>
        </div>
        <div className="flex w-full">
          <div className="flex-1">
            <FormField
              name="cast"
              require={true}
              label="Diễn viên"
              control={control}
              Component={CustomSelect}
              type="text"
              placeHolder="Chọn diễn viên có sẵn"
              // error={errors['title']}
            />
          </div>
          <Button
            variant="contained"
            className="!mb-3 !mt-auto h-10 w-[30px] !capitalize"
          >
            <GoPlus />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <FormField
          name="releaseDate"
          require={true}
          label="Ngày khởi chiếu"
          control={control}
          Component={TextInput}
          type="date"
          // error={errors['title']}
        />
        <FormField
          name="endReleaseDate"
          require={true}
          label="Ngày kết thúc"
          control={control}
          Component={TextInput}
          type="date"
          // error={errors['title']}
        />
        <FormField
          name="duration"
          require={true}
          label="Thời lượng"
          control={control}
          Component={TextInput}
          type="number"
          placeHolder={'Nhập thời lượng'}
          // error={errors['title']}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex w-full">
          <div className="flex-1">
            <FormField
              name="genre"
              require={true}
              label="Thể loại"
              control={control}
              Component={CustomSelect}
              type="text"
              placeHolder="Chọn thể loại"
              // error={errors['title']}
            />
          </div>
          <Button
            variant="contained"
            className="!mb-3 !mt-auto h-10 w-[30px] !capitalize"
          >
            <GoPlus />
          </Button>
        </div>
        <FormField
          name="age"
          require={true}
          label="Giới hạn độ tuổi"
          control={control}
          Component={CustomSelect}
          type="text"
          placeHolder="Giới hạn độ tuổi"
          // error={errors['title']}
        />
      </div>
      <div>
        <FormField
          name="version"
          require={true}
          label="Phiên bản"
          control={control}
          Component={CustomSelect}
          type="text"
          placeHolder="Chọn phiên bản"
          // error={errors['title']}
        />
      </div>
      <FormField
        name="synopsis"
        require={true}
        label="Tóm tắt"
        control={control}
        Component={TextAreaInput}
        rows={2}
        maxRows={4}
        type="text"
        placeHolder="Nhập tóm tắt bộ phim"
        // error={errors['title']}
      />
      <FormField
        name="description"
        require={true}
        label="Mô tả bộ phim"
        control={control}
        Component={TextAreaInput}
        rows={4}
        maxRows={6}
        type="text"
        placeHolder="Mô tả phim"
        // error={errors['title']}
      />
    </div>
  );
};
export default FormMovie;
