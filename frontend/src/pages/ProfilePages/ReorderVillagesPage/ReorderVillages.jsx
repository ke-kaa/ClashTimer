import VillageCard from "../../../components/ReorderVillagesVillageCard/VillageCard";
import React, { useState, useRef } from 'react'
import './reorderVillages.css'
import NavBar from "../../../components/NavBar/NavBar";
import SideBar from "../../../components/SideBar/SideBar";
import TH16 from '../../../assets/VillageCard/TH16.png'

export default function ReorderVillages() {
    const initial = [
        { id: 'v1', townHallIcon: TH16, townHallLevel:16, playerTag:'L80V80V9G', accountName:'Kaku' },
        { id: 'v2', townHallIcon: TH16, townHallLevel:16, playerTag:'L80V80V9G', accountName:'K' },
        { id: 'v3', townHallIcon: TH16, townHallLevel:16, playerTag:'L80V80V9G', accountName:'sudiahfids' },
    ];

    const [villages, setVillages] = useState(initial);
    const draggedIndex = useRef(null);

    const handleDragStart = (index) => {
        draggedIndex.current = index;
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (targetIndex) => {
        const from = draggedIndex.current;
        if (from === null || from === undefined) return;
        if (from === targetIndex) {
            draggedIndex.current = null;
            return;
        }

        const updated = [...villages];
        const [moved] = updated.splice(from, 1);
        updated.splice(targetIndex, 0, moved);
        setVillages(updated);
        draggedIndex.current = null;

        updateOrderOnServer(updated);
    };

    async function updateOrderOnServer(newOrder) {
        try {
            await fetch('/api/villages/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: newOrder.map(v => v.id) })
            });
        } catch (err) {
            console.error('Failed to update order on server', err);
        }
    }

    return (
        <div className="bg-[#0c1220] ">
            <NavBar hideProfileIcon={true} />
            <div className="flex villages-container">
                <aside className="flex-shrink-0 h-full bg-[#A0E1FD]/25">
                    <SideBar username={'Keeka'} email={"example@gmail.com"} />
                </aside>
                <main className=" p-20 mx-auto ">
                    {villages.map((v, idx) => (
                        <VillageCard
                            key={v.id}
                            index={idx}
                            townHallIcon={v.townHallIcon}
                            townHallLevel={v.townHallLevel}
                            playerTag={v.playerTag}
                            accountName={v.accountName}
                            draggable={true}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        />
                    ))}
                </main>
            </div>
        </div>
    )
}
