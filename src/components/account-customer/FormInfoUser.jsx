import CustomSelect from '@component/form_field/CustomSelect';
import TextInput from '@component/form_field/TextInput';
import FormField from '@component/FormField';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const FormInfoUser = () => {
  const { user } = useSelector((state) => state.user);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      gender: user.gender || '',
      address: user.address || '',
      dateOfBirth: user.dateOfBirth || '',
    },
  });

  const handleSubmitForm = (data) => {
    console.log('Submitted data:', data);
    // Xử lý dữ liệu sau khi submit
  };
  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="fullName"
            label="Họ và tên"
            control={control}
            Component={TextInput}
            type="text"
            require={true}
            placeHolder="Nguyen Van A"
            error={errors['fullName']}
          />
          <FormField
            name="email"
            label="Email"
            control={control}
            Component={TextInput}
            type="text"
            require={true}
            placeHolder="abc@gmail.com"
            error={errors['email']}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="phoneNumber"
            label="Số điện thoại"
            control={control}
            Component={TextInput}
            type="text"
            require={true}
            placeHolder="0 xxx xxx xxx"
            error={errors['phoneNumber']}
          />
          <FormField
            name="gender"
            label="Giới tính"
            control={control}
            require={true}
            placeHolder={'Chọn giới tính'}
            Component={CustomSelect}
            options={[
              { label: 'Nam', value: 'MALE' },
              { label: 'Nữ', value: 'FEMALE' },
              { label: 'Khác', value: 'OTHER' },
            ]}
            error={errors['gender']}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="dateOfBirth"
            label="Ngày sinh"
            control={control}
            Component={TextInput}
            type="date"
            require={true}
            error={errors['dateOfBirth']}
          />
          <FormField
            name="address"
            label="Địa chỉ"
            control={control}
            Component={TextInput}
            type="text"
            require={true}
            placeHolder="Quan 1, TP.HCM"
            error={errors['address']}
          />
        </div>
        <div>
          <p className="cursor-pointer select-none italic text-orange-400 hover:underline">
            Đổi mật khẩu ?
          </p>
        </div>
        <div className="flex justify-center">
          <Button
            variant="contained"
            color="warning"
            type="submit"
            className="mx-auto"
          >
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
};
export default FormInfoUser;
