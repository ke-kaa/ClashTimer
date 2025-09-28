import React, { useState } from 'react'
import './feedback.css'
import NavBar from '../../../components/NavBar/NavBar'
import SideBar from '../../../components/SideBar/SideBar'

export default function Feedback() {
    const [feedbackType, setFeedbackType] = useState('');
    const [message, setMessage] = useState('');
    const options = ['Suggestion', 'Feedback', 'Bug Report'];

    return (
        <div className='bg-[#0c1220] min-h-screen'>
            <NavBar hideProfileIcon={true} />
            <div className='flex content-container '>
                <aside className="flex-shrink-0 h-full bg-[#A0E1FD]/25">
                    <SideBar username={'Keeka'} email={"example@gmail.com"} />
                </aside>
                <main className='flex-1 p-10 text-white pl-20 pt-20'>
                    <p className='text-lg mb-6'>Having problems or got an idea for a new feature? Get in touch below:</p>
                    
                    {/* Checkbox/Radio Group */}
                    <div className='flex flex-column gap-6 mb-4'>
                        {options.map(option => (
                            <div key={option} className="flex items-center">
                                <input 
                                    type="radio" 
                                    id={option} 
                                    name="feedbackType" 
                                    value={option}
                                    checked={feedbackType === option}
                                    onChange={(e) => setFeedbackType(e.target.value)}
                                    className="appearance-none w-5 h-5 bg-transparent border-2 border-[#a0e1fd] rounded-full checked:bg-[#a0e1fd] checked:border-transparent focus:outline-none focus:ring-2 focus:ring-[#a0e1fd]/50"
                                />
                                <label htmlFor={option} className="ml-2 text-md">{option}</label>
                            </div>
                        ))}
                    </div>

                    {/* Text Area */}
                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="w-[596px] h-[222px] bg-[#1A202C] border border-gray-600 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-[#a0e1fd]"
                    />

                    {/* Send Button */}
                    <div>
                        <button className="px-6 py-2 bg-[#a0e1fd]/80 text-black font-semibold rounded-lg hover:bg-[#a0e1fd] transition-colors">
                            Send
                        </button>
                    </div>
                </main>
            </div>
        </div>
    )
}
