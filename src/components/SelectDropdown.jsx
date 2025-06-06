import { ClickAwayListener } from '@mui/material';
import { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
const SelectDropdown = ({ options, defaultOption }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const handleClickAway = () => {
    setIsDropdownVisible(false);
  };

  const handleSelectedOption = (option) => {
    setSelectedOption(option);
    setIsDropdownVisible(false);
  };
  const dropdownContent = (
    <div className="absolute z-10 w-full rounded bg-neutral-700 shadow-xl">
      {options.map((option, index) => (
        <div
          key={index}
          onClick={() => handleSelectedOption(option)}
          className="cursor-pointer px-3 py-2 text-neutral-100 hover:bg-neutral-600"
        >
          {option}
        </div>
      ))}
    </div>
  );
  return (
    <div className="flex h-full w-full justify-center pt-10">
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className="relative">
          <div
            onClick={() => setIsDropdownVisible(!isDropdownVisible)}
            className="flex h-8 w-60 cursor-pointer items-center justify-between rounded border border-neutral-100 px-3 py-2 text-[15px] text-neutral-100 shadow-xl"
          >
            {selectedOption}
            <FaCaretDown
              className={`${isDropdownVisible ? 'rotate-180 transition-all' : ''}`}
            />
          </div>
          {isDropdownVisible && dropdownContent}
        </div>
      </ClickAwayListener>
    </div>
  );
};
export default SelectDropdown;
