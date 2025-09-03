import React, { useState, useEffect } from "react";
import Spinner from "../../components/Spinner";


const ElectionDetails = () => {
    const [loading, setLoading] = useState(true);
    const [candidates, setCandidates] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        description: '',
        electionId: '',
        positionId: '',
        imageFile: ''
    });
    const [submitting, setIsSubmitting] = useState(false);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5231/api/Candidate', {
                method: "GET",
                headers: { accept: "application/json" }
            });

            if (!response.ok) {
                throw new Error("Failed to load candidates");
            }

            const data = await response.json();
            setCandidates(data);
            console.log(data);
        } catch (err) {
            console.error("Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        
        // Handle file inputs differently
        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Posting data
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create FormData object for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('firstName', formData.firstName);
            formDataToSend.append('lastName', formData.lastName);
            formDataToSend.append('age', formData.age);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('electionId', formData.electionId);
            formDataToSend.append('positionId', formData.positionId);
            
            if (formData.imageFile) {
                formDataToSend.append('imageFile', formData.imageFile);
            }
            console.log(formDataToSend);
            const response = await fetch("http://localhost:5231/api/Candidate", {
                method: "POST",
                // Don't set Content-Type header when using FormData - 
                // the browser will set it automatically with the correct boundary
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error("Failed to add candidate to the database");
            }

            // Reset form and close modal
            setFormData({
                firstName: '',
                lastName: '',
                age: '',
                description: '',
                electionId: '',
                positionId: '',
                imageFile: null
            });
            
            // Refresh the candidates list
            fetchCandidates();
            setIsModalOpen(false);
            
            console.log("Candidate added successfully");
            alert("Candidate added successfully");
        } catch (err) {
            console.error("Failed to add candidate", err);
            alert("Failed to add candidate: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-slate-700">
                Election Details
            </h2>

            {loading && <div className="flex justify-center"><Spinner /></div>}
            
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
                            <div key={e.id} className='flex items-start justify-between p-1 mb-2 rounded-lg hover:bg-teal-50 transition-all duration-200 border border-gray-100'>
                                <div className='flex items-center gap-x-4'>
                                    <img 
                                        src={`http://localhost:5231${e.imageUrl}`} 
                                        className='size-10 flex-shrink-0 rounded-full object-cover border-2 border-white shadow-sm'
                                        alt={`${e.firstName} ${e.lastName}`}
                                    />
                                    <div className='flex flex-col text-left'>
                                        <p className='font-semibold text-slate-900'>{e.firstName} {e.lastName}</p>
                                        <p className='text-sm text-slate-500'></p>
                                    </div>
                                </div>
                                <div className='flex items-center'>
                                    <button onClick={() => { 
                                        setSelectedCandidate(e);
                                        setIsViewModalOpen(true);
                                    }}
                                    
                                    className='text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-200 transition-colors'>
                                        View
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* The modal */}  
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

                        {/* Modal Body (form) */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
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
                                    value={formData.lastName}
                                    onChange={handleInputChange}
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
                                    value={formData.age}
                                    onChange={handleInputChange}
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
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="mt-1 block w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                                ></textarea>
                            </div>

                            {/* Election ID - Added this missing field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Election ID
                                </label>
                                <input
                                    type="text"
                                    name="electionId"
                                    value={formData.electionId}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                                />
                            </div>

                            {/* Position */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Position
                                </label>
                                <input
                                    type="number"
                                    name="positionId"
                                    value={formData.positionId}
                                    onChange={handleInputChange}
                                    placeholder="Optional Position ID"
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            
                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    name="imageFile"
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full text-sm text-gray-600"
                                />
                            </div>
                            
                            {/* Modal Footer - Moved inside form */}
                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : 'Save Candidate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

           {/*modal for the view */} 

            {isViewModalOpen && selectedCandidate && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-100">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                        {/* Close button */}
                        <button
                            onClick={() => setIsViewModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        {/* Modal Header */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            
                        </h3>

                        {/* Modal Body (form) */}
                        
                        <div className="flex gap-4">
                            <img 
                            src={`http://localhost:5231${selectedCandidate.imageUrl}`} 
                            className="w-24 h-24 rounded-full object-cover border shadow-sm"
                            alt={`${selectedCandidate.firstName} ${selectedCandidate.lastName}`}
                            />
                            <div>
                            <p><strong>Name:</strong> {selectedCandidate.firstName} {selectedCandidate.lastName}</p>
                            <p><strong>Age:</strong> {selectedCandidate.age}</p>
                            <p><strong>Description:</strong> {selectedCandidate.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ElectionDetails;