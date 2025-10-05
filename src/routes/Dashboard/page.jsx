import React from 'react'
import { Package, TrendingUp, User,  BadgeCheck, UserCheck, } from 'lucide-react'
import Footer from '../../layouts/Footer'

import { OverviewData, Candidates, registeredVoters } from '../../constants'
import { useTheme } from '../../hooks/use-theme';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";


const Page = () => {

  const  {theme} = useTheme();

  return (
    <div className='flex flex-col gap-y-4'>
      <h1>Dashboard</h1>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <div className='card'>
          <div className='card-header'>
            <div className='w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600'>
              <Package size={26} />
            </div>
            <p className='card-title'>Total Elections</p>
          </div>

          <div className='card-body bg-slate-100 transition-colors dark:bg-slate-950'>
            <p className='text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50'>9</p>
            <span className='flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:bg-blue-600 dark:text-slate-600 dark:border-blue-600'>
              <TrendingUp size={18} />
              +5%
            </span>
          </div>
        </div>

         <div className='card'>
          <div className='card-header'>
            <div className='w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600'>
              <User size={26} />
            </div>
            <p className='card-title'>Active Elections</p>
          </div>

          <div className='card-body bg-slate-100 transition-colors dark:bg-slate-950'>
            <p className='text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50'>3</p>
            <span className='flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:bg-blue-600 dark:text-slate-600 dark:border-blue-600'>
           
              
            </span>
          </div>
        </div>

         <div className='card'>
          <div className='card-header'>
            <div className='w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600'>
              < BadgeCheck size={26} />
            </div>
            <p className='card-title'>Closed Elections</p>
          </div>

          <div className='card-body bg-slate-100 transition-colors dark:bg-slate-950'>
            <p className='text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50'>1</p>
            <span className='flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:bg-blue-600 dark:text-slate-600 dark:border-blue-600'>
         
             
            </span>
          </div>
        </div>

         <div className='card'>
          <div className='card-header'>
            <div className='w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600'>
              <UserCheck size={26} />
            </div>
            <p className='card-title'>PlaceHolder</p>
          </div>

          <div className='card-body bg-slate-100 transition-colors dark:bg-slate-950'>
            <p className='text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50'>120</p>
            <span className='flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:bg-blue-600 dark:text-slate-600 dark:border-blue-600'>
              
            
            </span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <div className='card col-span-1 md:col-span-2 lg:col-span-4'>
          <div className='card-header'>
            <div className='card-title'>Overview</div>
          </div>
          <div className='card-body p-0'>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                    data={OverviewData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="name"
                      stroke={theme === "light" ? "#475569" : "#94a3b8"}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={6}
                    />

                    <YAxis
                      stroke={theme === "light" ? "#475569" : "#94a3b8"}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={6}
                      tickFormatter={(value) => `${value}`}
                      width={40}
                    />

                    <Tooltip
                      cursor={false}
                      formatter={(value) => `${value}`}
                    />

                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#2563eb"
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>

            </ResponsiveContainer>
          </div>

        </div>
        <div className='card col-span-1 md:col-span-2 lg:col-span-3'>
          <div className='card-header'> Elections</div>
          <div className='card-body p-0 h-[300px] overflow-auto p-0'>
            {Candidates.map((sale)=>(
                <div key={sale.id} className='flex items-center justify-between gap-x-4 pr-2'>
                  <div className='flex items-center gap-x-4'>
                    <img src={sale.image} alt={sale.name} className='size-10 flex-shrink-0 rounded-full object-cover'/>
                    <div className='flex flex-col gap-y-2 '>
                      <p className='font-medium test-slate-900 dark:text-slate-50'>{sale.name}</p>
                      <p className='text-sm font-medium test-slate-600 dark:text-slate-400'>{sale.email}</p>

                    </div>
                    <p className='font-medium text-slate-900 dark:text-slate-50'>{sale.total}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>

      <div className='card'>
        <div className='hard-header'>
          <div className='card-title'>Registered Voters</div>
        </div>
        <div className='card-body p-0'>
          <div className='relative h-[500pz] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]'>
            <table className='table'>
              <thead className='table-header'>
                <tr className='table-row'>
                  <th className='table-head'>#</th>
                  <th className='table-head'>Profile</th>
                  <th className='table-head'>National ID</th>
                  <th className='table-head'>Constituency</th>
                  <th className='table-head'>Reg. Center</th>
                  <th className='table-head'>Status</th>
                </tr>
              </thead>
              <tbody className='table-body'>
                {registeredVoters.map((voter) => (
                  <tr key={voter.id} className='table-row'>
                    <td className='table-cell'>{voter.id}</td>
                    <td className='table-cell'>
                      <div className='flex w-max gap-x-4 items-center'>
                        <img
                          src={voter.profileImage}
                          alt={`${voter.firstName} ${voter.lastName}`}
                          className='size-14 rounded-full object-cover'
                        />
                        <div className='flex flex-col'>
                          <p className='font-medium'>{voter.firstName} {voter.lastName}</p>
                          <span className='font-normal text-slate-600 dark:text-slate-400'>{voter.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className='table-cell'>{voter.nationalId}</td>
                    <td className='table-cell'>{voter.constituency}</td>
                    <td className='table-cell'>{voter.registrationCenter}</td>
                    <td className='table-cell'>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        voter.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {voter.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>

      <Footer/>
    </div>
  )
}

export default Page
