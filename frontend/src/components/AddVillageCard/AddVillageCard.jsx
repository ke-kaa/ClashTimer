import React, { useState } from 'react'
import './addVillageCard.css'
import hashTag from '../../assets/AddVillageCard/hashTag.png'

export default function AddVillageCard({
  name = 'Kaku',
  playerTag = '#L80J80V9G',
  townhallLevel = 15,
  townhallImage = null,
  warStars = 1160,
  xp = 220,
  leagueTrophy = 3300,
  leagueIcon = null,
}) {
  const [query, setQuery] = useState('')

  return (
    <div className="w-[420px] p-6 rounded-[14px] add-village-outer">
      {/* Search input */}
      <div className="my-4 mb-8">
        <div className="relative">
          <div className="flex items-center gap-3 bg-[#07121a] rounded-full px-3 border border-[#21313a]">
            <span className="text-[#fff] font-semibold p-2 text-[1.25rem]">#</span>
            {/* vertical divider between hash and input */}
            <div className="w-[1px] self-stretch bg-[#21313a] rounded" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="player tag"
              className="italic bg-transparent outline-none text-white placeholder:text-[#7f8f96] flex-1"
            />
            <button className="text-[#a0e1fd]" aria-label="search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="11" cy="11" r="6" stroke="#fff" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Result card */}
      <div className="mt-10 rounded-xl bg-[#071825]  border border-[#22333b]">
        <div className="flex justify-end gap-3 m-3.5">
          <button className="px-3 py-1 rounded-md bg-[#2b3b42] text-white text-sm">+ Add</button>
          <button className="px-3 py-1 rounded-md bg-red-600 text-white text-sm">Discard</button>
        </div>
        {/* 1px line below buttons */}
        <div className="border-b border-[#22333b] my-3" />

        <div className="flex items-center gap-4 p-5">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-b from-[#18202b] to-[#0b1216] flex items-center justify-center">
            {/* townhall image or placeholder */}
            {townhallImage ? (
              <img src={townhallImage} alt={`th-${townhallLevel}`} className="w-[80px] h-[80px] object-contain" />
            ) : (
              <div className="w-12 h-12 bg-[#0c1620] rounded" />
            )}
          </div>

          <div className="flex-1">
            <div className="text-white font-bold text-lg">{name}</div>
            <div className="text-[#fff] text-sm mt-1 italic">{playerTag}</div>
            <div className="text-[#fff] text-sm mt-6">Townhall: {townhallLevel}</div>
          </div>

          <div>
            {/* XP badge: 20-edge polygon with number */}
            <div className="relative w-10 h-10">
              <svg viewBox="0 0 100 100" className="w-10 h-10">
                <polygon fill="#1e7be6" points="50,0 65.45,2.45 79.39,9.55 90.45,20.61 97.55,34.55 100,50 97.55,65.45 90.45,79.39 79.39,90.45 65.45,97.55 50,100 34.55,97.55 20.61,90.45 9.55,79.39 2.45,65.45 0,50 2.45,34.55 9.55,20.61 20.61,9.55 34.55,2.45" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">{xp}</div>
            </div>
          </div>
        </div>

        <div className="m-4 flex flex-wrap gap-3 justify-center items-center">
          {/* <div className="px-3 py-1 rounded-full border border-[#26363b] text-[#c6d2d7] flex items-center gap-2">
            <span className="bg-[#ffffff10] rounded-full w-6 h-6 flex items-center justify-center text-sm">🏆</span>
            <span className="text-sm">{leagueTrophy}</span>
          </div> */}

          {leagueIcon && (
            <div className="px-3 py-1 rounded-full border border-[#26363b] text-[#c6d2d7] flex items-center gap-2">
              <img src={leagueIcon} alt="league" className="w-5 h-5" />
              <span className="text-sm">{leagueTrophy}</span>
            </div>
          )}

          <div className="px-3 py-1 rounded-full border border-[#26363b] text-[#c6d2d7] text-sm">War Stars: {warStars}</div>

          {/* league icon + count */}

        </div>
      </div>
    </div>
  )
}
