import { useEffect, useRef, useState } from 'react';
import Dropdown from './Dropdown';
import { FaCaretDown } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';

const MenuItems = ({ items, depthLevel, isFirst = false }) => {
  const [dropdown, setDropdown] = useState(false);
  let ref = useRef();

  useEffect(() => {
    const handler = (event) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [dropdown]);

  const onMouseEnter = () => {
    setDropdown(true);
  };
  const onMouseLeave = () => {
    setDropdown(false);
  };

  return (
    <li
      className={`menu-items ${isFirst ? 'hover:bg-white' : ''}`}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {items.submenu ? (
        <>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? 'true' : 'false'}
            onClick={() => setDropdown((prev) => !prev)}
            className={`flex items-center justify-between ${isFirst === false ? 'bg-white px-[.7rem] py-[.7rem]' : ''} `}
          >
            {items.title}{' '}
            {depthLevel > 0 ? <IoIosArrowForward /> : <FaCaretDown />}
          </button>
          <Dropdown
            submenus={items.submenu}
            dropdown={dropdown}
            depthLevel={depthLevel}
          />
        </>
      ) : (
        <a href="#">{items.title}</a>
      )}
    </li>
  );
};
export default MenuItems;
