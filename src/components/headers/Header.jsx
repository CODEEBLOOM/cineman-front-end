import { Box, Button, Drawer, useMediaQuery, useTheme } from '@mui/material';
import DropdownHeader from './DropdownHeader';
import PreHeader from './PreHeader';
import './header.css';
import { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { menuHeader } from '@utils/menuHeader';
import { Link } from 'react-router-dom';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /* Hàm xử lý sticky header khi cuộn thanh scroll bar */
  useEffect(() => {
    const handleScroll = () => {
      const triggerPoint = 5;
      setIsSticky(window.scrollY > triggerPoint);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Hàm xử lý toogle ở giao diện mobile  */
  const toggleDrawer = (isOpen) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setOpen(isOpen);
  };

  /* Hàm xử lý render content ở giao diện mobile  */
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <ul className="flex flex-col gap-6 p-4">
        {menuHeader.map((item) => (
          <li key={item.id}>
            <a
              href={item.link}
              className="text-[16px] font-bold uppercase hover:text-[#337ab7]"
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </Box>
  );

  return (
    <div className="border-b-2 shadow-sm">
      <PreHeader />
      <div
        className={`z-50 transition-all duration-500 ${isSticky ? 'fixed left-0 right-0 top-0 bg-white/50 backdrop-blur-xl' : ''}`}
      >
        <header className={`container flex items-center justify-between`}>
          <div className="flex items-center">
            <Link
              to={'/'}
              className="block w-[80px] py-2 sm:w-[80px] lg:w-[100px]"
            >
              <img
                src="/logo-new-v01.png"
                alt=""
                className="aspect-[3/2] h-auto w-full object-contain"
              />
            </Link>
            <DropdownHeader />
          </div>
          <div>
            <ul className="flex gap-6">
              {!isMobile ? (
                menuHeader.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.link}
                      className="font-bold uppercase hover:text-primary lg:text-[20px]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))
              ) : (
                <></>
              )}
            </ul>
          </div>
          {isMobile && (
            <>
              <Button
                onClick={toggleDrawer(true)}
                className="!justify-end !p-0"
              >
                <FaBars size={20} />
              </Button>
              <Drawer
                anchor={'right'}
                open={open}
                onClose={toggleDrawer(false)}
              >
                {drawerContent}
              </Drawer>
            </>
          )}
        </header>
      </div>
    </div>
  );
};
export default Header;
