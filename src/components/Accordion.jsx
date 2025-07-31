import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

const Accordion = ({ title, subTitle = '', children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={''}>
      <div className={'border-b-2 py-2'}>
        <button
          onClick={() => setOpen(!open)}
          className={'flex w-full items-center justify-between'}
        >
          <span className={'text-[20px] font-bold'}>
            {title}{' '}
            <span className="text-[14px] italic text-primary">{subTitle}</span>
          </span>
          {open ? (
            <span>
              <FaMinus />
            </span>
          ) : (
            <span>
              <FaPlus />
            </span>
          )}
        </button>
      </div>
      <div
        className={`grid overflow-hidden py-4 text-sm text-slate-600 transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className={'overflow-hidden'}>{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
