import React from 'react';
import angryJelly from '../../../assets/VillageCard/TH16/angryJelly.png'
import barbBarrel from '../../../assets/VillageCard/TH16/barbBarrel.png'
import spiritFox from '../../../assets/VillageCard/TH16/spiritFox.png'
import thrower from '../../../assets/VillageCard/TH16/thrower.png'
import troopLauncher from '../../../assets/VillageCard/TH16/troopLauncher.png'

export default function VillageCard({
  name,
  playerTag,
  townhallLevel,
  townhallIcon,
  backgroundImage,
  onClick,
  className = '',
}) {
  const rootClasses = `w-[1214px] h-[165px] mx-auto rounded-[18px] p-4 relative overflow-hidden ${className}`;

  const cardStyle = backgroundImage
    ? { 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0 0 10px 2px #D68029',
        backgroundColor: 'transparent',
      }
    : {
        backgroundColor: 'transparent',
        boxShadow: '0 0 10px 2px #D68029',
      };

  const backgroundDecor = [
    {
      src: angryJelly,
      width: 89,
      height: 61,
      style: { top: '40px', left: '180px', opacity: 0.6 },
    },
    {
      src: barbBarrel,
      width: 113,
      height: 113,
      style: { top: '10px', left: '380px', opacity: 0.55 },
    },
    {
      src: spiritFox,
      width: 55,
      height: 55,
      style: { top: '90px', left: '320px', opacity: 0.65 },
    },
    {
      src: thrower,
      width: 118,
      height: 118,
      style: { top: '5px', left: '540px', opacity: 0.5 },
    },
    {
      src: troopLauncher,
      width: 127,
      height: 127,
      style: { top: '20px', left: '720px', opacity: 0.45 },
    },
  ];

  return (
    <div
      className={rootClasses}
      style={cardStyle}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
    >
      {/* background decor */}
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

      {/* Left column: townhall icon + name */}
      <div className="flex items-start gap-4 z-20">
        {townhallIcon && (
          <img src={townhallIcon} alt="townhall" className="w-12 h-12 object-contain" />
        )}

        <div className="flex-1 text-left">
          <div className="flex items-center gap-3">
            <h3 className="text-white text-xl font-bold truncate">{name}</h3>
            {typeof townhallLevel === 'number' && (
              <span className="text-sm text-white/80 ml-2">Townhall {townhallLevel}</span>
            )}
          </div>
          {playerTag && <div className="text-[13px] text-white/80 mt-1">{playerTag}</div>}
        </div>
      </div>

      {/* Decorative center characters */}
      {/* {characterImages.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="flex gap-4 opacity-80">
            {characterImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={"char-" + idx}
                className={`w-16 h-16 object-contain ${idx > 0 ? 'ml-[-24px]' : ''}`}
                style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))' }}
              />
            ))}
          </div>
        </div>
      )} */}

      {/* Right-side status icons */}
      {/* {statusIcons.length > 0 && (
        <div className="absolute right-4 top-4 flex flex-col gap-3 z-30">
          {statusIcons.map((s, i) => (
            <div key={i} className="relative">
              <img src={s.icon} alt={s.type || 'status'} className="w-8 h-8" />
              {s.count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {s.count}
                </span>
              )}
            </div>
          ))}
        </div>
      )} */}

      {/* overlay to keep text readable */}
    </div>
  );
}
