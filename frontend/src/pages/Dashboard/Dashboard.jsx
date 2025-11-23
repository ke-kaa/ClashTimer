import './Dashboard.css'
import React, { useState } from 'react' // Import useState
import { Link } from 'react-router-dom';
import StatCard from '../../components/Dashboard/StatCard/StatCard';
import CustomDropdown from '../../components/UI/CustomDropdown/CustomDropdown';
import AddVillageCard from '../../components/AddVillageCard/AddVillageCard'; 
import VillageCard from '../../components/Dashboard/VillageCard/VillageCard';
import TH16 from '../../assets/VillageCard/TH16.png'
import NavBar from '../../components/NavBar/NavBar';
import { getAccountsForDashboard } from '../../services/accountServices';
import { useEffect } from 'react';
import Townhall2 from '../../components/VillageCards/Townhall2';
import Townhall3 from '../../components/VillageCards/Townhall3';
import Townhall4 from '../../components/VillageCards/Townhall4';
import Townhall5 from '../../components/VillageCards/Townhall5';
import Townhall6 from '../../components/VillageCards/Townhall6';
import Townhall7 from '../../components/VillageCards/Townhall7';
import Townhall8 from '../../components/VillageCards/Townhall8';
import Townhall9 from '../../components/VillageCards/Townhall9';
import Townhall10 from '../../components/VillageCards/Townhall10';
import Townhall11 from '../../components/VillageCards/Townhall11';
import Townhall12 from '../../components/VillageCards/Townhall12';
import Townhall13 from '../../components/VillageCards/Townhall13';
import Townhall14 from '../../components/VillageCards/Townhall14';
import Townhall15 from '../../components/VillageCards/Townhall15';
import Townhall16 from '../../components/VillageCards/Townhall16';
import Townhall17 from '../../components/VillageCards/Townhall17';

const TOWNHALL_CARD_COMPONENTS = {
    2: Townhall2,
    3: Townhall3,
    4: Townhall4,
    5: Townhall5,
    6: Townhall6,
    7: Townhall7,
    8: Townhall8,
    9: Townhall9,
    10: Townhall10,
    11: Townhall11,
    12: Townhall12,
    13: Townhall13,
    14: Townhall14,
    15: Townhall15,
    16: Townhall16,
    17: Townhall17,
};

export default function Dashboard() {
    const [accounts, setAccounts] = useState([]);
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        async function fetchAccounts() {
            try {
                const data = await getAccountsForDashboard();
                setAccounts(data);
            } catch (error) {
                setError(error.message || 'Failed to load accounts');
            } finally {
                setLoading(false);
            }
        }
        fetchAccounts();
    }, []);

    const renderAccountCard = (account, index) => {
        const level = Number(account?.townHallLevel ?? account?.townhallLevel ?? account?.townhall);
        const CardComponent = TOWNHALL_CARD_COMPONENTS[level];
        const key = account?._id || account?.playerTag || `account-${index}`;
        const name = account?.username || account?.name || 'Unnamed Village';
        const sanitizedTag = account?.playerTag?.replace(/^#/, '');
        const detailPath = sanitizedTag ? `/village/${encodeURIComponent(sanitizedTag)}` : null;

        const cardNode = CardComponent ? (
            <CardComponent
                name={name}
                playerTag={account?.playerTag}
                townhallLevel={level}
            />
        ) : (
            <VillageCard
                name={name}
                playerTag={account?.playerTag}
                townhallLevel={level}
                townhallIcon={TH16}
            />
        );

        if (detailPath) {
            return (
                <Link
                    key={key}
                    to={detailPath}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a0e1fd] rounded-[18px]"
                >
                    {cardNode}
                </Link>
            );
        }

        return React.cloneElement(cardNode, { key });
    };

    const renderVillageSection = () => {
        if (loading) {
            return <p className="text-center text-white">Loading villages…</p>;
        }

        if (error) {
            return <p className="text-center text-red-400">{error}</p>;
        }

        if (!accounts.length) {
            return <p className="text-center text-white/70">No villages linked yet.</p>;
        }

        return accounts.map(renderAccountCard);
    };

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
        <div className='min-h-screen flex flex-col bg-[#0c1220]'>
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

            <div className='mt-10 w-[1214px] mx-auto px-10 flex justify-between items-center'>
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
            <div className='flex-1 flex flex-col mt-10 pb-10'>
                <div className='flex flex-col gap-10 flex-1'>
                    {renderVillageSection()}
                </div>

                <hr className="border-t border-[#a0e1fd]/40" />
            </div>
        </div>
    )
}
