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
  const hasSubmenu = Array.isArray(items?.submenu) && items.submenu.length > 0;
  const isSelectableMovieTheater = items?.kind === 'movieTheater' && items?.id != null;
  const isReadonly = items?.kind === 'readonly';

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
    if (hasSubmenu) {
      setDropdown(true);
    }
  };

  const onMouseLeave = () => {
    if (hasSubmenu) {
      setDropdown(false);
    }
  };

  const handleToggleDropdown = () => {
    if (depthLevel === 1 && hasSubmenu) {
      dispatch(setMovieTheater(items.submenu[0]));
    }

    setDropdown((prev) => !prev);
  };

  const handleChangeMovieTheater = () => {
    if (!isSelectableMovieTheater) {
      return;
    }

    dispatch(setMovieTheater(items));
    setDropdown(false);
  };

  const itemClassName = isSelectableMovieTheater
    ? 'hover:text-white'
    : isReadonly
      ? ''
      : 'cursor-default text-slate-400';

  return (
    <li
      className={`menu-items ${depthLevel === 0 ? 'hover:!bg-transparent' : ''}`}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {hasSubmenu ? (
        <>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? 'true' : 'false'}
            onClick={handleToggleDropdown}
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
        <button
          type="button"
          className={itemClassName}
          onClick={handleChangeMovieTheater}
        >
          {items.title}
        </button>
      )}
    </li>
  );
};
export default MenuItems;
