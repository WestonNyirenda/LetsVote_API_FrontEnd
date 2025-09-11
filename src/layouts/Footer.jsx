import React from 'react'

const Footer = () => {
  return (
    <>
      <footer className='flex flex-wrap items-center justify-between gap-4 pt-4'>
        <p className='text-base font-medium text-slate-900 dark:text-slate-50'>2025</p>
        <div className='flex flex-wrap gap-x-2'>
            <a href='#' className='link'>Privacy Policy</a>
            <a href='#' className='link'>Powerd by Weston</a>
        </div>
        </footer>  
    </>
  )
}

export default Footer
