import TabPanel from '@component/Tabpanel';
import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '@redux/slices/snackbarSlice';
import RegisterComponent from '@component/auth/RegisterComponent';
import LoginComponent from '@component/auth/LoginComponent';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const authPage = searchParams.get('auth');
  const [value, setValue] = useState(authPage === 'login' ? 0 : 1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* Xử lý tab trong giao diện */
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

  return (
    <>
      <div className="container mt-10">
        <div className="mx-auto w-[80%] lg:w-[50%]">
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
            <LoginComponent
              dispatch={dispatch}
              navigate={navigate}
              openSnackbar={openSnackbar}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <RegisterComponent
              dispatch={dispatch}
              openSnackbar={openSnackbar}
              navigate={navigate}
              setValue={setValue}
            />
          </TabPanel>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
