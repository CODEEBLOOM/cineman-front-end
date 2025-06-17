import CustomSelect from '@component/form_field/CustomSelect';
import TextInput from '@component/form_field/TextInput';
import FormField from '@component/FormField';
import TabPanel from '@component/Tabpanel';
import { Box, Button, CircularProgress, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { register } from '@apis/authService';
import { fetchLogin } from '@redux/slices/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from '@redux/slices/snackbarSlice';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const authPage = searchParams.get('auth');
  const [value, setValue] = useState(authPage == 'login' ? 0 : 1);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status: loginStatus } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authPage === 'login') {
      setValue(0);
    } else {
      setValue(1);
    }
  }, [authPage]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  /* Control for form login */
  const formLoginSchema = yup.object().shape({
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Email chưa đúng định dạng !',
      )
      .required(),
    password: yup.string().required(),
  });
  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    reset: loginReset,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: yupResolver(formLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data) => {
    try {
      const result = await dispatch(fetchLogin(data)).unwrap();
      if (result.status === 404) {
        dispatch(openSnackbar({ message: result.message, type: 'error' }));
      } else {
        dispatch(openSnackbar({ message: 'Đăng nhập thành công ' }));
        loginReset();
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* Control for form register */
  const formRegisterSchema = yup.object().shape({
    fullName: yup.string().required('Họ tên không được để trống !'),
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Email chưa đúng định dạng !',
      )
      .required(),
    password: yup.string().required('Mật khẩu không được để trống !'),
    confirmPassword: yup
      .string()
      .required('Xác nhận mật khẩu không được để trống !'),
    phoneNumber: yup.string().required('Số điện thoại không được để trống !'),
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
          dispatch(openSnackbar({ message: res.message }));
          reset();
          navigate('/login?auth=login');
          setValue(0);
        }
      })
      .catch((err) => {
        alert('Error: ', err);
      });
  };

  return (
    <>
      <div className="container mt-10">
        <Box sx={{ width: '50%', margin: 'auto' }}>
          <Box sx={{ borderBottom: '2px solid lightGray' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                sx={{
                  '&.MuiButtonBase-root': {
                    padding: '16px',
                    width: '50%',
                  },
                }}
                label="Đăng nhập"
                {...a11yProps(0)}
              />
              <Tab
                sx={{
                  '&.MuiButtonBase-root': {
                    padding: '16px',
                    width: '50%',
                  },
                }}
                label="Đăng kí"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <div>
              <form onSubmit={handleLoginSubmit(handleLogin)}>
                <FormField
                  name="email"
                  label="Email"
                  control={loginControl}
                  Component={TextInput}
                  type="email"
                  placeHolder="Email"
                  error={loginErrors['email']}
                />
                <FormField
                  name="password"
                  label="Password"
                  type="password"
                  control={loginControl}
                  Component={TextInput}
                  placeHolder="Password"
                  error={loginErrors['password']}
                />
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
                    {loginStatus === 'loading' && (
                      <CircularProgress size={25} className="mr-2" />
                    )}
                    Đăng nhập bằng tài khoản
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
                    {loginStatus === 'loading' && (
                      <CircularProgress size={25} className="mr-2" />
                    )}
                    Đăng nhập bằng facebook
                  </Button>
                </div>
              </form>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <form onSubmit={handleRegisterSubmit(handleRegister)}>
              <div className="grid grid-cols-2 justify-between gap-x-2">
                <FormField
                  name="fullName"
                  label="Họ tên"
                  control={registerControl}
                  Component={TextInput}
                  placeHolder="Họ tên"
                  error={registerErrors['fullName']}
                />
                <FormField
                  name="email"
                  label="Email"
                  control={registerControl}
                  Component={TextInput}
                  type="email"
                  placeHolder="Email"
                  error={registerErrors['email']}
                />
                <FormField
                  name="password"
                  label="Mật khẩu"
                  control={registerControl}
                  Component={TextInput}
                  type="password"
                  placeHolder="Mật khẩu"
                  error={registerErrors['password']}
                />
                <FormField
                  name="confirmPassword"
                  label="Xác nhận lại mật khẩu"
                  control={registerControl}
                  Component={TextInput}
                  type="password"
                  placeHolder="Xác nhận mật khẩu"
                  error={registerErrors['confirmPassword']}
                />
                <FormField
                  name="phoneNumber"
                  label="Số điện thoại"
                  control={registerControl}
                  Component={TextInput}
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
                  type="date"
                  placeHolder="Ngày sinh"
                  error={registerErrors['dateOfBirth']}
                />
                <FormField
                  name="gender"
                  label="Giới tính"
                  control={registerControl}
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
                  Đăng kí bằng facebook
                </Button>
              </div>
            </form>
          </TabPanel>
        </Box>
      </div>
    </>
  );
};
export default LoginPage;
