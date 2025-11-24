import React, { useState } from 'react'
import './signinPage.css'
import electroWizard from '../../assets/cocAssets/signinPage/electroWizard.png'
import barbarian from '../../assets/cocAssets/signinPage/barb.png'
import wizard from '../../assets/cocAssets/signinPage/wiz.png'
import { login } from '../../services/authServices'
import { Link, useNavigate } from 'react-router-dom' 

export default function SigninPage() {
    const [identifier, setIdentifier] = useState(''); 
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const isEmail = identifier.includes('@');
            const credentials = {
                password,
                [isEmail ? 'email' : 'username']: identifier
            };
            
            await login(credentials);
            navigate('/dashboard');

        } catch (err) {
            setError(err.error || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=' min-h-screen bg-[#0c1220] flex  relative'>
            <div className='flex items-start gap-[7rem] mx-auto my-auto'>
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
                <div className='w-[664px] flex flex-col items-center relative mt-40'>
                    <div className='wizard absolute top-[-138px]'> 
                        <img src={electroWizard} alt="" />
                    </div>
                    <div className='text-center gradient-border-two w-full'>
                        <div className='text-[1.75rem] my-[20px] signin inline-block '>Sign in</div>
                        <form onSubmit={handleLogin} className="flex flex-col items-center w-full px-16">
                            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                            <div className="w-[340px] my-3 rounded-[20px] bg-gradient-to-r from-[#C36B1E] to-[#A0E1FD] p-[1px]">
                                <input 
                                    type="text" 
                                    name="identifier" 
                                    id="identifier" 
                                    required 
                                    placeholder='email or username'
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='w-full bg-[#0c1220] border-none rounded-[20px] px-4 py-2 text-white focus:outline-none'
                                />
                            </div>
                            <p className='ml-50 mt-3 mb-5 text-[0.9rem]'>
                                <Link to="/forgot-password" className='bg-gradient-to-r from-[#C36B1E] to-[#a0e1fd] via-[#a0e1fd] via-70% bg-clip-text text-transparent'>Forgot Password?</Link>
                            </p>
                            
                            {loading ? (
                                <button disabled className='w-[340px] my-4 py-2 rounded-[20px] bg-gray-500 text-black font-semibold font-bold flex items-center justify-center'>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Signing In...</span>
                                </button>
                            ) : (
                                <button type='submit' className='w-[340px] my-4 py-2 rounded-[20px] bg-gradient-to-r from-[#C36B1E] to-[#A0E1FD] text-black font-semibold font-bold'>Login</button>
                            )}

                            <p className='signup-redirect ml-[4rem]'>Don't have an account? <Link to="/signup" className=' bg-[#A0E1FD] bg-clip-text text-transparent'>Sign Up</Link></p>
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
