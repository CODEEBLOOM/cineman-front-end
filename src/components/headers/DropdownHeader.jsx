import { menuItems } from '@utils/menuItems';
import MenuItems from './MenuItems';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
const DropdownHeader = () => {
  const depthLevel = 0;
  return (
    <div className="group relative rounded-[1rem] border border-gray-400 p-2">
      <ul className="flex items-center justify-between gap-1 hover:cursor-pointer">
        <MenuItems items={menuItems} depthLevel={depthLevel} isFirst={true} />
      </ul>
    </div>
  );
};
export default DropdownHeader;
