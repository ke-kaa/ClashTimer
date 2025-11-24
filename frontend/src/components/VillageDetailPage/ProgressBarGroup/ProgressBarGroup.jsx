import React from 'react'

const progress = [
    { label: "Structures", value: 93 },
    { label: "Lab", value: 90 },
    { label: "Heroes", value: 71 },
    { label: "Pets", value: 32 },
    { label: "Equipment", value: 83 },
    { label: "Walls", value: 94 },
];

export default function ProgressBarGroup() {
    return (
        <div className='w-[300px]'>
            <h3 className="font-semibold text-lg mb-3 ml-5">Progress:</h3>
            {progress.map((p) => (
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
    )
}
