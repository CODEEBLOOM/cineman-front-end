import MenuItems from './MenuItems';
import './Header.css';
import { useSelector } from 'react-redux';
const DropdownHeader = () => {
  const { movieTheater, listMovieTheater } = useSelector(
    (state) => state.movieTheater
  );

  const movieTheaters = {
    title: movieTheater.title,
    id: movieTheater.id,
    submenu: listMovieTheater,
  };

  const depthLevel = 0;
  return (
    <div className="group relative flex rounded-2xl border border-gray-400 px-4 py-1">
      <ul className="ul-menu-items flex items-center justify-between gap-1 hover:cursor-pointer">
        <MenuItems items={movieTheaters} depthLevel={depthLevel} />
      </ul>
    </div>
  );
};
export default DropdownHeader;
