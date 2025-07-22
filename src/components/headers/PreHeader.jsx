import { Link } from 'react-router-dom';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchInfoUser } from '@redux/slices/userSlice.js';
import { openSnackbar } from '@redux/slices/snackbarSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLogout, setIsAuthentication } from '@redux/slices/authSlice.js';
const PreHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const { isAuthentication } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const getInfoUser = async () => {
      try {
        await dispatch(fetchInfoUser()).unwrap();
      } catch (err) {
        console.log(err);
        dispatch(setIsAuthentication(false));
      }
    };
    if (isAuthentication) {
      getInfoUser();
    }
  }, [isAuthentication, dispatch]);

  const handleUserProfileClick = (event) => {
    setAnchorEl(event.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await dispatch(fetchLogout()).unwrap();
      dispatch(openSnackbar({ message: 'Đăng xuất thành công.' }));
    } catch (err) {
      console.log(err);
    }
  };

  const renderMenu = (
    <Menu
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleClose}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <MenuItem>Thông tin tài khoản</MenuItem>
      <MenuItem>Thẻ thành viên</MenuItem>
      <MenuItem>Hành trình điện ảnh</MenuItem>
      <MenuItem>Voucher của tôi</MenuItem>
      <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
    </Menu>
  );

  return (
    <div className="bg-black">
      <div className="container flex items-center justify-end text-center text-white">
        {isAuthentication ? (
          <>
            <div className={'mr-2'}>
              <span>Xin chào:&nbsp;</span>
              <span>{user.fullName}</span>
              <IconButton size={'medium'} onClick={handleUserProfileClick}>
                <Avatar sx={{ width: 32, height: 32 }} src={user.avatar} />
              </IconButton>
            </div>
            {renderMenu}
          </>
        ) : (
          <ul className="flex gap-5 pr-2">
            <li>
              <Link
                to={'/auth/login?auth=login'}
                className="text-[13px] text-white hover:underline"
              >
                Đăng nhập
              </Link>
            </li>
            <li>
              <Link
                to={'/auth/login?auth=register'}
                className="text-[13px] text-white hover:underline"
              >
                Đăng kí
              </Link>
            </li>
          </ul>
        )}
        <div className="h-6 w-6">
          <a href="#">
            <img
              src={`https://toppng.com/uploads/preview/vietnam-large-flag-11547887920ptaqfn7euo.png`}
              alt=""
              className="w-full object-cover"
            />
          </a>
        </div>
      </div>
    </div>
  );
};
export default PreHeader;
