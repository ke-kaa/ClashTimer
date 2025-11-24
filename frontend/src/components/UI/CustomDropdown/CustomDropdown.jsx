import React, { useState } from 'react';

export default function CustomDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Order');
    const options = ['Townhall', 'Name', 'Recent Added', 'Oldest'];

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    // Dynamically adjust button's border radius based on the open state
    const buttonClassName = `w-full bg-[#1A202C] text-white px-2 py-1 flex justify-between items-center gap-2 shadow-[0_0_4px_#a0e1fd] transition-all duration-200 ${isOpen ? 'rounded-t-[12px]' : 'rounded-[12px]'}`;

    return (
        <div className="relative w-[161px]">
            {/* The main button that is always visible */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={buttonClassName}
            >
                <span className="italic">{selectedOption}</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            {/* The dropdown list now uses absolute positioning to float on top */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-[#1A202C] rounded-b-[12px] overflow-hidden z-10 shadow-[0_0_4px_#a0e1fd]">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 text-white italic cursor-pointer hover:bg-[#2D3748] border-t border-gray-700 first:border-t-0"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}