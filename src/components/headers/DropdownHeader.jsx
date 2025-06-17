import { menuItems } from '@utils/menuItems';
import MenuItems from './MenuItems';
const DropdownHeader = () => {
  const depthLevel = 0;
  return (
    <div className="rounded-[1rem] border border-gray-400 px-4 py-2">
      <ul className="menu-items flex items-center justify-between gap-1 text-[1.5vw] font-bold hover:cursor-pointer md:text-[14px]">
        <MenuItems items={menuItems} depthLevel={depthLevel} isFirst={true} />
      </ul>
    </div>
  );
};
export default DropdownHeader;
