import React from 'react'
import NavBar from '../../../components/NavBar/NavBar'
import './deleteVillage.css'
import VillageCard from '../../../components/DeleteVillagesVillageCard/VillageCard'
import SideBar from "../../../components/SideBar/SideBar";
import TH16 from '../../../assets/VillageCard/TH16.png'


export default function DeleteVilage() {
    return (
        <div className='bg-[#0c1220]'>
            <NavBar hideProfileIcon={true} />
            <div className=' flex villages-container'>
                <aside className="flex-shrink-0 h-full bg-[#A0E1FD]/25">
                    <SideBar username={'Keeka'} email={"example@gmail.com"} />
                </aside>
                <main className='flex villages-container mx-auto p-20'>
                    <VillageCard townHallIcon={TH16} townHallLevel={16} playerTag={'L80V80V9G'} accountName={'Kaku'}/>
                </main>
            </div>
        </div>
    )
}
