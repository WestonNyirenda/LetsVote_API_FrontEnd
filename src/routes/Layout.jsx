import React from 'react'
import { useMediaQuery } from '@uidotdev/usehooks'
import Sidebar from '../layouts/Sidebar'
import {cn} from '../utils/cn'
import Header from '../layouts/Header'
import { Outlet } from 'react-router-dom'
import {useRef,useState} from 'react'


const Layout = () => {
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [collapsed, setCollapsed] = useState(!isDesktopDevice);  

  const sidebarRef = useRef(null);
  return (
    <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-900">
      <Sidebar ref={sidebarRef} collapsed={collapsed}/>
      <div className={cn("transition-[margin] duration-300")}>
        <Header/>
        <div className='h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6 '>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Layout
