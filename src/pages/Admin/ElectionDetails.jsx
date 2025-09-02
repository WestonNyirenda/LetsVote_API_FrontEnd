import react from "react"
import { useState, useEffect } from "react"
const ElectionDetails = () => {
    const [loading, setLoading] = useState(true);
    const [candidates, setCandidates] = useState([]);
    const [error, setError] = useState(null);
    const [ isModalOpen, setIsModalOpen] = useState(false)


    const fetchCandidates = async ()=>{

        try{
            setLoading(true);

            const response = await fetch('http://localhost:5231/api/Candidate',{
                method: "Get",
                headers:{accept: "application/json"}
             });

            if(!response.ok){
                throw new Error("Failed to load candidates")
            }

            const data = await response.json();
            setCandidates(data); //am saving the state here
            console.log(data)
        }catch(err){
            console.error("Error:", err);
            setError(err.method);
        }finally{
            setLoading(false);
        }

       
    };
    useEffect(()=>{
        fetchCandidates();
    }, []);

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

                    <div className="card basis-1/3 bg-white rounded-2xl shadow-lg p-1 text-center">
                        <div className='card-header mb-4 justify-between'>
                            <div className='card-title text-xl text-gray-800 p-3'>Candidates</div>
                            <div className="mb-4 flex justify-end">
                            <button 
                                onClick={() => { setIsModalOpen(true); }}
                                className="bg-teal-400 hover:bg-teal-500 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Add Candidate
                            </button>
                            </div>
                        </div>
                        
                        <div className='card-body h-[300px] overflow-auto'>
                            {candidates.map((e) => (
                            <div  key={e.id} className='flex items-start justify-between p-1 mb-2 rounded-lg hover:bg-teal-50 transition-all duration-200 border border-gray-100'>
                                <div className='flex items-center gap-x-4'>
                                    <img 
                                        src={`http://localhost:5231${e.imageUrl}`} 
                                        
                                        className='size-10 flex-shrink-0 rounded-full object-cover border-2 border-white shadow-sm'
                                    />
                                    <div className='flex flex-col text-left'>
                                        <p className='font-semibold text-slate-900'>{e.firstName} {e.lastName}</p>
                                        <p className='text-sm text-slate-500'></p>
                                    </div>
                                </div>
                                <div className='flex items-center'>
                                    <button className='text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-200 transition-colors'>
                                        View
                                    </button>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>

             {/*the modal*/}  

                        {isModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-100">
                                <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                                
                                {/* Close button */}
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>

                                {/* Modal Header */}
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Add Candidate
                                </h3>

                                {/* Modal Body (example form) */}
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                        First Name
                                        </label>
                                        <input
                                        type="text"
                                        name="firstName"
                                        required
                                        className="mt-1 block w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                        Last Name
                                        </label>
                                        <input
                                        type="text"
                                        name="lastName"
                                        required
                                        className="mt-1 block w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                                        />
                                    </div>

                                    {/* Age */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                        Age
                                        </label>
                                        <input
                                        type="number"
                                        name="age"
                                        min="18"
                                        required
                                        className="mt-1 block w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                        Description
                                        </label>
                                        <textarea
                                        name="description"
                                        rows="3"
                                        className="mt-1 block w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                                        ></textarea>
                                    </div>

                                   

                                   

                                    {/* Position */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                        Position
                                        </label>
                                        <select
                                        name="positionId"
                                        className="mt-1 block w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                                        >
                                        <option value="">Select Position</option>
                                        <option value="1">President</option>
                                        <option value="2">Vice President</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Upload Image
                                        </label>
                                        <input
                                            type="file"
                                            className="mt-1 block w-full text-sm text-gray-600"
                                        />
                                    </div>
                                </form>

                                {/* Modal Footer */}
                                <div className="mt-6 flex justify-end gap-2">
                                    <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                    >
                                    Cancel
                                    </button>
                                    <button
                                    type="submit"
                                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                                    >
                                    Save Candidate
                                    </button>
                                </div>
                                </div>
                            </div>
                        )}

           
        </>
    )
}

export default ElectionDetails