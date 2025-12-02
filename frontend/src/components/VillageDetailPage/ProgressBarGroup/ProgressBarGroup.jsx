import React from "react";

export default function ProgressBarGroup({ progress }) {
    const buildings = progress.buildings.percentage;
    const heroes = progress.heroes.percentage;
    const troops = progress.troops.percentage;
    const pets = progress.pets.percentage;
    const sieges = progress.sieges.percentage;
    const walls = progress.walls.percentage;

    const progressDisplay = [
        { label: "Structures", value: buildings },
        { label: "Lab", value: troops },
        { label: "Heroes", value: heroes },
        { label: "Pets", value: pets },
        { label: "Equipment", value: 0 },
        { label: "Walls", value: walls },
    ];

    return (
        <div className="w-[300px]">
            <h3 className="font-semibold text-lg mb-3 ml-5">Progress:</h3>
            {progressDisplay.map((p) => (
                <div key={p.label} className="flex items-center gap-3 mb-2">
                    {/* Progress Bar Container */}
                    <div className="relative w-[140px] h-5 bg-gray-700 rounded-full">
                        {/* Filled portion of the bar */}
                        <div
                            className="h-full bg-[#fff]/70 rounded-full"
                            style={{ width: `${p.value}%` }}
                        />
                        <span className="absolute inset-0 left-2 flex items-center text-xs font-bold text-black z-10">
                            {p.value}%
                        </span>
                    </div>
                    <span className="text-sm text-white w-24">{p.label}</span>
                </div>
            ))}
        </div>
    );
}
