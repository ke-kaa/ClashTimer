import './Dashboard.css'
import React, { useState } from 'react' // Import useState
import StatCard from '../../components/Dashboard/StatCard/StatCard';
import CustomDropdown from '../../components/UI/CustomDropdown/CustomDropdown';
import AddVillageCard from '../../components/AddVillageCard/AddVillageCard'; 
import VillageCard from '../../components/Dashboard/VillageCard/VillageCard';
import TH2 from '../../assets/VillageCard/TH2.png'
import TH5 from '../../assets/VillageCard/TH5.png'
import TH6 from '../../assets/VillageCard/TH6.png'
import TH10 from '../../assets/VillageCard/TH10.png'
import TH11 from '../../assets/VillageCard/TH11.png'
import TH16 from '../../assets/VillageCard/TH16.png'
import NavBar from '../../components/NavBar/NavBar';

export default function Dashboard() {
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);

    const stats = [
        { title: 'Villages Linked', value: 3 },
        { title: 'Highest Town Hall Level', value: 16 },
        { title: 'Most Upgraded Account', value: { accountName: 'AccountName', playerTag: '#PlayerTag' } },
        { title: 'Average Town Hall Level', value: 11 },
        { title: 'Average Base Completion', value: '60%' },
        { title: 'Highest XP', value: 220 },
        { title: 'Inactive Accounts Count', value: 2 },
        { title: 'Average Clan War Stars', value: 2 },
    ];

    const cardElements = stats.map((s, i) => (
        <StatCard key={i} className="stat-card" title={s.title} value={s.value} />
    ));

    return (
        <div className='min-h-screen bg-[#0c1220]'>
            <NavBar />
            <p className='font-extrabold text-2xl bg-gradient-to-b from-[#a0e1fd] to-white bg-clip-text text-transparent ml-30 py-10'>Villages Overview</p>

            <div
                className='relative w-[95%] h-[162px] mx-auto flex items-center overflow-hidden px-4 marquee-container'
                style={{
                    borderTop: '1px solid #a0e1fd',
                    borderBottom: '1px solid #a0e1fd',
                    boxShadow: 'inset 0 0 10px rgba(12, 18, 32, 1)',
                }}
            >
                <div className='flex gap-15 animate-loop-scroll'>
                    {cardElements}
                    {cardElements} 
                </div>
            </div>

            <div className='mt-10 mx-30 px-10 flex justify-between items-center'>
                <p >Your Villages are displayed below. Click the 'Add New Village' button to add another.</p>
                <div className="flex items-center gap-4">
                    <CustomDropdown />
                    {/* Add onClick handler to open the modal */}
                    <button onClick={() => setIsAddCardOpen(true)} className="flex items-center gap-2 text-white">
                        {/* The circular icon container */}
                        <div className="relative w-[29px] h-[29px] rounded-full bg-[#1A202C] shadow-[0_0_4px_2px_#a0e1fd]">
                            {/* Vertical bar */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-white rounded-[12px]"></div>
                            {/* Horizontal bar */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[3px] bg-white rounded-[12px]"></div>
                        </div>
                        <span>Add Village</span>
                    </button>
                </div>
            </div>

            {isAddCardOpen && (
                <div
                    onClick={() => setIsAddCardOpen(false)}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
                >
                    {/* Stop propagation to prevent closing when clicking the card itself */}
                    <div onClick={(e) => e.stopPropagation()}>
                        <AddVillageCard />
                    </div>
                </div>
            )}

            {/* <div>
                <VillageCard title={'Kaku'} playerTag={'#L80J80V9G'} townhallLevel={16} townhallIcon={TH16} />
            </div> */}
        </div>
    )
}
