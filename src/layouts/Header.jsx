import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronsLeft, Sun, Moon, Search, Bell, LogOut, User, Settings } from 'lucide-react';
import { useTheme } from '../hooks/use-theme';
import { useLogout } from '../hooks/use-logout';
import profile from '../assets/profile.PNG';


const Header = ({ collapsed, setCollapsed }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { theme, setTheme } = useTheme();
   const { logout } = useLogout();
  
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {

    logout();
    console.log('Ave loged out!');
    handleClose();
  };



  return (
    <header className='relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900'>
      <div className='flex items-center gap-x-3'>
        <button className='btn-ghost size-10' onClick={() => setCollapsed(!collapsed)}>
          <ChevronsLeft className={collapsed ? "rotate-180" : ""}/>
        </button>
        <div className="input">
          <Search size={20} className='text-slate-300'/>
          <input 
            type="text" 
            name='search' 
            id='search' 
            placeholder='search'
            className='w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-white'
          />
        </div>
      </div>
      
      <div className='flex items-center gap-x-3'>
        <button 
          className='btn-ghost size-10' 
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <button className='btn-ghost size-10 relative'>
          <Bell size={20}/>
          {/* Optional notification badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
            2
          </span>
        </button>
        
        {/* Profile dropdown */}
        <div className="relative">
          <button 
            onClick={handleProfileClick}
            className="btn-ghost size-12 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors"
          >
            <img
              src={profile}
              alt="profile"
              className="h-full w-full object-cover rounded-full"
            />
          </button>
          
          {/* Dropdown menu */}
          {anchorEl && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-slate-200 dark:border-slate-700">
              
              
              <button onClick={handleClose} className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                <User size={16} className="mr-3" />
                Profile
              </button>
              
              <button onClick={handleClose} className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                <Settings size={16} className="mr-3" />
                Settings
              </button>
              
              <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut size={16} className="mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = { 
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};

export default Header;