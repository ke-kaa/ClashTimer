import React from 'react'
import NavBar from '../../components/NavBar/NavBar'
import ProgressBarGroup from '../../components/VillageDetailPage/ProgressBarGroup/ProgressBarGroup'
import PlayerHeader from '../../components/VillageDetailPage/PlayerHeader/PlayerHeader'
import TH16 from '../../assets/VillageCard/TH16.png'
import CategoryTabs from '../../components/VillageDetailPage/CategoryTabs/CategoryTabs'
import UpgradeTable from '../../components/VillageDetailPage/UpgradeTable/UpgradeTable'

export default function VillageDetailPage() {
    return (
        <div className='min-h-screen bg-[#0c1220]'>
            <NavBar />
            <div>
                <div>
                    <PlayerHeader accountName={"Kaku"} playerTag={"L80V80V9G"} townHallIcon={TH16} townHallLevel={16}/>
                    <CategoryTabs />
                    <UpgradeTable category={'defenses'} />
                </div>
            </div>
            
        </div>
    )
}
