import React from 'react'
import TH15 from '../../assets/TownHallIcons/TH15.png';
import hammerIcon from '../../assets/VillageCard/hammerIcon.png'
import laboratoryIcon from '../../assets/VillageCard/laboratoryIcon.png'
import petIcon from '../../assets/VillageCard/petIcon.png'
import battleDrill from '../../assets/VillageCard/TH15/battleDrill.png'
import diggy from '../../assets/VillageCard/TH15/diggy.png'
import frosty from '../../assets/VillageCard/TH15/frosty.png'
import furnace from '../../assets/VillageCard/TH15/furnace.png'
import phoenix from '../../assets/VillageCard/TH15/phoenix.png'
import poisonLizard from '../../assets/VillageCard/TH15/poisonLizard.png'
import rootRider from '../../assets/VillageCard/TH15/rootRider.png'

export default function Townhall15({ name, playerTag  }) {
    const rootClasses = `w-[1214px] h-[165px] mx-auto rounded-[18px] p-4 relative overflow-hidden bg-transparent shadow-[0_0_10px_2px_#9A83FF]`;

    
    const backgroundDecor = [
        {
            src: poisonLizard,
            width: 60,
            height: 60,
            style: { top: '114px', left: '300px', opacity: 0.8, transform: '' },
        },
        {
            src: frosty,
            width: 50,
            height: 50,
            style: { top: '120px', left: '360px', opacity: 0.8, transform: '' },
        },
        {
            src: diggy,
            width: 64,
            height: 64,
            style: { top: '115px', left: '400px', opacity: 0.8, transform: '' },
        },
        {
            src: phoenix,
            width: 60,
            height: 60,
            style: { top: '115px', left: '440px', opacity: 0.8, transform: '' },
        },
        {
            src: rootRider,
            width: 175,
            height: 140,
            style: { top: '15px', left: '500px', opacity: 0.8, transform: '' },
        },
        {
            src: furnace,
            width: 112,
            height: 112,
            style: { top: '70px', left: '600px', opacity: 0.8, transform: '' },
        },
        {
            src: battleDrill,
            width: 135,
            height: 135,
            style: { top: '65px', left: '900px', opacity: 0.8, transform: '' },
        },
    ];

    return (
        <div className={rootClasses} >
            <div className="absolute inset-0 pointer-events-none z-10">
                {backgroundDecor.map((decor, index) => (
                <img key={decor.src + index} src={decor.src} alt="village accent" width={decor.width} height={decor.height}
                    style={{
                    position: 'absolute',
                    ...decor.style,
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.55))',
                    }}
                />
                ))}
            </div>

            <div className="flex items-center gap-4 z-20 h-full pl-4">
                <img src={TH15} alt="townhall" className="w-[70px] h-[64px] object-contain" />
                
                <div className='flex flex-col gap-5'>
                    <div>
                        <div className="flex-1 text-left">
                        <div className="flex items-center gap-3">
                            <h3 className="text-white text-[24px] font-bold truncate">{name}</h3>
                        </div>
                    </div>
                    {playerTag && <div className="text-[12px] text-white italic mt-1">{playerTag}</div>}
                    </div>
                    <p className="text-sm text-white ml-2">Townhall level: 15</p>
                </div>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-30">
                <a href="">
                    <img src={petIcon} className='w-[26px] h-[23px]' alt="" />
                </a>
                <a href="">
                    <img src={laboratoryIcon} className="w-[59px] h-[59px] -translate-x-4 transform" alt="" />
                </a>
                <a href="">
                    <img src={hammerIcon} className='w-[22px] h-[29px] rotate-[-48deg]' alt="" />
                </a>
            </div> 
        </div>
    );
}
