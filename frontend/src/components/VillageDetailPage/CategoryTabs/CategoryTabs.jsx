import React from 'react'

const tabs = [
    "Defenses", "Traps", "Army", "Resource",
    "Troops", "Dark Troops", "Spells", "Sieges",
    "Heroes", "Equipment", "Pets", "Walls"
];

export default function CategoryTabs({ activeTab, onChange }) {
    return (
        <div className="w-[90%] max-w-[1900px] mx-auto overflow-x-auto">
            <div className="h-[1px] w-full bg-white/30 mb-5" />
            <div className="flex min-w-max gap-6 justify-around">
                {tabs.map((tab) => {
                    const isActive = tab === activeTab;
                    return (
                        <button
                            key={tab}
                            onClick={() => onChange(tab)}
                            className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
                                isActive
                                    ? "text-white border-[#F8CE63]"
                                    : "text-gray-400 border-transparent hover:text-white"
                            }`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
