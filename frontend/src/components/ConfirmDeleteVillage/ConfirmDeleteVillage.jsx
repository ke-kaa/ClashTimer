import React from 'react'
import danger from '../../assets/ProfilePages/DeleteVillagePage/danger.png'

export default function ConfirmDeleteVillage({ onClose }) {
    return (
        <div className='w-[321px] h-[210px] border border-[#a0e1fd] rounded-[16px] bg-[#0c1220] flex flex-col items-center justify-center p-4 text-white text-center'>
            <img src={danger} alt="danger icon" className='w-[33px] h-[33px] mb-2'/>
            <p className='font-semibold text-[18px] mb-2'>Delete a village</p>
            <p className='text-[13px] mb-8'>Are you sure you want to delete this village?</p>
            <div className='flex gap-8 mb-2'>
                <button className='w-[81px] h-[25px] bg-red-500/80 text-white hover:bg-red-500 rounded-[12px] transition-colors'>
                    Delete
                </button>
                
                <button onClick={onClose} className='w-[81px] h-[25px] bg-[#a0e1fd]/80 text-black hover:bg-[#a0e1fd] rounded-[12px] transition-colors'>
                    Cancel
                </button>
            </div>
        </div>
    )
}
