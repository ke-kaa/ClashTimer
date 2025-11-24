import React from 'react';

export default function RedSmallButton({ children, onClick, className = '', type = 'button', ariaLabel }) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`w-[81px] h-[25px] rounded-[12px] bg-red-600 text-white text-[13px] font-semibold flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );
}
