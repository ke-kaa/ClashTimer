import React, { useState, useRef, useEffect } from 'react'

export default function VillageCard({index, townHallIcon, accountName, playerTag, townHallLevel, draggable, onDragStart, onDragOver, onDrop}) {
    const [isDragging, setIsDragging] = useState(false);
    const allowDragRef = useRef(false);
    const draggedOnceRef = useRef(false);

    useEffect(() => {
        const onMouseUp = () => {
            allowDragRef.current = false;
            draggedOnceRef.current = false;
        };
        document.addEventListener('mouseup', onMouseUp);
        return () => document.removeEventListener('mouseup', onMouseUp);
    }, []);

    const handleMouseDownOnHandle = (e) => {
        allowDragRef.current = true;
        draggedOnceRef.current = false;
    };

    const handleDragStart = (e) => {
        if (!allowDragRef.current) {
            e.preventDefault();
            return;
        }
        setIsDragging(true);
        draggedOnceRef.current = true;
        try { e.dataTransfer.effectAllowed = 'move'; } catch (err) {}
        onDragStart?.(index);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        allowDragRef.current = false;
        draggedOnceRef.current = false;
    };

    return (
        <div
            className={
                `w-[872px] h-[100px] flex border border-[#a0e1fd] rounded-[12px] items-center px-4 my-5 ` +
                `transition-all duration-150 ` +
                (isDragging ? 'opacity-100 scale-105 z-10 shadow-[0_10px_30px_rgba(0,0,0,0.6)]' : '')
            }
            draggable={draggable}
            onDragStart={handleDragStart}
            onDragOver={(e) => onDragOver?.(e)}
            onDrop={() => onDrop?.(index)}
            onDragEnd={handleDragEnd}
        >
            <img src={townHallIcon} alt="" className='w-[60px] h-[60px] mr-5 '/>

            <div className=''>
                <h2 className='text-[18px] font-bold'>{accountName}</h2>
                <p className='text-[12px] mb-1 italic font-light text-[#cbd5e1]'># {playerTag}</p>
                <p className='text-[12px] font-light text-[#cbd5e1]'>Townhall level: {townHallLevel}</p>
            </div>

            <div className="ml-auto flex items-center">
                <button
                    aria-label="drag-handle"
                    className="p-2 cursor-grab"
                    onMouseDown={handleMouseDownOnHandle}
                >
                    <svg width="23" height="20" viewBox="0 0 23 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                        <rect x="0" y="0" width="23" height="2" rx="1" fill="currentColor"/>
                        <rect x="0" y="7.5" width="23" height="2" rx="1" fill="currentColor"/>
                        <rect x="0" y="15" width="23" height="2" rx="1" fill="currentColor"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}
