
import { useEffect } from 'react'
import { useMediaQuery } from '@uidotdev/usehooks'

import {cn} from '../utils/cn'
import Header from '../layouts/Header'
import { Outlet } from 'react-router-dom'
import {useRef,useState} from 'react'
import useClickOutside from '../hooks/useClickOutside'

const UserLayout = () => {

      const isDesktopDevice = useMediaQuery("(min-width: 768px)");
      const [collapsed, setCollapsed] = useState(!isDesktopDevice); 


      const sidebarRef = useRef(null);
      
        useEffect(()=>{
          setCollapsed(!isDesktopDevice);
        }, [isDesktopDevice]);
      
        useClickOutside([sidebarRef], () =>{
          if(!isDesktopDevice && !collapsed){
            setCollapsed(true);
          }
        })

  return (
    <div>
        <div className="min-h-screen bg-white transition-colors dark:bg-slate-950">
              <div className={cn("pointer-events-none fixed insert-0 -z-10 bg-black opacity-0 transition-opacity",
                !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30",
              )}/>
            
                <div className="transition-[margin] duration-300 w-full">
                    <Header />  
                    <div className='h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-3'>
                        <Outlet />
                    </div>
                </div>
        </div>
    </div>
  )
}

export default UserLayout
