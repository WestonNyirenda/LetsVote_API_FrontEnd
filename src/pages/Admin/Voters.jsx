import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, User, Award } from 'lucide-react';

const Voters = () => {
  const [voters, setVoters] = useState([]);
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('1');
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'John Smith', party: 'Democratic', votes: 1250, status: 'Active', age: 45 },
    { id: 2, name: 'Sarah Johnson', party: 'Republican', votes: 980, status: 'Active', age: 38 },
    { id: 3, name: 'Mike Chen', party: 'Independent', votes: 320, status: 'Inactive', age: 42 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  // Dummy candidate search logic (kept for UI)
  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.party.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Fetch voters based on selected election
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
              onClick={() => setShowModal(true)}
            >
              <Plus className="h-4 w-4" />
              Add Candidate
            </button>
          </div>
        </div>
      </div>

      {/* Voters List */}
      <div className="space-y-3">
        {voters.map((voter) => (
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
        ))}
      </div>
    </div>
  );
};

export default Voters;
