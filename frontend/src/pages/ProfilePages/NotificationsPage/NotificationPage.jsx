import React, { useState } from 'react'
import './notificationPage.css'
import NavBar from '../../../components/NavBar/NavBar'
import SideBar from '../../../components/SideBar/SideBar'

export default function NotificationPage() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [notifyAllDevices, setNotifyAllDevices] = useState(false);

    return (
        <div className='bg-[#0c1220] min-h-screen'>
            <NavBar hideProfileIcon={true} />
            <div className='flex content-container'>
                <aside className="flex-shrink-0 h-full bg-[#A0E1FD]/25">
                    <SideBar username={'Keeka'} email={"example@gmail.com"} />
                </aside>
                <main className='flex-1 p-10 text-white pl-30 pt-20'>
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-xl font-bold">**Notifications</h2>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={notificationsEnabled}
                                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                                    className="sr-only peer" 
                                />
                                <div className="w-[59px] h-[31px] border border-[#a0e1fd] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[3px] after:bg-white after:border-[#a0e1fd] after:border after:rounded-full after:h-[27px] after:w-[27px] after:transition-all peer-checked:bg-[#a0e1fd]/70"></div>
                            </label>
                        </div>

                        <div className="flex items-center mb-8 gap-4">
                            <label htmlFor="notify-all-devices" className="ml-3 text-md">Notify me on all my devices:</label>
                            <input 
                                id="notify-all-devices"
                                type="checkbox" 
                                checked={notifyAllDevices}
                                onChange={() => setNotifyAllDevices(!notifyAllDevices)}
                                className="appearance-none h-6 w-6 border border-white rounded-sm bg-transparent flex items-center justify-center checked:bg-transparent checked:border-white checked:after:content-['✓'] checked:after:text-white checked:after:text-l checked:after:pl-1"
                            />
                        </div>

                        <div className="text-[16px] space-y-3">
                            <p className='mb-4'>
                                Enabling 'Notify me on all my devices' will send 'Upgrade Complete' notification to every device you have used to login to Progress Rush.
                            </p>
                            <p>
                                Notification for every added village will be sent to the devices.
                            </p>
                            <p className="">** Please note that notifications are sent if 'Push Notifications' is available on your browser.</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
