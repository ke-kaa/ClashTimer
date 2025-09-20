import React from 'react'
import './signupPage.css'
import fireWiz from '../../assets/cocAssets/signupPage/fireWiz.png'
import wiz from '../../assets/cocAssets/signupPage/wiz.png'

export default function SignupPage() {
    return (
        <div className=' min-h-screen bg-[#0c1220] flex relative'>
            <div className='flex gap-[7rem] mx-auto content-container'>
                <div className=' max-w-[460px] pt-30'>
                    <h1 className='text-[3.75rem] text-center font-black'>PROGRESS</h1>
                    <h1 className='text-[3.75rem] text-center font-black ml-70 -mt-10 inline-block bg-gradient-to-r from-white via-white via-70% to-[#A0E1FD] bg-clip-text text-transparent'>PULSE</h1>
                    <h3 className='text-[1.75rem] mb-[2rem] text-right bg-gradient-to-r from-white via-white via-70% to-[#A0E1FD] bg-clip-text text-transparent'>Get Started with Progress Pulse</h3>
                    <p className='text-left mb-10 bg-gradient-to-r from-white via-white via-75% to-[#A0E1FD] bg-clip-text text-transparent'>Progress Pulse helps you plan, time, and track your upgrades so you can progress efficiently. 
                        Built for players who want smarter queues, clear timelines, and fewer idle builders.</p>
                    <p className='mb-3'>What you can do</p>
                    <ul className='list-disc ml-10 mb-10'>
                        <li >Track live timers with full controls</li>
                        <li>Plan and schedule upgrades</li>
                        <li>Visualize progress</li>
                        <li>Avoid builder/lab idle time</li>
                        <li>Keep multiple accounts organized</li>
                    </ul>
                    <p className='text-right bg-gradient-to-r from-white via-white via-70% to-[#A0E1FD] bg-clip-text text-transparent'>
                        <a href="#" className=''>Read more here</a>
                    </p>
                </div>
                <div className='w-[664px] flex flex-col items-center relative mt-20'>
                    <div className='wizard absolute top-[-130px] right-[600px]'> 
                        <img src={wiz} alt="" />
                    </div>
                    <div className='text-center gradient-border w-full'>
                        <div className='text-[1.75rem] my-[20px] signin inline-block '>Sign Up</div>
                        <form action="" className="flex flex-col items-center w-full px-16">
                            <div className="w-[340px] my-3 rounded-[20px] bg-gradient-to-r from-[#a0e1fd] to-[#C36B1E] p-[1px]">
                                <input 
                                    type="text" 
                                    name="username" 
                                    id="username" 
                                    required 
                                    placeholder='username'
                                    className='w-full bg-[#0c1220] border-none rounded-[20px] px-4 py-2 text-white focus:outline-none'
                                />
                            </div>
                            
                            <div className="w-[340px] my-3 rounded-[20px] bg-gradient-to-r from-[#a0e1fd] to-[#C36B1E] p-[1px]">
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    required 
                                    placeholder='email'
                                    className='w-full bg-[#0c1220] border-none rounded-[20px] px-4 py-2 text-white focus:outline-none'
                                />
                            </div>

                            <div className="w-[340px] my-3 rounded-[20px] bg-gradient-to-r from-[#a0e1fd] to-[#C36B1E] p-[1px]">
                                <input 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    required 
                                    placeholder='password'
                                    className='w-full bg-[#0c1220] border-none rounded-[20px] px-4 py-2 text-white focus:outline-none'
                                />
                            </div>
                            
                            <div className="w-[340px] my-3 rounded-[20px] bg-gradient-to-r from-[#a0e1fd] to-[#C36B1E] p-[1px]">
                                <input 
                                    type="password" 
                                    name="confirm-password" 
                                    id="confirm-password" 
                                    required 
                                    placeholder='confirm password'
                                    className='w-full bg-[#0c1220] border-none rounded-[20px] px-4 py-2 text-white focus:outline-none'
                                />
                            </div>

                            
                            <button type='submit' className='w-[340px] mt-7 mb-4 py-2 rounded-[20px] bg-gradient-to-r from-[#a0e1fd] to-[#C36B1E] text-black font-semibold font-bold'>Login</button>
                            <p className='signup-redirect ml-[10rem]'>Already have an account? <a href="" className=' bg-[#C36B1E] bg-clip-text text-transparent'>Login here</a></p>
                        </form>
                    </div>
                    <div className='wizard absolute right-[-150px] bottom-[-40px]'>
                        <img src={fireWiz} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}
