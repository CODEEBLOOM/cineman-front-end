import LoginComponent from '@component/auth/LoginComponent';
import RegisterComponent from '@component/auth/RegisterComponent';
import { Box, Container, Paper, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const authPage = searchParams.get('auth');
  const [value, setValue] = useState(authPage === 'register' ? 1 : 0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setValue(authPage === 'register' ? 1 : 0);
  }, [authPage]);

  const handleTabNavigation = (newValue) => {
    setValue(newValue);
    navigate(`/auth/login?auth=${newValue === 0 ? 'login' : 'register'}`, {
      replace: true,
    });
  };

  const handleChange = (_, newValue) => {
    handleTabNavigation(newValue);
  };

  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  });

  return (
    <Box
      sx={{
        py: { xs: 4, md: 6 },
        backgroundColor: '#ffffff',
        minHeight: 'calc(100vh - 184px)',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            mx: 'auto',
            width: '100%',
            maxWidth: value === 1 ? 760 : 520,
            borderRadius: 0,
            backgroundColor: '#ffffff',
            boxShadow: 'none',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="auth tabs"
            sx={{
              borderBottom: '1px solid #e6e9ef',
              '& .MuiTabs-indicator': {
                height: 3,
                backgroundColor: '#0a4d9c',
              },
            }}
          >
            <Tab
              disableRipple
              label="ĐĂNG NHẬP"
              {...a11yProps(0)}
              sx={{
                py: 2.2,
                color: '#6b7280',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.02em',
                '&.Mui-selected': {
                  color: '#0a4d9c',
                  backgroundColor: '#f5f8fc',
                },
              }}
            />
            <Tab
              disableRipple
              label="ĐĂNG KÝ"
              {...a11yProps(1)}
              sx={{
                py: 2.2,
                color: '#6b7280',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.02em',
                '&.Mui-selected': {
                  color: '#0a4d9c',
                  backgroundColor: '#f5f8fc',
                },
              }}
            />
          </Tabs>

          <Box sx={{ px: { xs: 3, md: 5 }, py: { xs: 3, md: 4 } }}>
            {value === 0 ? (
              <Box role="tabpanel" id="simple-tabpanel-0" aria-labelledby="simple-tab-0">
                <LoginComponent
                  dispatch={dispatch}
                  navigate={navigate}
                  onSelectRegister={() => handleTabNavigation(1)}
                />
              </Box>
            ) : (
              <Box role="tabpanel" id="simple-tabpanel-1" aria-labelledby="simple-tab-1">
                <RegisterComponent
                  dispatch={dispatch}
                  navigate={navigate}
                  setValue={handleTabNavigation}
                />
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
