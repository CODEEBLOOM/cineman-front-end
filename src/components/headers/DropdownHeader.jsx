import { FaCaretDown } from 'react-icons/fa';

const DropdownHeader = () => {
  return (
    <div className="rounded-[1rem] border border-gray-400 px-4 py-2">
      <div className="flex items-center justify-between gap-1 text-[1vw] font-bold hover:cursor-pointer">
        Cineman Quang Trung <FaCaretDown />
      </div>
    </div>
  );
};
export default DropdownHeader;
