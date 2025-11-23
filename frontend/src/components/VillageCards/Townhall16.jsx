import React from 'react'
import TH16 from '../../assets/TownHallIcons/TH16.png';
import hammerIcon from '../../assets/VillageCard/hammerIcon.png'
import laboratoryIcon from '../../assets/VillageCard/laboratoryIcon.png'
import petIcon from '../../assets/VillageCard/petIcon.png'
import angryJelly from '../../assets/VillageCard/TH16/angryJelly.png'
import barbBarrel from '../../assets/VillageCard/TH16/barbBarrel.png'
import spiritFox from '../../assets/VillageCard/TH16/spiritFox.png'
import thrower from '../../assets/VillageCard/TH16/thrower.png'
import troopLauncher from '../../assets/VillageCard/TH16/troopLauncher.png'

export default function Townhall16({ name, playerTag  }) {
    const rootClasses = `w-[1214px] h-[165px] mx-auto rounded-[18px] p-4 relative overflow-hidden bg-transparent shadow-[0_0_10px_2px_#D68029] transition-transform duration-200 ease-in-out hover:scale-102`;

    
    const backgroundDecor = [
        {
            src: spiritFox,
            width: 55,
            height: 55,
            style: { top: '118px', left: '300px', opacity: 0.8, transform: '' },
        },
        {
            src: angryJelly,
            width: 60,
            height: 43,
            style: { top: '70px', left: '360px', opacity: 0.8, transform: '' },
        },
        {
            src: thrower,
            width: 118,
            height: 118,
            style: { top: '65px', left: '500px', opacity: 0.8, transform: '' },
        },
        {
            src: barbBarrel,
            width: 113,
            height: 113,
            style: { top: '15px', left: '800px', opacity: 0.8, transform: 'scaleX(-1)' },
        },
        {
            src: troopLauncher,
            width: 127,
            height: 127,
            style: { top: '55px', left: '900px', opacity: 0.8, transform: 'scaleX(-1) rotate(5deg)' },
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
                <img src={TH16} alt="townhall" className="w-[70px] h-[64px] object-contain" />
                
                <div className='flex flex-col gap-5'>
                    <div>
                        <div className="flex-1 text-left">
                        <div className="flex items-center gap-3">
                            <h3 className="text-white text-[24px] font-bold truncate">{name}</h3>
                        </div>
                    </div>
                    {playerTag && <div className="text-[12px] text-white italic mt-1">{playerTag}</div>}
                    </div>
                    <p className="text-sm text-white ml-2">Townhall level: 16</p>
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
