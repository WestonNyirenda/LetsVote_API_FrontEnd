import React from 'react'
import { forwardRef } from 'react';
import {cn} from '../utils/cn'
import LogoDesign from '../assets/LogoDesign.PNG'
import PropTypes from 'prop-types';

const Sidebar = forwardRef(({collapsed }, ref) => {
  return (
   <aside
  ref={ref}
  className={cn(
    "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white",
    "[transition:width_300ms_cubic-bezier(0.4,0,0.2,1),left_300ms_cubic-bezier(0.4,0,0.2,1),background-color_150ms_cubic-bezier(0.4,0,0.2,1),border_150ms_cubic-bezier(0.4,0,0.2,1)]",
    "dark:border-slate-700 dark:bg-slate-900"
  )}
>
  <div className='flex gap-x-3 p-3'>
<img src={LogoDesign} alt="Logo" className="w-20 h-20 rounded-lg dark:hidden" />

{!collapsed && <p className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">Lets Vote</p>}
  </div>
</aside>
  )
});

Sidebar.displayName = "Sidebar";
Sidebar.prototype = {
  collapsed: PropTypes.bool,
}

export default Sidebar
