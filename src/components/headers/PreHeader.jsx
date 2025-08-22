import { Link } from 'react-router-dom';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { clearInfoUser, fetchInfoUser } from '@redux/slices/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { clearInfoAuth, fetchLogout } from '@redux/slices/authSlice.js';
import { toast } from 'react-toastify';
import { clearInvoice } from '@redux/slices/invoiceSlice';
import { clearSnack } from '@redux/slices/snackSlice';
import { clearSelectedSeats } from '@redux/slices/ticketSlice';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { MdCardMembership } from 'react-icons/md';
import { RiLogoutCircleLine, RiMovie2AiLine } from 'react-icons/ri';
import { TfiTicket } from 'react-icons/tfi';
import { FaFileInvoiceDollar } from 'react-icons/fa';
const PreHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const { isAuthentication, accessToken } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

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
      toast.success('Đăng xuất thành công');
    } catch (err) {
      console.log(err);
    }
  };

  /* Fetch thông tin user nếu đã đăng nhập thành công */
  useEffect(() => {
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

  const renderMenu = (
    <Menu
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleClose}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <MenuItem>
        <Link to={'/my-account?tab=profile'} className="flex items-center">
          <IoInformationCircleOutline size={20} className="mr-2" />
          Thông tin tài khoản
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to={'/my-account?tab=membership'} className="flex items-center">
          <MdCardMembership size={20} className="mr-2" />
          Thẻ thành viên
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to={'/my-account?tab=transaction'} className="flex items-center">
          <RiMovie2AiLine size={20} className="mr-2" />
          Lịch sử giao dịch
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to={'/my-account?tab=voucher'} className="flex items-center">
          <TfiTicket size={20} className="mr-2" />
          Voucher của tôi
        </Link>
      </MenuItem>
      {user?.roles?.some((role) => role.roleId === 'RCP') && (
        <MenuItem>
          <Link to={'/admin/invoice'} className="flex items-center">
            <FaFileInvoiceDollar size={20} className="mr-2" />
            Xuất hóa đơn
          </Link>
        </MenuItem>
      )}
      <MenuItem onClick={handleLogout}>
        <RiLogoutCircleLine size={20} className="mr-2" />
        Đăng xuất
      </MenuItem>
    </Menu>
  );

  return (
    <div className="bg-black">
      <div className="container flex items-center justify-end text-center text-white">
        {isAuthentication && user?.userId ? (
          <>
            <div className={'mr-2'}>
              <span>Xin chào:&nbsp;</span>
              <span>{user?.fullName}</span>
              <IconButton size={'medium'} onClick={handleUserProfileClick}>
                <Avatar sx={{ width: 32, height: 32 }} src={user?.avatar} />
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
