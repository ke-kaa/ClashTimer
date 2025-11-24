import React from 'react'
import './NavBar.css'
import profile from '../../assets/NavBar/profile.png'
import { Link } from 'react-router-dom'

export default function NavBar({ hideProfileIcon = false }) {
    return (
        <div className={`h-[60px] bg-[#0C1220] text-[1.5rem] flex ${hideProfileIcon ? 'justify-end' : 'justify-between'} items-end px-8 pb-2 [box-shadow:0_4px_14px_0_#a0e1fd]`} >
            <Link to="/dashboard"> 
                <span className='font-extrabold relative top-[15px] bg-gradient-to-b from-white to-[#a0e1fd] bg-clip-text text-transparent'>Progress Pulse</span>
            </Link>
            
            {!hideProfileIcon && (
                <Link to="/add-village" className='relative top-[5px]'>
                    <img src={profile} alt="" className='w-[30px] h-[30px]'/>
                </Link>
            )}
        </div>
    )
}
