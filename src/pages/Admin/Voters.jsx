import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, User, Award } from 'lucide-react';
import{toast} from "react-toastify"

const Voters = () => {
  const [voters, setVoters] = useState([]);
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('1');
  const [isVoterModalOpen, setIsVoterModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    electionId: ""
  })
  
  const resetForm = () =>{
    setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        electionId: ""
    })
 
  }

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddVoter= (e)=>{
    e.preventDefault();

    try{
      fetch("http://localhost:5231/api/account/register",{
        method: "POST",
        headers: {
          Accept: "application/json",
          "content-type":"application/json",
        },
        body: JSON.stringify(formData)

      }).then((response)=>{
        
        if(response.ok){
          toast.success("Added Voter Successfully");
          resetForm();
          setIsVoterModalOpen(false);
          handleFetchVoters(selectedElectionId);

        }else{
          // toast.error("Error: failed to add Voter");
           const errorData =  response.json();
        toast.error(`Failed to add voter: ${errorData.message || 'Unknown error'}`);
        }
        
      })
    }catch(error){
      toast.error(`Error: ${error.message}`);

    }
  }
 
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  const filteredVoters = voters.filter(voter =>
  voter.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  voter.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  voter.email.toLowerCase().includes(searchTerm.toLowerCase())
);



  const handleFetchVoters = (electionId) => {
    fetch(`http://localhost:5231/api/account/electionId?electionId=${electionId}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch voters');
        }
        return response.json();
      })
      .then((data) => {
        setVoters(data);
        console.log('Fetched voters:', data);
      })
      .catch((error) => {
        console.error('Error fetching voters:', error);
      });
  };

  // ✅ Fetch election list
  const handleFetchElections = () => {
    fetch('http://localhost:5231/api/Election', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch elections');
        }
        return response.json();
      })
      .then((data) => {
        setElections(data);
        console.log('Fetched elections:', data);
      })
      .catch((error) => {
        console.error('Error fetching elections:', error);
      });
  };

  // Fetch all elections once
  useEffect(() => {
    handleFetchElections();
  }, []);

  // Fetch voters whenever selected election changes
  useEffect(() => {
    if (selectedElectionId) {
      handleFetchVoters(selectedElectionId);
    }
  }, [selectedElectionId]);

  const handleDelete = (id) => {
    setCandidates(candidates.filter(candidate => candidate.id !== id));
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    setShowModal(true);
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Voter Management</h1>
        <p className="text-gray-600">Manage voter information and election data</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 w-full sm:w-auto">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search candidates..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

           
          </div>

          {/* Action button */}
          <div className="flex gap-3 w-full sm:w-auto">
             {/* Election dropdown */}
            <select
              value={selectedElectionId}
              onChange={(e) => setSelectedElectionId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Election --</option>
              {elections.map((election) => (
                <option key={election.id} value={election.id}>
                  {election.description}
                </option>
              ))}
            </select>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-teal-400 hover:bg-teal-500 text-white rounded-lg"
              onClick={() => setIsVoterModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Candidate
            </button>
          </div>
        </div>
      </div>

      {/* Voters List */}
      <div className="space-y-3">
        {filteredVoters.length > 0 ? (filteredVoters.map((voter) => (
          <div
            key={voter.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {voter.firstName} {voter.lastName}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      Election: {voter.electionName || 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500">
                      DOB: {voter.dateofbirth || 'Unknown'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      Email: {voter.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    voter.electionId ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {voter.electionId ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-1">
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    onClick={() => handleEdit(voter)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    onClick={() => handleDelete(voter.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))):  (
          <p className="text-gray-500 text-sm">No voters found.</p>
          )}
      </div>
    </div>
    
    {isVoterModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setIsVoterModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Voter</h3>

            <form onSubmit={handleAddVoter} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Election
                </label>
                <select
                  name="electionId"
                  value={formData.electionId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select Election</option>
                  {elections.map((election) => (
                    <option key={election.id} value={election.id}>
                      {election.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsVoterModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


</>
  );
};

export default Voters;
