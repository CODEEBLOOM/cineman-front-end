import { CircularProgress } from '@mui/material';
import React from 'react';
import { IoTicket } from 'react-icons/io5';

const CustomButton = ({ title, isLoading = false }) => {
  return (
    <>
      <div className="relative text-center">
        <button className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-gradient-custom-blue p-1 py-2 text-[16px] font-bold uppercase text-white transition-all duration-500">
          {/* Nền hover */}
          <span className="absolute inset-0 z-0 bg-gradient-custom-blue-hover opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>

          {/* Icon vé bên trái */}
          <span className="absolute left-1 top-1/2 -translate-y-1/2 transform">
            <IoTicket size={50} color="rgba(255, 255, 255, .5)" />
          </span>

          {/* Spinner giữ chỗ */}
          <span className="relative z-10 flex h-5 w-5 items-center justify-center">
            {isLoading && (
              <CircularProgress size={20} thickness={2} color="inherit" />
            )}
          </span>

          {/* Text */}
          <span className="relative z-10">{title}</span>
          {/* Spinner giữ chỗ */}
          <span className="relative z-10 flex h-5 w-5 items-center justify-center"></span>
        </button>
      </div>
    </>
  );
};

export default CustomButton;
