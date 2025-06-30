import { IoIosArrowDown } from 'react-icons/io';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Submenu = ({ data }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  return (
    <>
      <li className={'link'} onClick={() => setSubmenuOpen(!submenuOpen)}>
        <data.icon size={20} className="min-w-max" />
        <p className={'flex-1 capitalize'}>{data.name}</p>
        <IoIosArrowDown
          className={`${submenuOpen && 'rotate-180'} duration-200`}
        />
      </li>
      <motion.ul
        animate={
          submenuOpen
            ? {
                height: 'fit-content',
              }
            : {
                height: 0,
              }
        }
        className={'flex h-0 flex-col overflow-hidden pl-5 text-[.8rem]'}
      >
        {data.menus.map((item) => (
          <li key={item.name}>
            <NavLink to={item.path} className={'link text-gray-400'}>
              <item.icon size={20} />
              {item.name}
            </NavLink>
          </li>
        ))}
      </motion.ul>
    </>
  );
};

export default Submenu;
