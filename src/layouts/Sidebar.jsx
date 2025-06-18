import React from 'react'
import { forwardRef } from 'react';
import {navbarLinks} from '../constants/index'
import {cn} from '../utils/cn'
import LogoDesign from '../assets/LogoDesign.PNG'
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const Sidebar = forwardRef(({collapsed }, ref) => {
  return (
    <aside ref={ref} className={cn(
          "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white",
          "[transition:width_300ms_cubic-bezier(0.4,0,0.2,1),left_300ms_cubic-bezier(0.4,0,0.2,1),background-color_150ms_cubic-bezier(0.4,0,0.2,1),border_150ms_cubic-bezier(0.4,0,0.2,1)]",
          "dark:border-slate-700 dark:bg-slate-900",

          collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
          collapsed ? "max-md:-left-full" : "max-md:left-0",
        )}
    >
        <div className='flex gap-x-3 p-3'>
          <img src={LogoDesign} alt="Logo" className="w-20 h-20 rounded-lg dark:hidden" />

          {!collapsed && <p className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">Lets Vote</p>}
        </div>
        <div className='flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]'>
          {navbarLinks.map((navbarLink)=>(
            <nav key={navbarLink.title} className={cn("sidebar-group", collapsed && " md:items-center")}>
              <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>{navbarLink.title}</p>
              {navbarLink.links.map((link)=>(
                <NavLink
                 key={link.label} 
                 to={link.path} 
                 className={cn("sidebar-item", collapsed && "md:w-[45px]")}>
                  <link.icon size={22} className="flex-shrink-0"/>
                  {!collapsed && <p className='whitespace-nowrap'>{link.label }</p>}
                 </NavLink>
              ))}
            </nav>
          ))}
        </div>
    </aside>
  )
});

Sidebar.displayName = "Sidebar";
Sidebar.proptype = {
  collapsed: PropTypes.bool,
}

export default Sidebar
