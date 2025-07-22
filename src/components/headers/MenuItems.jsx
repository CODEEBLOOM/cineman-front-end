import { useEffect, useRef, useState } from 'react';
import Dropdown from './Dropdown';
import { FaCaretDown } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { setMovieTheater } from '@redux/slices/movieTheaterSlice';

const MenuItems = ({ items, depthLevel }) => {
  const [dropdown, setDropdown] = useState(false);
  const dispatch = useDispatch();
  const ref = useRef();

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

  const handleChangeMovieTheater = () => {
    dispatch(setMovieTheater(items));
  };

  return (
    <li
      className={`menu-items ${depthLevel === 0 ? 'hover:!bg-transparent' : ''}`}
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
            className={`flex items-center justify-between ${depthLevel === 1 ? 'px-[.7rem] py-[.7rem]' : ''} `}
          >
            {items.title}&nbsp;
            {depthLevel > 0 ? <IoIosArrowForward size={12} /> : <FaCaretDown />}
          </button>
          <Dropdown
            submenus={items.submenu}
            dropdown={dropdown}
            depthLevel={depthLevel}
          />
        </>
      ) : (
        <p className="hover:text-white" onClick={handleChangeMovieTheater}>
          {items.title}
        </p>
      )}
    </li>
  );
};
export default MenuItems;
