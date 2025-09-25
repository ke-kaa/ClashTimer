import './addNewVillage.css'
import React from 'react'
import SideBar from '../../../components/SideBar/SideBar'
import paste from '../../../assets/ProfilePages/AddNewVillagePage/paste.png'
import person from '../../../assets/ProfilePages/AddNewVillagePage/person.png'
import NavBar from '../../../components/NavBar/NavBar'

export default function AddNewVillage() {
    return (
        <div className='bg-[#0c1220]'>
            <NavBar hideProfileIcon={true} />
            <div className="max-w-[1200px] flex flex-row gap-6" style={{ height: 'calc(100vh - 60px)' }}>
                <aside className="flex-shrink-0 h-full bg-[#A0E1FD]/25">
                    <SideBar username={'Keeka'} email={"example@gmail.com"} />
                </aside>

                <main className="flex-1 text-white h-full overflow-auto pl-20 pt-15 pr-4">
                    <p className="mb-10 italic">
                        You can add village by either uploading village data export or loading village data using player tag.
                    </p>

                    <h2 className="text-[22px] mb-6 font-semibold mb-2 ">Upload Village Export</h2>
                    <p className="mb-2 pl-3">To get your village data:</p>
                    <ol className="list-decimal list-inside mb-4 pl-6 leading-[2rem]">
                        <li>Open the in-game Settings menu (or use the link/QR code)</li>
                        <li>Press More Settings</li>
                        <li>Scroll to the bottom to Data Export and press the Copy button</li>
                        <li>Press the Paste Village Data button below</li>
                    </ol>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[#a0e1fd]/75 mb-6 ml-4 text-black font-medium text-[16px] hover:bg-[#a0e1fd]">
                        <img src={paste} alt="Paste icon" className="w-[24px] h-[24px]" />
                        <span>Paste Village Data</span>
                    </button>

                    <h2 className="text-lg font-semibold mb-3">Load account using player tag</h2>
                    <p className="mb-2">Enter your player tag below to load the details of your village:</p>

                    <div className="">
                        <div className='w-[266px] h-[42px] flex items-center bg-[#07121a] rounded-[12px]  border border-[#a0e1fd]'>
                            <span className="text-[#fff] font-medium p-2.5 text-[1.2rem]">#</span>
                            {/* vertical divider between hash and input */}
                            <div className="w-[1.5px] self-stretch bg-[#a0e1fd]/30 rounded" />
                            <input
                            // value={query}
                            // onChange={(e) => setQuery(e.target.value)}
                            placeholder="player tag"
                            className="px-2 italic bg-transparent outline-none text-white placeholder:text-[#7f8f96] flex-1"
                            />
                        </div>

                        <button className="text-black font-medium bg-[#a0e1fd]/80 flex mt-4 p-2 rounded-[12px] items-center ml-4 hover:bg-[#a0e1fd]" aria-label="search">
                            <img src={person} alt="" className='w-[24px] h-[24px] mb-1'/>
                            <span>Load Player Details</span>
                        </button>
                    </div>
                </main>

            </div>
        </div>
    )
}
