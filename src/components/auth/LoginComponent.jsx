import TextInput from '@component/form_field/TextInput';
import FormField from '@component/FormField';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, CircularProgress } from '@mui/material';
import { fetchLogin } from '@redux/slices/authSlice';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { FcGoogle } from 'react-icons/fc';
import { loginWithGoogle } from '@apis/authService';
import { useState } from 'react';
import { toast } from 'react-toastify';

const LoginComponent = ({ dispatch, navigate }) => {
  const { status: loginStatus } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  /* Control for form login */
  const formLoginSchema = yup.object().shape({
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Email chưa đúng định dạng !'
      )
      .required('Email không được để trống !'),
    password: yup.string().required('Password không được để trống !'),
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

  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const fromSearch = location.state?.from?.search || '';
  const redirectUrl = from + fromSearch;

  /* Xử lý login bằng username và password */
  const handleLogin = async (data) => {
    try {
      await dispatch(fetchLogin(data))?.unwrap();
      toast.success('Đăng nhập thành công !');
      loginReset();
      navigate(redirectUrl, { replace: true });
    } catch (error) {
      toast.error(error);
    }
  };

  /* Xử lý login bằng google */
  const handleLoginWithGoogle = () => {
    setIsLoading(true);
    loginWithGoogle()
      .then((res) => {
        if (res.status === 200) {
          window.location.href = res.data;
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <form onSubmit={handleLoginSubmit(handleLogin)}>
        <FormField
          name="email"
          label="Email"
          control={loginControl}
          Component={TextInput}
          type="email"
          require={true}
          placeHolder="Email"
          error={loginErrors['email']}
        />
        <FormField
          name="password"
          label="Password"
          type="password"
          require={true}
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
            variant="contained"
            sx={{
              padding: '10px 20px',
              backgroundImage:
                'linear-gradient(to right, #0a64a7 0%, #258dcf 51%, #3db1f3 100%) !important',
            }}
            onClick={handleLoginWithGoogle}
          >
            {isLoading && <CircularProgress size={25} className="mr-2" />}
            <FcGoogle className="mr-2" size={25} />
            Đăng nhập bằng Google
          </Button>
        </div>
      </form>
    </div>
  );
};
export default LoginComponent;
