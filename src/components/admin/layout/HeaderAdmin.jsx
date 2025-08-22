import { useEffect, useState } from 'react';
import { RiMenu2Fill } from 'react-icons/ri';
import { IoMdQrScanner } from 'react-icons/io';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { clearInfoAuth, fetchLogout } from '@redux/slices/authSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { BiLogOut } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { clearInfoUser, fetchInfoUser } from '@redux/slices/userSlice';
import { clearInvoice } from '@redux/slices/invoiceSlice';
import { clearSnack } from '@redux/slices/snackSlice';
import { clearSelectedSeats } from '@redux/slices/ticketSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket } from 'lucide-react';

const HeaderAdmin = ({ open = true, setOpen }) => {
  const { user } = useSelector((state) => state.user);
  const { isAuthentication, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      dispatch(clearInfoUser());
      dispatch(clearInvoice());
      dispatch(clearSnack());
      dispatch(clearSelectedSeats());
      return toast.success('Đăng xuất thành công');
    } catch (err) {
      console.log(err);
    }
  };

  /* Fetch thông tin user nếu đã đăng nhập thành công */
  useEffect(() => {
    if (user.roles?.some((role) => role.roleId === 'USER')) return;
    const getInfoUser = async () => {
      try {
        await dispatch(fetchInfoUser()).unwrap();
      } catch (err) {
        console.log(err);
        dispatch(clearInfoAuth());
      }
    };
    if (isAuthentication && accessToken) {
      getInfoUser();
    }
  }, [isAuthentication, accessToken, dispatch]);

  useEffect(() => {
    if (!user.userId || user?.roles?.some((role) => role.roleId === 'USER')) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const isRCP = user?.roles?.some((role) => role.roleId === 'RCP');

  const renderMenu = (
    <Menu
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleClose}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <MenuItem onClick={handleLogout}>
        <BiLogOut size={20} /> &#160; Đăng xuất
      </MenuItem>
      {isRCP && (
        <MenuItem>
          <Link to={'/'} className="flex items-center">
            <Ticket size={20} />
            &#160; Đặt vé
          </Link>
        </MenuItem>
      )}
    </Menu>
  );

  const roles = user?.roles?.map((role) => role.roleId);

  return (
    <div className={'flex items-center justify-between bg-white px-5 py-2'}>
      <div>
        <RiMenu2Fill
          size={25}
          onClick={() => setOpen(!open)}
          className={'cursor-pointer'}
        />
      </div>
      <div className={'flex items-center gap-2'}>
        <div className={'flex items-center gap-2'}>
          <IconButton size={'medium'} onClick={handleUserProfileClick}>
            <Avatar sx={{ width: 32, height: 32 }} />
          </IconButton>
          <div>
            <p>{user?.fullName}</p>
            <small className="font-bold text-primary">
              {roles?.includes('ADMIN')
                ? 'Admin'
                : roles?.includes('CADMIN')
                  ? 'Cinema Admin'
                  : 'Receptionist'}
            </small>
          </div>
        </div>
      </div>
      {renderMenu}
    </div>
  );
};

export default HeaderAdmin;
