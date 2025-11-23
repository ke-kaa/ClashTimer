import React from 'react'
import TH16 from '../../../assets/VillageCard/TH16.png' // Using TH16 as a placeholder
import UpgradeRow from '../UpgradeRow/UpgradeRow';


export default function UpgradeTable({ category, items = [] }) {
    const hasItems = items.length > 0;

    return (
        <div className="w-[90%] max-w-[1900px] mx-auto mt-6 bg-[#0d1624]/60 rounded-2xl border border-white/5 overflow-hidden">
                    {hasItems ? (
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-400 bg-white/5">
                            <th className="p-3 w-48">Item</th>
                            <th className="p-3 text-center">Current / Max</th>
                            <th className="p-3 text-center">Next Level</th>
                            <th className="p-3 text-center">Next Cost</th>
                            <th className="p-3 text-center">Next Time</th>
                            <th className="p-3 text-center">Total Cost</th>
                            <th className="p-3 text-center">Total Time</th>
                            <th className="p-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <UpgradeRow key={item._id || item.id} {...item} />
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="px-6 py-10 text-center text-gray-400 text-sm">
                    No upgrades found for {category}.
                </div>
            )}
        </div>
    );
}

