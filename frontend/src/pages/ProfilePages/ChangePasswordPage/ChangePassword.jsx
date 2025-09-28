import React, { useState } from 'react'
import './changePassword.css'
import NavBar from '../../../components/NavBar/NavBar'
import SideBar from '../../../components/SideBar/SideBar'

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <div className='bg-[#0c1220] min-h-screen'>
            <NavBar hideProfileIcon={true} />
            <div className='flex content-container '>
                <aside className="flex-shrink-0 h-full bg-[#A0E1FD]/25">
                    <SideBar username={'Keeka'} email={"example@gmail.com"} />
                </aside>
                <main className='flex-1 p-10 text-white pl-20 pt-20'>
                    <p className='text-lg font-bold mb-6'>Enter your current password and new password below:</p>
                    
                    <div className="flex flex-col gap-4 max-w-sm">
                        <input 
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current Password"
                            className="bg-[#1A202C] border border-[#a0e1fd]/50 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#a0e1fd] placeholder:italic placeholder:font-light placeholder:text-[15px]"
                        />
                        <input 
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            className="bg-[#1A202C] border border-[#a0e1fd]/50 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#a0e1fd] placeholder:italic placeholder:font-light placeholder:text-[15px]"
                        />
                        <input 
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm New Password"
                            className="bg-[#1A202C] border border-[#a0e1fd]/50 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#a0e1fd] placeholder:italic placeholder:font-light placeholder:text-[15px]"
                        />
                    </div>

                    <div className='mt-6'>
                        <button className="px-6 py-2 bg-[#a0e1fd]/80 text-black font-semibold rounded-lg hover:bg-[#a0e1fd] transition-colors">
                            Change Password
                        </button>
                    </div>
                </main>
            </div>
        </div>
    )
}
