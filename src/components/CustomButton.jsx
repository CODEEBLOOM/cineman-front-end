import React from 'react';
import { IoTicket } from 'react-icons/io5';

const CustomButton = ({ title }) => {
  return (
    <>
      <div className="relative mt-4 text-center">
        <button className="group relative block w-full overflow-hidden rounded-sm bg-gradient-custom-blue p-1 py-2 text-[16px] font-bold uppercase text-white transition-all duration-500">
          <span className="absolute inset-0 z-0 bg-gradient-custom-blue-hover opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
          <span className="z-2 relative flex items-center justify-center">
            <span className="absolute left-1 top-1/2 -translate-y-1/2 transform">
              <IoTicket size={50} color="rgba(255, 255, 255, .5)" />
            </span>
            {title}
          </span>
        </button>
      </div>
    </>
  );
};

export default CustomButton;
