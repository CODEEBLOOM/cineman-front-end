import React, { useState } from 'react';
import { RiMenu2Fill } from 'react-icons/ri';
import { IoMdQrScanner } from 'react-icons/io';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { fetchLogout } from '@redux/slices/authSlice.js';
import { openSnackbar } from '@redux/slices/snackbarSlice.js';
import { useDispatch } from 'react-redux';
import { CgUserList } from 'react-icons/cg';
import { BiLogOut } from 'react-icons/bi';

const HeaderAdmin = ({ open = true, setOpen }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

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
      <MenuItem>
        <CgUserList size={20} /> &#160; Thông tin tài khoản
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <BiLogOut size={20} /> &#160; Đăng xuất
      </MenuItem>
    </Menu>
  );

  return (
    <div
      className={
        'flex items-center justify-between border-b-2 bg-white px-5 py-2'
      }
    >
      <div>
        <RiMenu2Fill
          size={25}
          onClick={() => setOpen(!open)}
          className={'cursor-pointer'}
        />
      </div>
      <div className={'flex items-center gap-2'}>
        <div>
          <IoMdQrScanner size={25} />
        </div>
        <div className={'flex items-center gap-2'}>
          <IconButton size={'medium'} onClick={handleUserProfileClick}>
            <Avatar sx={{ width: 32, height: 32 }} />
          </IconButton>
          <div>
            <p>Đỗ Quang Sơn</p>
            <small>System Admin</small>
          </div>
        </div>
      </div>
      {renderMenu}
    </div>
  );
};

export default HeaderAdmin;
