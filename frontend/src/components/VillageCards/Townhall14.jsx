import React from 'react'
import TH14 from '../../assets/TownHallIcons/TH14.png';
import hammerIcon from '../../assets/VillageCard/hammerIcon.png'
import laboratoryIcon from '../../assets/VillageCard/laboratoryIcon.png'
import petIcon from '../../assets/VillageCard/petIcon.png'
import druid from '../../assets/VillageCard/TH14/druid.png'
import electroOwl from '../../assets/VillageCard/TH14/electroOwl.png'
import electroTitan from '../../assets/VillageCard/TH14/electroTitan.png'
import flameFlinger from '../../assets/VillageCard/TH14/flameFlinger.png'
import lassi from '../../assets/VillageCard/TH14/lassi.png'
import mightyYak from '../../assets/VillageCard/TH14/mightyYak.png'
import unicorn from '../../assets/VillageCard/TH14/unicorn.png'

export default function Townhall14({ name, playerTag  }) {
    const rootClasses = `w-[1214px] h-[165px] mx-auto rounded-[18px] p-4 relative overflow-visible bg-transparent shadow-[0_0_10px_2px_#24AD7C]`;

    
    const backgroundDecor = [
        {
            src: flameFlinger,
            width: 82,
            height: 92,
            style: { top: '60px', left: '300px', opacity: 0.8, transform: 'scaleX(-1) rotate(-20deg)' },
        },
        {
            src: lassi,
            width: 50,
            height: 50,
            style: { top: '128px', left: '500px', opacity: 0.8, transform: '' },
        },
        {
            src: mightyYak,
            width: 69,
            height: 69,
            style: { top: '115px', left: '530px', opacity: 0.8, transform: '' },
        },
        {
            src: electroOwl,
            width: 45,
            height: 45,
            style: { top: '65px', left: '560px', opacity: 0.8, transform: '' },
        },
        {
            src: unicorn,
            width: 49,
            height: 49,
            style: { top: '122px', left: '590px', opacity: 0.8, transform: '' },
        },
        {
            src: electroTitan,
            width: 120,
            height: 120,
            style: { top: '50px', left: '650px', opacity: 0.8, transform: '' },
        },
        {
            src: druid,
            width: 90,
            height: 90,
            style: { top: '83px', left: '750px', opacity: 0.8, transform: '' },
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
                <img src={TH14} alt="townhall" className="w-[70px] h-[64px] object-contain" />
                
                <div className='flex flex-col gap-5'>
                    <div>
                        <div className="flex-1 text-left">
                        <div className="flex items-center gap-3">
                            <h3 className="text-white text-[24px] font-bold truncate">{name}</h3>
                        </div>
                    </div>
                    {playerTag && <div className="text-[12px] text-white italic mt-1">{playerTag}</div>}
                    </div>
                    <p className="text-sm text-white ml-2">Townhall level: 14</p>
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
