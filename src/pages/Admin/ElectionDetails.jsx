import react from "react"
const ElectionDetails = () => {
    return(
        <>
   
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-slate-700">
                    Election Details
                </h2>
                
               <div className="flex flex-row gap-x-2 p-4">
                    <div className="card basis-2/3 bg-white rounded-2xl shadow-lg p-6 text-center text-lg font-semibold text-gray-700">
                       <div className='card-header'>
                            <div className='card-title'>Statistics</div>
                        </div>
                    </div>
                    <div className=" card basis-1/3 bg-white rounded-2xl shadow-lg p-6 text-center text-lg font-semibold text-gray-700">
                        <div className='card-header'>
                            <div className='card-title'>Candidates</div>
                        </div>
                        <div className='card-body p-0 h-[300px] overflow-auto p-0'>
                            <div  className='flex items-center justify-between gap-x-4 pr-2'>
                                <div className='flex items-center gap-x-4'>
                                    <img src="" alt="" className='size-10 flex-shrink-0 rounded-full object-cover'/>
                                    <div className='flex flex-col gap-y-2 '>
                                    <p className='font-medium test-slate-900 dark:text-slate-50'>zzz</p>
                                    <p className='text-sm font-medium test-slate-600 dark:text-slate-400'>ccc</p>

                                    </div>
                                    <p className='font-medium text-slate-900 dark:text-slate-50'>111</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
           
        </>
    )
}

export default ElectionDetails