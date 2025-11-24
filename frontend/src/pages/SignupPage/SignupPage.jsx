import React, { useState } from 'react'
import './signupPage.css'
import fireWiz from '../../assets/cocAssets/signupPage/fireWiz.png'
import wiz from '../../assets/cocAssets/signupPage/wiz.png'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../services/authServices';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {

            const userData = await register({username, email, password, confirm_password});
            navigate('/dashboard');

        } catch (err) {
            setError(err.error || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className=' min-h-screen  min-w-screen bg-[#0c1220] flex items-center relative'>
            <div className='flex items-start gap-[9rem] mx-auto my-auto '>
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
                <div className='w-[664px] flex flex-col items-center relative mt-30'>
                    <div className='wizard absolute top-[-130px] right-[600px]'> 
                        <img src={wiz} alt="" />
                    </div>
                    <div className='text-center gradient-border w-full'>
                        <div className='text-[1.75rem] my-[20px] signin inline-block '>Sign Up</div>
                        <form onSubmit={handleRegister} className="flex flex-col items-center w-full px-16">
                            <div className="w-[340px] my-3 rounded-[20px] bg-gradient-to-r from-[#a0e1fd] to-[#C36B1E] p-[1px]">
                                <input 
                                    type="text" 
                                    name="username" 
                                    id="username" 
                                    required 
                                    placeholder='username'
                                    onChange={(e) => setUsername(e.target.value)}
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
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    onChange={(e) => setPassword(e.target.value)}
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
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className='w-full bg-[#0c1220] border-none rounded-[20px] px-4 py-2 text-white focus:outline-none'
                                />
                            </div>

                            {loading ? 
                                <button disabled type='submit' className='w-[340px] mt-7 mb-4 py-2 rounded-[20px] bg-gradient-to-r from-[#a0e1fd] to-[#C36B1E] text-black font-semibold font-bold flex items-center justify-center'>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Signing Up...</span>
                                </button>
                                : <button type='submit' className='w-[340px] mt-7 mb-4 py-2 rounded-[20px] bg-gradient-to-r from-[#a0e1fd] to-[#C36B1E] text-black font-semibold font-bold'>Sign Up</button>
                            }
                            <p className='signup-redirect ml-[10rem]'>Already have an account? <Link to="/signin" className=' bg-[#C36B1E] bg-clip-text text-transparent'>Login here</Link></p>
                        </form>
                    </div>
                    <div className='wizard absolute right-[-150px] bottom-[-60px] '>
                        <img src={fireWiz} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}
