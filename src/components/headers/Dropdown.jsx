import MenuItems from './MenuItems';

const Dropdown = ({ submenus, dropdown, depthLevel }) => {
  depthLevel = depthLevel + 1;
  const dropdownClass = depthLevel > 1 ? 'dropdown-submenu' : '';
  return (
    <ul
      className={`dropdown top-[1rem min-w-[6rem] md:top-[2rem] lg:top-[2.5rem] lg:min-w-[10rem] ${dropdownClass} ${dropdown ? 'show' : ''} before:absolute before:left-0 before:right-0 before:top-0 before:mt-[-3rem] before:h-[3rem] before:content-['']`}
    >
      <div>
        {submenus.map((submenu, index) => (
          <MenuItems items={submenu} key={index} depthLevel={depthLevel} />
        ))}
      </div>
    </ul>
  );
};
export default Dropdown;
