import React from 'react'
import './signinPage.css'
import electroWizard from '../../assets/cocAssets/signinPage/electroWizard.png'
import barbarian from '../../assets/cocAssets/signinPage/barb.png'
import wizard from '../../assets/cocAssets/signinPage/wiz.png'

export default function SigninPage() {
    return (
        <div className=' min-h-screen bg-[#0c1220] flex relative'>
            <div className='flex gap-[7rem] mx-auto content-container'>
                <div className=' max-w-[460px] pt-30'>
                    <h1 className='text-[3.75rem] text-center font-black'>PROGRESS</h1>
                    <h1 className='text-[3.75rem] text-center font-black ml-70 -mt-10 inline-block bg-gradient-to-r from-white via-white via-70% to-[#C36B1E] bg-clip-text text-transparent'>PULSE</h1>
                    <h3 className='text-[1.75rem] mb-[2rem] text-right bg-gradient-to-r from-white via-white via-70% to-[#C36B1E] bg-clip-text text-transparent'>Get Started with Progress Pulse</h3>
                    <p className='text-left mb-10 bg-gradient-to-r from-white via-white via-75% to-[#C36B1E] bg-clip-text text-transparent'>Progress Pulse helps you plan, time, and track your upgrades so you can progress efficiently. 
                        Built for players who want smarter queues, clear timelines, and fewer idle builders.</p>
                    <p className='mb-3'>What you can do</p>
                    <ul className='list-disc ml-10 mb-10'>
                        <li >Track live timers with full controls</li>
                        <li>Plan and schedule upgrades</li>
                        <li>Visualize progress</li>
                        <li>Avoid builder/lab idle time</li>
                        <li>Keep multiple accounts organized</li>
                    </ul>
                    <p className='text-right bg-gradient-to-r from-white via-white via-70% to-[#C36B1E] bg-clip-text text-transparent'>
                        <a href="#" className=''>Read more here</a>
                    </p>
                </div>
                <div className='w-[664px] flex flex-col items-center relative mt-15'>
                    <div className='wizard absolute top-[-138px]'> 
                        <img src={electroWizard} alt="" />
                    </div>
                    <div className='text-center gradient-border w-full'>
                        <div className='text-[1.75rem] my-[20px] signin inline-block '>Sign in</div>
                        <form action="" className="flex flex-col items-center w-full px-16">
                            <div className="w-[340px] my-3 rounded-[20px] bg-gradient-to-r from-[#C36B1E] to-[#A0E1FD] p-[1px]">
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    required 
                                    placeholder='email or username'
                                    className='w-full bg-[#0c1220] border-none rounded-[20px] px-4 py-2 text-white focus:outline-none'
                                />
                            </div>

                            <div className="w-[340px] my-3 rounded-[20px] bg-gradient-to-r from-[#C36B1E] to-[#A0E1FD] p-[1px]">
                                <input 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    required 
                                    placeholder='password'
                                    className='w-full bg-[#0c1220] border-none rounded-[20px] px-4 py-2 text-white focus:outline-none'
                                />
                            </div>
                            <p className='ml-50 mt-3 mb-5 text-[0.9rem]'>
                                <a href="" className='bg-gradient-to-r from-[#C36B1E] to-[#a0e1fd] via-[#a0e1fd] via-70% bg-clip-text text-transparent'>Forgot Password?</a>
                            </p>
                            <button type='submit' className='w-[340px] my-4 py-2 rounded-[20px] bg-gradient-to-r from-[#C36B1E] to-[#A0E1FD] text-black font-semibold font-bold'>Login</button>
                            <p className='signup-redirect ml-[4rem]'>Don't have an account? <a href="" className=' bg-[#A0E1FD] bg-clip-text text-transparent'>Sign Up</a></p>
                        </form>
                    </div>
                </div>
            </div>
            <div className='absolute right-[0] bottom-[0]' >
                <img src={wizard} alt="" className='w-[150px] h-[150px] inline' />
                <img src={barbarian} alt="" className='w-[150px] h-[150px] inline ml-[-85px]'/>
            </div>
        </div>
    )
}
