import React from 'react'
import { Package, TrendingUp } from 'lucide-react'

const Page = () => {
  return (
    <div className='flex flex-col gap-y-4'>
      <h1>Dashboard</h1>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <div className='card'>
          <div className='card-header'>
            <div className='w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600'>
              <Package size={26} />
            </div>
            <p className='card-title'>Total Votes</p>
          </div>

          <div className='card-body bg-slate-100 transition-colors dark:bg-slate-950'>
            <p className='text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50'>1209</p>
            <span className='flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:bg-blue-600 dark:text-slate-600 dark:border-blue-600'>
              <TrendingUp size={18} />
              +5%
            </span>
          </div>
        </div>

         <div className='card'>
          <div className='card-header'>
            <div className='w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600'>
              <Package size={26} />
            </div>
            <p className='card-title'>Registered Voters</p>
          </div>

          <div className='card-body bg-slate-100 transition-colors dark:bg-slate-950'>
            <p className='text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50'>1209</p>
            <span className='flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:bg-blue-600 dark:text-slate-600 dark:border-blue-600'>
           
              
            </span>
          </div>
        </div>

         <div className='card'>
          <div className='card-header'>
            <div className='w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600'>
              <Package size={26} />
            </div>
            <p className='card-title'>Total Candidates</p>
          </div>

          <div className='card-body bg-slate-100 transition-colors dark:bg-slate-950'>
            <p className='text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50'>1209</p>
            <span className='flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:bg-blue-600 dark:text-slate-600 dark:border-blue-600'>
         
             
            </span>
          </div>
        </div>

         <div className='card'>
          <div className='card-header'>
            <div className='w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600'>
              <Package size={26} />
            </div>
            <p className='card-title'>PlaceHolder</p>
          </div>

          <div className='card-body bg-slate-100 transition-colors dark:bg-slate-950'>
            <p className='text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50'>1209</p>
            <span className='flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:bg-blue-600 dark:text-slate-600 dark:border-blue-600'>
              
            
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
