import { register } from '@apis/authService';
import CustomSelect from '@component/form_field/CustomSelect';
import TextInput from '@component/form_field/TextInput';
import FormField from '@component/FormField';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import * as yup from 'yup';

const RegisterComponent = ({ dispatch, openSnackbar, navigate, setValue }) => {
  const [isLoading, setIsLoading] = useState(false);

  /* Control for form register */
  const formRegisterSchema = yup.object().shape({
    fullName: yup.string().required('Họ tên không được để trống !'),
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Email chưa đúng định dạng !'
      )
      .required(),
    password: yup.string().required('Mật khẩu không được để trống !'),
    confirmPassword: yup
      .string()
      .required('Xác nhận mật khẩu không được để trống !'),
    phoneNumber: yup
      .string()
      .matches(/^0[0-9]{9,10}$/, 'Số điện thoại chưa đúng định dạng !')
      .required('Số điện thoại không được để trống !'),
    dateOfBirth: yup.date().required('Ngày sinh không được để trống !'),
    gender: yup.string().required('Giới tính không được để trống !'),
  });
  const {
    control: registerControl,
    handleSubmit: handleRegisterSubmit,
    reset,
    formState: { errors: registerErrors },
  } = useForm({
    resolver: yupResolver(formRegisterSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      address: '',
      dateOfBirth: format(new Date(), 'yyyy-MM-dd'),
      gender: '',
    },
  });

  const handleRegister = (data) => {
    setIsLoading(true);
    register(data)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 201) {
          alert('Vui lòng kiểm tra mail để kích hoạt tài khoản');
          dispatch(openSnackbar({ message: 'Đăng kí thành công.' }));
          reset();
          navigate('/auth/login?auth=login');
          setValue(0);
        }
      })
      .catch((err) => {
        dispatch(
          openSnackbar({ message: err?.response?.data?.message, type: 'error' })
        );
        setIsLoading(false);
      });
  };

  return (
    <>
      <form onSubmit={handleRegisterSubmit(handleRegister)}>
        <div className="grid grid-cols-2 justify-between gap-x-2">
          <FormField
            name="fullName"
            label="Họ tên"
            control={registerControl}
            require={true}
            Component={TextInput}
            placeHolder="Họ tên"
            error={registerErrors['fullName']}
          />
          <FormField
            name="email"
            label="Email"
            control={registerControl}
            Component={TextInput}
            require={true}
            type="email"
            placeHolder="Email"
            error={registerErrors['email']}
          />
          <FormField
            name="password"
            label="Mật khẩu"
            control={registerControl}
            Component={TextInput}
            require={true}
            type="password"
            placeHolder="Mật khẩu"
            error={registerErrors['password']}
          />
          <FormField
            name="confirmPassword"
            label="Xác nhận lại mật khẩu"
            control={registerControl}
            Component={TextInput}
            require={true}
            type="password"
            placeHolder="Xác nhận mật khẩu"
            error={registerErrors['confirmPassword']}
          />
          <FormField
            name="phoneNumber"
            label="Số điện thoại"
            control={registerControl}
            Component={TextInput}
            require={true}
            placeHolder="Số điện thoại"
            error={registerErrors['phoneNumber']}
          />
          <FormField
            name="address"
            label="Địa chỉ"
            control={registerControl}
            Component={TextInput}
            placeHolder="Địa chỉ"
            error={registerErrors['address']}
          />
          <FormField
            name="dateOfBirth"
            label="Ngày sinh"
            control={registerControl}
            Component={TextInput}
            require={true}
            type="date"
            placeHolder="Ngày sinh"
            error={registerErrors['dateOfBirth']}
          />
          <FormField
            name="gender"
            label="Giới tính"
            control={registerControl}
            require={true}
            placeHolder={'Giới tính'}
            Component={CustomSelect}
            options={[
              { label: 'Nam', value: 'MALE' },
              { label: 'Nữ', value: 'FEMALE' },
              { label: 'Khác', value: 'OTHER' },
            ]}
            error={registerErrors['gender']}
          />
        </div>
        <div className="mx-auto mt-4 flex flex-col items-center gap-3">
          <Button
            type="submit"
            variant="contained"
            sx={{
              padding: '10px 20px',
              backgroundImage:
                'linear-gradient(to right, #fc3606 0%, #fda085 51%, #fc7704 100%) !important',
            }}
          >
            {isLoading && <CircularProgress size={25} className="mr-2" />}
            Đăng kí
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{
              padding: '10px 20px',
              backgroundImage:
                'linear-gradient(to right, #0a64a7 0%, #258dcf 51%, #3db1f3 100%) !important',
            }}
          >
            {isLoading && <CircularProgress size={25} className="mr-2" />}
            <FcGoogle className="mr-2" size={25} />
            Đăng kí bằng Google
          </Button>
        </div>
      </form>
    </>
  );
};
export default RegisterComponent;
