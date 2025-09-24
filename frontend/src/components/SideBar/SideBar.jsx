import "./sideBar.css"
import React from 'react'
import { Link } from 'react-router-dom'

export default function SideBar({username, email}) {
    return (
        <div className="w-[238px] flex flex-col h-full justify-between text-center box-border border-r border-[#a0e1fd]">
            <div className="space-y-0">
                <Link to="/dashboard" className="sidebar-link block h-[58px]  flex items-center justify-center text-[16px] text-white/50  hover:bg-[#a0e1fd]/50 hover:text-white m-0">Home</Link>
                <Link to="/add-village" className="sidebar-link block h-[58px]  flex items-center justify-center text-[16px] text-white/50  hover:bg-[#a0e1fd]/50 hover:text-white m-0">Add a new village</Link>
                <Link to="/reorder-villages" className="sidebar-link block h-[58px]  flex items-center justify-center text-[16px] text-white/50  hover:bg-[#a0e1fd]/50 hover:text-white m-0">Reorder villages</Link>
                <Link to="/delete-village" className="sidebar-link block h-[58px]  flex items-center justify-center text-[16px] text-white/50  hover:bg-[#a0e1fd]/50 hover:text-white m-0">Delete a village</Link>
                <Link to="/notifications" className="sidebar-link block h-[58px]  flex items-center justify-center text-[16px] text-white/50  hover:bg-[#a0e1fd]/50 hover:text-white m-0">Notifications</Link>
                <Link to="/feedback" className="sidebar-link block h-[58px]  flex items-center justify-center text-[16px] text-white/50  hover:bg-[#a0e1fd]/50 hover:text-white m-0">Feedback/Support</Link>
                <Link to="/change-password" className="sidebar-link block h-[58px]  flex items-center justify-center text-[16px] text-white/50  hover:bg-[#a0e1fd]/50 hover:text-white m-0">Change Password</Link>
                <button className="sidebar-link block h-[58px] w-full flex items-center justify-center text-[16px] text-white/50  hover:bg-[#a0e1fd]/50 hover:text-white m-0">Logout</button>
            </div>
            <div className="mt-6 text-sm text-gray-300 pb-15">
                <p className="italic text-[14px]">username:</p>
                <p className=" font-medium text-[16px] mb-8">{username}</p>
                <p className="italic text-[14px] mt-2">email:</p>
                <p className="font-medium text-[16px]">{email}</p>
            </div>
        </div>
    )
}
