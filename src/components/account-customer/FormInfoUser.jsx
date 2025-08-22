import CustomSelect from '@component/form_field/CustomSelect';
import TextInput from '@component/form_field/TextInput';
import FormField from '@component/FormField';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { updateInfoUser } from '@apis/userService';
import { toast } from 'react-toastify';
import { updateUser } from '@redux/slices/userSlice';
import DateFormatter from '@utils/DateFormatter';
import { useEffect } from 'react';

const FormInfoUser = ({ avatar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const formSchema = yup.object().shape({
    fullName: yup.string().required('Họ tên không được để trống !'),
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Email chưa đúng định dạng !'
      )
      .required(),
    phoneNumber: yup
      .string()
      .matches(/^0[0-9]{9,10}$/, 'Số điện thoại chưa đúng định dạng !')
      .required('Số điện thoại không được để trống !'),
    dateOfBirth: yup.date().required('Ngày sinh không được để trống !'),
    gender: yup.string().required('Giới tính không được để trống !'),
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      userId: user.userId || '',
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      gender: user.gender || '',
      address: user.address || '',
      dateOfBirth:
        new DateFormatter(user.dateOfBirth).format('YYYY-MM-DD') || '',
      avatar: avatar || '',
    },
  });

  const handleSubmitForm = (data) => {
    updateInfoUser(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(updateUser(res.data));
          toast.success('Cập nhật thông tin thành công');
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Cập nhật thông tin thất bại !');
        }
        reset({
          userId: user.userId || '',
          fullName: user.fullName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          gender: user.gender || '',
          address: user.address || '',
          dateOfBirth:
            new DateFormatter(user.dateOfBirth).format('YYYY-MM-DD') || '',
          avatar: avatar || '',
        });
      });
  };

  useEffect(() => {
    setValue('avatar', avatar || '');
  }, [avatar, setValue]);

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
