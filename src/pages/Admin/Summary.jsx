import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, User, TrendingUp, Users, Award } from 'lucide-react';

const Summary = () => {
    const [elections, setElections] = useState([]);
    const [selectedElectionId, setSelectedElectionId] = useState('1');
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'John Smith', party: 'Democratic', votes: 1250, status: 'Active', age: 45 },
    { id: 2, name: 'Sarah Johnson', party: 'Republican', votes: 980, status: 'Active', age: 38 },
    { id: 3, name: 'Mike Chen', party: 'Independent', votes: 320, status: 'Inactive', age: 42 },
  ]);

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

  useEffect(()=>{
    handleFetchElections();
  }, [])

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const stats = {
    total: candidates.length,
    active: candidates.filter(c => c.status === 'Active').length,
    totalVotes: candidates.reduce((sum, c) => sum + c.votes, 0),
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || candidate.status.toLowerCase() === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Stats */}
        <div className="mb-8">
        <div className='flex justify-left mb-4'>
             <h1 className="text-2xl font-bold text-gray-900 mb-2">Election Name: </h1>
            <select
                  value={selectedElectionId}
                  onChange={(e) => setSelectedElectionId(e.target.value)}
                className="px-4 py-2 mx-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-100"
                >
                <option value="">-- Select Election --</option>
                {elections.map((election) => (
                    <option key={election.id} value={election.id}>
                    {election.description}
                    </option>
                ))}
                </select>
        </div>
           
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Candidates</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Active Candidates</p>
                  <p className="text-2xl font-bold text-green-900">{stats.active}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total Votes</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.totalVotes.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-gray-50 rounded-xl p-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-lg p-1 border border-gray-200">
              {['all', 'active', 'inactive'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search and Add */}
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 whitespace-nowrap">
                <Plus className="h-4 w-4" />
                Add New
              </button>
            </div>
          </div>

          {/* Candidates List */}
          <div className="space-y-3">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          candidate.party === 'Democratic' ? 'bg-blue-100 text-blue-800' :
                          candidate.party === 'Republican' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {candidate.party}
                        </span>
                        <span className="text-xs text-gray-500">Age: {candidate.age}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {candidate.votes.toLocaleString()} votes
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      candidate.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {candidate.status}
                    </span>
                    <div className="flex gap-1">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600">Try changing your filters or search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;