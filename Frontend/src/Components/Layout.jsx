import React from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';


function Layout() {
  return (
    <div className='flex h-screen w-full'>
        <div className='min-w-[200px] p-2'>
          <Sidebar />
        </div>
        <div className=' flex-grow rounded-md flex flex-col shadow-lg'>
            <Outlet />
        </div>
    </div>
  );
};

export default Layout;