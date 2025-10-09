import React, { useState, useEffect } from "react";
import Spinner from "../../components/Spinner";
import { useParams } from "react-router-dom";
import { Trash2, Pencil,Plus } from "lucide-react";
import Position from "../../components/Position";
import VoterManagement from "../../components/VoterManagement";
import { toast } from "react-toastify";
import {Tooltip} from "react-tooltip";

const ElectionDetails = () => {
  const { id } = useParams();
  const electionId = parseInt(id);

  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [submitting, setIsSubmitting] = useState(false);
  const [positions, setPositions] = useState(null);
   const [votes, setVotes] = useState(null);
    const [openPositions, setOpenPositions] = useState(new Set());

     const togglePosition = (position) => {
    const newOpen = new Set(openPositions);
    if (newOpen.has(position)) {
      newOpen.delete(position);
    } else {
      newOpen.add(position);
    }
    setOpenPositions(newOpen);
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    description: "",
    electionId: electionId,
    positionId: "",
    imageFile: "",
  });

  // Fetch candidates
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5231/api/Candidate", {
        method: "GET",
        headers: { accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to load candidates");
      }

      const data = await response.json();
      setCandidates(data);
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

  // Filter candidates for this election only
  const electionCandidates = candidates.filter(
    (c) => c.electionId === electionId
  );

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      if (editingCandidate) {
        formDataToSend.append("id", editingCandidate.id);
        formDataToSend.append("imageFile", editingCandidate.imageUrl);
      }
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("electionId", formData.electionId);
      formDataToSend.append("positionId", formData.positionId);

      if (formData.imageFile) {
        formDataToSend.append("imageFile", formData.imageFile);
      }

      let response;

      if (editingCandidate) {
        // UPDATE candidate
        response = await fetch(
          `http://localhost:5231/api/Candidate/${editingCandidate.id}`,
          {
            method: "PUT",
            body: formDataToSend,
          }
        );
        
        if (!response.ok) throw new Error("Failed to update candidate");
        alert("Candidate updated successfully");
      } else {
        // ADD candidate
        response = await fetch("http://localhost:5231/api/Candidate", {
          method: "POST",
          body: formDataToSend,
        });

        if (!response.ok) throw new Error("Failed to add candidate");
        
        toast.success("Candidate added successfully");
      }

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        description: "",
        electionId: electionId,
        positionId: "",
        imageFile: null,
      });
      setEditingCandidate(null);
      setIsModalOpen(false);
      fetchCandidates();
    } catch (err) {
      console.error("Save failed", err);
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Candidate?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:5231/api/Candidate/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete candidate with ID ${id}`);
      }

      setCandidates((prev) => prev.filter((e) => e.id !== id));
      
      toast.success("Candidate Deleted successfully");
    } catch (Error) {
      console.error("Failed to delete candidate", Error);
      toast.error("Failed to delete candidate. Check console for details.");
    }
  };

  const fetchPositions = () => {
    fetch(`http://localhost:5231/api/Position/electionId?electionId=${electionId}`, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    }).then((response) => {
      if (!response.ok) throw new Error('Failed to fetch positions for the elections');
      return response.json();
    }).then((data) => {
      setPositions(data);
    }).catch((error) => console.error('Error fetching positions', error));
  };

  useEffect(() => {
    fetchPositions();
  }, []);

 // Fetching elections here

  const fetchVotes = ()=>{
    fetch(`http://localhost:5231/api/Vote/${electionId}`,{
      method: "GET",
      headers: {Accept: "Application/json"}
    }).then((response) =>{
      if(!response.ok){
          // toast.error("Failed to fetch votes");
          console.log('Failed to fetch votte data');
          
      }
      return response.json();
    }).then((data)=>{
        console.log(data);
        setVotes(data);
    }).catch((error)=>{
      console.error("Failed to fetch votes data", error);

    })
  }

  useEffect(()=>{
    fetchVotes();
  },[]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        Election Details
      </h2>

      {loading && (
        <div className="flex justify-center text-teal-300">
          <Spinner />
        </div>
      )}

      {/*  */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Statistics Card and ddaata */}
        <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm border border-gray-200 p-6 ">
          <div className="text-lg font-semibold text-gray-800 mb-4">Statistics</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* */}
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{votes.length > 0 ? votes.length: 0}</div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{electionCandidates.length}</div>
              <div className="text-sm text-gray-600">Candidates</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{positions.length > 0 ? positions.length : 0}</div>
              <div className="text-sm text-gray-600">Positions</div>
            </div>
          </div>

            {/* <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Voting Summary</h3>
      
      {votes && votes.length > 0 ? (
        <div className="space-y-2 max-w-2xl mx-auto max-h-[150px] overflow-y-auto">
          {Array.from(new Set(votes.map(vote => vote.position.name))).map((position) => {
            const positionVotes = votes.filter(vote => vote.position.name === position);
            const candidateCounts = positionVotes.reduce((acc, vote) => {
              const candidateName = `${vote.candidate.firstName} ${vote.candidate.lastName}`;
              acc[candidateName] = (acc[candidateName] || 0) + 1;
              return acc;
            }, {});

            const sortedCandidates = Object.entries(candidateCounts)
              .sort(([,a], [,b]) => b - a);
            const isOpen = openPositions.has(position);

            return (
              <div key={position} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => togglePosition(position)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {positionVotes.length}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-lg">{position}</h4>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}>
                  <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                    <div className="space-y-3">
                      {sortedCandidates.map(([candidate, count], index) => {
                        const percentage = (count / positionVotes.length) * 100;
                        return (
                          <div key={candidate} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                index === 0 
                                  ? 'bg-green-500 text-white' 
                                  : index === 1 
                                  ? 'bg-blue-500 text-white'
                                  : index === 2
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-gray-400 text-white'
                              }`}>
                                {index + 1}
                              </div>
                              <span className="font-medium text-gray-700">{candidate}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <div className="text-right min-w-20">
                                <span className="font-semibold text-gray-900">{count}</span>
                                <span className="text-sm text-gray-500 ml-1">
                                  ({percentage.toFixed(1)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No voting data available</p>
        </div>
      )}
    </div> */}
        </div>

        {/* Candidates Card */}
        <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-800">Candidates</h3>
              <button data-tooltip-id = "candidateTip"
                onClick={() => {
                  setIsModalOpen(true);
                  setEditingCandidate(null);
                  setFormData({
                    firstName: "",
                    lastName: "",
                    dateOfBirth: "",
                    description: "",
                    electionId: electionId,
                    positionId: "",
                    imageFile: null,
                  });
                }}
                className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 whitespace-nowrap"
              >
               <Plus className="w-5 h-5" />
              </button>
              <Tooltip id="candidateTip" place="top" content="Add Candidate"  className="!text-white !px-3 !py-1 !rounded-lg !shadow-lg"/>
            </div>
          </div>

          <div className="p-4 max-h-80 overflow-y-auto">
            {electionCandidates.length === 0 && !loading ? (
              <div className="text-center py-8 text-gray-500">
                No candidates found for this election
              </div>
            ) : (
              <div className="space-y-3">
                {electionCandidates.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={`http://localhost:5231${c.imageUrl}`}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                        alt={`${c.firstName} ${c.lastName}`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">
                          {c.firstName} {c.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {c.position?.name || 'No position'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setSelectedCandidate(c);
                          setIsViewModalOpen(true);
                        }}
                        className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-colors duration-200"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Positions and Voter Management Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="min-w-0">
          <Position />
        </div>
        <div className="min-w-0">
          <VoterManagement />
        </div>
      </div>

      {/* Add/Edit Candidate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingCandidate ? "Edit Candidate" : "Add Candidate"}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCandidate(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    min="15"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <select
                    name="positionId"
                    value={formData.positionId}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  >
                    <option value="">-- Select a Position --</option>
                    {positions && positions.map((place) => (
                      <option key={place.id} value={place.id}>
                        {place.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    name="imageFile"
                    onChange={handleInputChange}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingCandidate(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {submitting
                      ? editingCandidate
                        ? "Updating..."
                        : "Saving..."
                      : editingCandidate
                      ? "Update Candidate"
                      : "Save Candidate"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Candidate Modal */}
      {isViewModalOpen && selectedCandidate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Candidate Details
                </h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>

              <div className="text-center">
                <img
                  src={`http://localhost:5231${selectedCandidate.imageUrl}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto mb-4"
                  alt={`${selectedCandidate.firstName} ${selectedCandidate.lastName}`}
                />
                
                <div className="space-y-3 text-left">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedCandidate.firstName} {selectedCandidate.lastName}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Age</label>
                    <p className="text-gray-900">{selectedCandidate.dateOfBirth}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Description</label>
                    <p className="text-gray-900">{selectedCandidate.description}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Position</label>
                    <p className="text-gray-900">
                      {selectedCandidate.position ? selectedCandidate.position.name : 'No position assigned'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleDelete(selectedCandidate.id);
                      setIsViewModalOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setEditingCandidate(selectedCandidate);
                      setFormData({
                        firstName: selectedCandidate.firstName,
                        lastName: selectedCandidate.lastName,
                        dateOfBirth: selectedCandidate.dateOfBirth,
                        description: selectedCandidate.description,
                        electionId: selectedCandidate.electionId,
                        positionId: selectedCandidate.positionId || "",
                        imageFile: selectedCandidate.imageUrl
                      });
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors duration-200"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionDetails;