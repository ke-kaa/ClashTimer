import React from 'react'

const tabs = [
    "Defenses", "Traps", "Army", "Resource",
    "Troops", "Dark Troops", "Spells", "Sieges",
    "Heroes", "Equipment", "Pets", "Walls"
];

export default function CategoryTabs() {
    return (
        <div className=" overflow-x-hidden mx-auto  w-[90%] max-w-[1900px]">
            <div className='h-[1px] bg-white w-full mb-5'></div>

            <div className='flex mb-2 justify-between'>
                {tabs.map((tab, i) => (
                    <button
                    key={i}
                    className={`pb-2 border-b-2 ${
                        i === 0 ? "border-yellow-400 text-white" : "border-transparent text-gray-400 hover:text-white"
                    }`}
                    >
                    {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}
