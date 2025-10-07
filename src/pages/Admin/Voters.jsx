import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, User } from 'lucide-react';

const Voters= () => {
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'John Smith', party: 'Democratic', votes: 1250, status: 'Active', age: 45 },
    { id: 2, name: 'Sarah Johnson', party: 'Republican', votes: 980, status: 'Active', age: 38 },
    { id: 3, name: 'Mike Chen', party: 'Independent', votes: 320, status: 'Inactive', age: 42 },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.party.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <p className="text-gray-600">Manage candidate information and voting data</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 w-full sm:w-auto">
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
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => setShowModal(true)}
            >
              <Plus className="h-4 w-4" />
              Add Candidate
            </button>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    candidate.party === 'Democratic' ? 'bg-blue-100 text-blue-800' :
                    candidate.party === 'Republican' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {candidate.party}
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                candidate.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {candidate.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-medium">{candidate.age}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Votes</p>
                <p className="font-medium">{candidate.votes.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button 
                onClick={() => handleEdit(candidate)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button 
                onClick={() => handleDelete(candidate.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or add a new candidate.</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Add Candidate
          </button>
        </div>
      )}
    </div>
  );
};

export default Voters;