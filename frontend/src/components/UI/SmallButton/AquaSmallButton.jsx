import React from 'react';

export default function AquaSmallButton({ children, onClick, className = '', type = 'button', ariaLabel }) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`w-[81px] h-[25px] rounded-[12px] bg-[#a0e1fd] text-black text-[13px] font-semibold flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );
}
