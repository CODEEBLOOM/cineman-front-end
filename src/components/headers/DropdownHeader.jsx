import MenuItems from './MenuItems';
import './Header.css';
import { useSelector } from 'react-redux';

const defaultMovieTheater = {
  title: 'Chọn rạp',
  id: null,
  submenu: [],
};

const DropdownHeader = () => {
  const { movieTheater = defaultMovieTheater, listMovieTheater = [] } =
    useSelector((state) => state.movieTheater ?? {});

  const { user } = useSelector((state) => state.user);

  let movieTheaters = {
    title: movieTheater?.title || defaultMovieTheater.title,
    id: movieTheater?.id ?? defaultMovieTheater.id,
    submenu: Array.isArray(listMovieTheater) ? listMovieTheater : [],
  };

  if (user?.roles?.some((role) => role.roleId === 'RCP')) {
    movieTheaters = {
      title: user?.movieTheater?.name || defaultMovieTheater.title,
      id: user?.movieTheater?.movieTheaterId ?? movieTheater?.id ?? null,
      submenu: [],
    };
  }

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
