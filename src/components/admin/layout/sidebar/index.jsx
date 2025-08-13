import { useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { IoIosArrowBack } from 'react-icons/io';
import { NavLink } from 'react-router-dom';
import { RiDashboard3Fill } from 'react-icons/ri';
import { FaChartColumn } from 'react-icons/fa6';
import Submenu from '@component/admin/layout/sidebar/Submenu.jsx';
import { listMenuAdmin } from '@utils/listMenuAdmin.js';
import { useSelector } from 'react-redux';

const subMenuList = listMenuAdmin;

const Sidebar = ({ isOpen = true, setIsOpen, isMobile }) => {
  const { user } = useSelector((state) => state.user);
  const Sidebar_Amination = isMobile
    ? {
        open: {
          x: 0,
          width: '16rem',
          transition: {
            damping: 40,
          },
        },
        close: {
          x: -250,
          width: '4rem',
          transition: {
            damping: 40,
            delay: 0.15,
          },
        },
      }
    : {
        // System view
        open: {
          width: '16rem',
          transition: {
            damping: 40,
          },
        },
        close: {
          width: '4rem',
          transition: {
            damping: 40,
          },
        },
      };

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile, setIsOpen]);

  return (
    <div
      style={{
        backgroundImage: 'url("/bg-image-admin.jpg")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
      className={`${isMobile && '!bg-none'}`}
    >
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-[888] max-h-screen bg-black/50 md:hidden ${isOpen ? 'block' : 'hidden'}`}
      ></div>
      <motion.div
        variants={Sidebar_Amination}
        animate={isOpen ? 'open' : 'close'}
        className={
          'text-gray fixed z-[999] h-screen w-[16rem] max-w-[16rem] overflow-hidden bg-gradient-to-l from-blue-700/30 to-black shadow-xl md:relative'
        }
      >
        <div
          className={
            'mx-3 flex items-center justify-center gap-2.5 border-b border-slate-300 py-3 font-medium'
          }
        >
          <img
            src="/logo-new-v01.png"
            alt=""
            width={80}
            className={'object-cover'}
          />
        </div>
        {/*Menu*/}
        <div className={'flex flex-col'}>
          <ul
            style={{
              height: 'calc(100vh - 60px)',
            }}
            className={
              'flex flex-col gap-1 overflow-y-auto overflow-x-hidden scroll-smooth whitespace-pre px-2.5 py-5 text-[0.9rem] font-medium scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100'
            }
          >
            {user?.roles?.some((r) => r.roleId === 'ADMIN') && (
              <>
                <li>
                  <NavLink
                    to={'/admin/dashboard'}
                    className={({ isActive }) =>
                      `link text-gray-400 ${isActive ? 'active' : ''}`
                    }
                  >
                    <RiDashboard3Fill size={20} className={'min-w-max'} />
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to={'/admin/thong-ke'} className={'link'}>
                    <FaChartColumn size={20} className={'min-w-max'} />
                    Thống kê
                  </NavLink>
                </li>
              </>
            )}
            {/*  Submenu */}
            {isOpen && (
              <div className={'border-b border-slate-300 py-5'}>
                {subMenuList.map((subMenu) => (
                  <div key={subMenu.name} className={'flex flex-col gap-1'}>
                    <Submenu data={subMenu} />
                  </div>
                ))}
              </div>
            )}
          </ul>

          {/*  second*/}
          <div className={''}></div>
        </div>
        <motion.div
          animate={
            isOpen
              ? { x: 0, y: 0, rotate: 0 }
              : { x: -10, y: -200, rotate: 180 }
          }
          transition={{
            duration: 0,
          }}
          onClick={() => setIsOpen(!isOpen)}
          className={
            'absolute bottom-5 right-2 z-50 w-fit cursor-pointer rounded-full bg-black/50 p-2'
          }
        >
          <IoIosArrowBack size={25} fill={'white'} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
