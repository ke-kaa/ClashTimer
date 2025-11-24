import React from 'react'
import NavBar from '../../components/NavBar/NavBar'
import ProgressBarGroup from '../../components/VillageDetailPage/ProgressBarGroup/ProgressBarGroup'
import PlayerHeader from '../../components/VillageDetailPage/PlayerHeader/PlayerHeader'
import TH16 from '../../assets/VillageCard/TH16.png'
import CategoryTabs from '../../components/VillageDetailPage/CategoryTabs/CategoryTabs'
import UpgradeTable from '../../components/VillageDetailPage/UpgradeTable/UpgradeTable'
import { useParams } from 'react-router-dom'
import { getVillageForDetailPage } from '../../services/accountServices'
import { useEffect } from 'react'
import { useState } from 'react'
const TOWN_HALL_ICONS = import.meta.glob(
    '../../assets/TownHallIcons/TH*.png',
    { eager: true, import: 'default' }
);

export default function VillageDetailPage() {
    const { playerTag } = useParams();
    const [villageDetail, setVillageDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('Defenses');

    useEffect(() => {
        async function fetchAccountDetail() {
            try {
                const response = await getVillageForDetailPage(playerTag);
                setVillageDetail(response);
            } catch (error) {
                setError(error.message || 'Failed to load village detail.');
            } finally {
                setLoading(false);      
            }
        }

        fetchAccountDetail();
    }, [playerTag])

    const resolveTownHallIcon = (level) => {
		const normalized = Number(level) || 0;
		const key = `../../assets/TownHallIcons/TH${normalized}.png`;
		return TOWN_HALL_ICONS[key]
	};

    const name = villageDetail.username;
    const tag = villageDetail.playerTag;
    const tHLevel = villageDetail.townHallLevel
    const townhallImage = resolveTownHallIcon(tHLevel);

    const categoryMap = {
        Defenses: villageDetail.buildings?.filter(b => b.buildingType === 'Defense'),
        Traps: villageDetail.buildings?.filter(b => b.buildingType === 'Trap'),
        Resource: villageDetail.buildings?.filter(b => b.buildingType === 'Resource' || b.buildingType === 'Storage'),
        Army: villageDetail.buildings?.filter(b => b.buildingType === 'Army'),
        Troops: villageDetail.troops?.filter(t => t.troopType !== 'Dark Elixir'),
        'Dark Troops': villageDetail.troops?.filter(t => t.troopType === 'Dark Elixir'),
        Spells: villageDetail.spells,
        Sieges: villageDetail.siege,
        Heroes: villageDetail.heroes,
        Equipment: villageDetail.equipments,
        Pets: villageDetail.pets,
        Walls: villageDetail.walls ? [villageDetail.walls] : [],
    };
    const itemsForActiveTab = categoryMap[activeTab] ?? [];


    return (
        <div className='min-h-screen bg-[#0c1220]'>
            <NavBar />
            <div>
                <div>
                    <PlayerHeader accountName={name} playerTag={tag} townHallIcon={townhallImage} townHallLevel={tHLevel}/>
                    <CategoryTabs activeTab={activeTab} onChange={setActiveTab} />
                    <UpgradeTable category={activeTab} items={itemsForActiveTab} />
                </div>
            </div>
            
        </div>
    )
}
