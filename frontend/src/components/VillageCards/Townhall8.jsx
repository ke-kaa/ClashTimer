import React from 'react'
import TH8 from '../../assets/TownHallIcons/TH8.png';
import hammerIcon from '../../assets/VillageCard/hammerIcon.png'
import laboratoryIcon from '../../assets/VillageCard/laboratoryIcon.png'
import petIcon from '../../assets/VillageCard/petIcon.png'
import archerQueen from '../../assets/VillageCard/TH8/archerQueen.png'
import golem from '../../assets/VillageCard/TH8/golem.png'
import pekka from '../../assets/VillageCard/TH8/pekka.png'
import valkyrie from '../../assets/VillageCard/TH8/valkyrie.png'

export default function Townhall8({ name, playerTag  }) {
    const rootClasses = `w-[1214px] h-[165px] mx-auto rounded-[18px] p-4 relative overflow-visible bg-transparent shadow-[0_0_10px_2px_#D68029] transition-transform duration-200 ease-in-out hover:scale-102`;

    
    const backgroundDecor = [
        {
            src: valkyrie,
            width: 70,
            height: 70,
            style: { top: '105px', left: '400px', opacity: 1 },
        },
        {
            src: golem,
            width: 85,
            height: 85,
            style: { top: '94px', left: '470px', opacity: 1, transform: 'rotate(4.54deg)' },
        },
        {
            src: pekka,
            width: 105,
            height: 105,
            style: { top: '77px', left: '550px', opacity: 1, transform: '' },
        },
        {
            src: archerQueen,
            width: 100,
            height: 100,
            style: { top: '75px', left: '630px', opacity: 1, transform: '' },
        },
    ];

    return (
        <div className={rootClasses} >
            <div className="absolute inset-0 pointer-events-none z-10">
                {backgroundDecor.map((decor, index) => (
                <img
                    key={decor.src + index}
                    src={decor.src}
                    alt="village accent"
                    width={decor.width}
                    height={decor.height}
                    style={{
                    position: 'absolute',
                    ...decor.style,
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.55))',
                    }}
                />
                ))}
            </div>

            <div className="flex items-center gap-4 z-20 h-full pl-4">
                <img src={TH8} alt="townhall" className="w-[70px] h-[64px] object-contain" />
                
                <div className='flex flex-col gap-5'>
                    <div>
                        <div className="flex-1 text-left">
                        <div className="flex items-center gap-3">
                            <h3 className="text-white text-[24px] font-bold truncate">{name}</h3>
                        </div>
                    </div>
                    {playerTag && <div className="text-[12px] text-white italic mt-1">{playerTag}</div>}
                    </div>
                    <p className="text-sm text-white ml-2">Townhall level: 8</p>
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
