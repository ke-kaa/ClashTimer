import React from 'react';

export default function VillageCard({
  title,
  playerTag,
  townhallLevel,
  townhallIcon,
  characterImages = [],
  backgroundImage,
  statusIcons = [],
  onClick,
  variant = 'full',
  className = '',
}) {
  const rootClasses = `w-full rounded-[18px] p-4 relative overflow-hidden ${className}`;

  const cardStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(6,8,15,0.65), rgba(6,8,15,0.65)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { backgroundColor: '#0b0f16' };

  return (
    <div
      className={rootClasses}
      style={cardStyle}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
    >
      {/* Left column: townhall icon + title */}
      <div className="flex items-start gap-4 z-20">
        {townhallIcon && (
          <img src={townhallIcon} alt="townhall" className="w-12 h-12 object-contain" />
        )}

        <div className="flex-1 text-left">
          <div className="flex items-center gap-3">
            <h3 className="text-white text-xl font-bold truncate">{title}</h3>
            {typeof townhallLevel === 'number' && (
              <span className="text-sm text-white/80 ml-2">Townhall {townhallLevel}</span>
            )}
          </div>
          {playerTag && <div className="text-[13px] text-white/80 mt-1">{playerTag}</div>}
        </div>
      </div>

      {/* Decorative center characters */}
      {characterImages.length > 0 && (
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
      )}

      {/* Right-side status icons */}
      {statusIcons.length > 0 && (
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
      )}

      {/* overlay to keep text readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-0" />
    </div>
  );
}
