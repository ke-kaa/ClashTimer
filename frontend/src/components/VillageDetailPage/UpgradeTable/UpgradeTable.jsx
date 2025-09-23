import React from 'react'
import TH16 from '../../../assets/VillageCard/TH16.png' // Using TH16 as a placeholder
import UpgradeRow from '../UpgradeRow/UpgradeRow';

// Updated mock data to include all statuses for testing
const data = {
    "defenses": [
        {
            "id": 1,
            "image": TH16,
            "currentLevel": 12,
            "maxLevel": 14,
            "nextLevel": 13,
            "cost": "5.1M",
            "time": "3d 14h",
            "totalCost": "10.5M",
            "totalTime": "7d 4h",
            "status": "Upgrading",
            "progress": 65
        },
        {
            "id": 2,
            "image": TH16,
            "currentLevel": 13,
            "maxLevel": 14,
            "nextLevel": 14,
            "cost": "5.4M",
            "time": "4d 10h",
            "totalCost": "5.4M",
            "totalTime": "4d 10h",
            "status": "Ready"
        },
        {
            "id": 3,
            "image": TH16,
            "currentLevel": 14,
            "maxLevel": 14,
            "status": "Maxed" // Using "Maxed" to match the logic in UpgradeRow
        }
    ],
    "traps": [], // You can add mock data for other categories here
    "army": []
};

export default function UpgradeTable({ category }) {
    const items = data[category.toLowerCase()] || [];

    return (
        <table className="w-[90%] max-w-[1900px] mx-auto text-sm text-left border-collapse">
            <thead>
                <tr className="text-xs text-gray-400 border-y border-gray-800">
                    <th className="p-2 w-24">Item</th>
                    <th className="p-2 text-center">Current/Max Level</th>
                    <th className="p-2 text-center">Next Upgrade Level</th>
                    <th className="p-2 text-center">Next Upgrade Cost</th>
                    <th className="p-2 text-center">Next Upgrade Time</th>
                    <th className="p-2 text-center">Total Upgrade Cost</th>
                    <th className="p-2 text-center">Total Upgrade Time</th>
                    <th className="p-2 text-center">Status</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                    <UpgradeRow key={item.id} {...item} />
                ))}
            </tbody>
        </table>
    );
}

