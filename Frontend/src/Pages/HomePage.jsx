import React from 'react'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col text-white h-screen'>
        <div className='self-center w-[100%] h-60 flex justify-center items-center'>
            <p className='text-3xl' style={{fontFamily:'cursive'}}>HomePage</p>
        </div>
        <button className='w-30 h-10 border-white border-2 cursor-pointer rounded-md m-auto' onClick={()=>navigate('/Authpage')}>Get Started</button>
        {/* <button className='w-30 h-10 border-white border-2 cursor-pointer rounded-md m-auto' onClick={()=>navigate('/Signup_Login')}>Get Started</button> */}
    </div>
  )
}

export default HomePage