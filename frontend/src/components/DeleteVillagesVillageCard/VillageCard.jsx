import React, { useState } from 'react'
import minus from '../../assets/ProfilePages/DeleteVillagePage/minus.png'
import ConfirmDeleteVillage from '../ConfirmDeleteVillage/ConfirmDeleteVillage'

export default function VillageCard({townHallIcon, townHallLevel, accountName, playerTag}) {
    // State to manage the visibility of the confirmation modal
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleOpenConfirm = () => setIsConfirmOpen(true);
    const handleCloseConfirm = () => setIsConfirmOpen(false);

    return (
        <>
            <div
                className='w-[872px] h-[100px] flex border border-[#a0e1fd] rounded-[12px] items-center px-4 my-5'>
                <img src={townHallIcon} alt="" className='w-[60px] h-[60px] mr-5 '/>

                <div className=''>
                    <h2 className='text-[18px] font-bold'>{accountName}</h2>
                    <p className='text-[12px] mb-1 italic font-light text-[#cbd5e1]'># {playerTag}</p>
                    <p className='text-[12px] font-light text-[#cbd5e1]'>Townhall level: {townHallLevel}</p>
                </div>

                <div className="ml-auto flex items-center">
                    <button className="p-2" onClick={handleOpenConfirm}>
                        <img src={minus} alt="Delete Village" className='w-[24px] h-[24px]' />
                    </button>
                </div>
            </div>

            {/* Modal Overlay */}
            {isConfirmOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
                    onClick={handleCloseConfirm} // Close when clicking the background
                >
                    <div onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking the card */}
                        <ConfirmDeleteVillage onClose={handleCloseConfirm} />
                    </div>
                </div>
            )}
        </>
    )
}
