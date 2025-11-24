import React from 'react'
import TH13 from '../../assets/TownHallIcons/TH13.png';
import hammerIcon from '../../assets/VillageCard/hammerIcon.png'
import laboratoryIcon from '../../assets/VillageCard/laboratoryIcon.png'
import petIcon from '../../assets/VillageCard/petIcon.png'
import royalChampion from '../../assets/VillageCard/TH13/royalChampion.png'
import apprenticeWarden from '../../assets/VillageCard/TH13/apprenticeWarden.png'
import logLauncher from '../../assets/VillageCard/TH13/logLauncher.png'
import siegeBarracks from '../../assets/VillageCard/TH13/siegeBarracks.png'
import dragonRider from '../../assets/VillageCard/TH13/dragonRider.png'

export default function Townhall13({ name, playerTag  }) {
    const rootClasses = `w-[1214px] h-[165px] mx-auto rounded-[18px] p-4 relative overflow-visible bg-transparent shadow-[0_0_10px_2px_#82C8FC] transition-transform duration-200 ease-in-out hover:scale-102`;

    
    const backgroundDecor = [
        {
            src: royalChampion,
            width: 70,
            height: 82,
            style: { top: '92px', left: '350px', opacity: 1 },
        },
        {
            src: dragonRider,
            width: 92,
            height: 92,
            style: { top: '92px', left: '410px', opacity: 1, transform: '' },
        },
        {
            src: apprenticeWarden,
            width: 87,
            height: 87,
            style: { top: '92px', left: '480px', opacity: 1, transform: '' },
        },
        {
            src: siegeBarracks,
            width: 90,
            height: 90,
            style: { top: '65px', left: '700px', opacity: 1, transform: '' },
        },
        {
            src: logLauncher,
            width: 103,
            height: 103,
            style: { top: '75px', left: '790px', opacity: 1, transform: '' },
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
                <img src={TH13} alt="townhall" className="w-[70px] h-[64px] object-contain" />
                
                <div className='flex flex-col gap-5'>
                    <div>
                        <div className="flex-1 text-left">
                        <div className="flex items-center gap-3">
                            <h3 className="text-white text-[24px] font-bold truncate">{name}</h3>
                        </div>
                    </div>
                    {playerTag && <div className="text-[12px] text-white italic mt-1">{playerTag}</div>}
                    </div>
                    <p className="text-sm text-white ml-2">Townhall level: 13</p>
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
