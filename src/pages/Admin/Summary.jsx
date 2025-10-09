import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, User, TrendingUp, Users, Award, Calendar } from 'lucide-react';

const Summary = () => {
    const [elections, setElections] = useState([]);
    const [selectedElectionId, setSelectedElectionId] = useState('');
    const [votes, setVotes] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);

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

                if (data.length > 0 && !selectedElectionId) {
                    const firstElection = data[0];
                    setSelectedElectionId(firstElection.id);
                }
            })
            .catch((error) => {
                console.error('Error fetching elections:', error);
            });
    };

    useEffect(() => {
        handleFetchElections();
    }, [])

    // Fetching votes here
    const fetchVotes = (selectedElectionId) => {
        if (!selectedElectionId) return;
        
        fetch(`http://localhost:5231/api/Vote/${selectedElectionId}`, {
            method: "GET",
            headers: { Accept: "Application/json" }
        }).then((response) => {
            if (!response.ok) {
                console.log('Failed to fetch vote data');
            }
            return response.json();
        }).then((data) => {
            console.log('Votes data:', data);
            setVotes(data);
        }).catch((error) => {
            console.error("Failed to fetch votes data", error);
        })
    }

    useEffect(() => {
        if (selectedElectionId) {
            fetchVotes(selectedElectionId);
        }
    }, [selectedElectionId]);

    // Fetching candidate data
    const fetchCandidates = () => {
        fetch("http://localhost:5231/api/Candidate", {
            method: "GET",
            headers: { accept: "application/json" },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load candidates");
                }
                return response.json();
            })
            .then((data) => {
                setCandidates(data);
            })
            .catch((err) => {
                console.error("Error:", err);
            });
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    // Filter candidates for this election only
    const electionCandidates = candidates.filter(
        (c) => c.electionId === parseInt(selectedElectionId)
    );

    // Fetch positions
    const fetchPositions = () => {
        if (!selectedElectionId) return;
        
        fetch(`http://localhost:5231/api/Position/electionId?electionId=${selectedElectionId}`, {
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
        if (selectedElectionId) {
            fetchPositions();
        }
    }, [selectedElectionId]);

    // Calculate unique voters (based on userId)
    const uniqueVoters = [...new Set(votes.map(vote => vote.userId))].length;

    // Group votes by candidate to count votes per candidate
    const candidateVoteCounts = votes.reduce((acc, vote) => {
        const candidateId = vote.candidateId;
        if (!acc[candidateId]) {
            acc[candidateId] = {
                candidate: vote.candidate,
                votes: 0,
                position: vote.position
            };
        }
        acc[candidateId].votes += 1;
        return acc;
    }, {});

    // Convert to array and sort by votes
    const candidateResults = Object.values(candidateVoteCounts).sort((a, b) => b.votes - a.votes);

    // Get selected election name
    const selectedElectionName = elections.find(e => e.id === parseInt(selectedElectionId))?.description || 'Selected Election';

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header with Stats */}
                <div className="mb-8">
                    <div className='flex justify-left mb-4'>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Election Name: {selectedElectionName}</h1>
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
                                    <p className="text-2xl font-bold text-blue-900">{electionCandidates.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <User className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-green-600 font-medium">Total Positions</p>
                                    <p className="text-2xl font-bold text-green-900">{positions.length}</p>
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
                                    <p className="text-2xl font-bold text-purple-900">{votes.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-gray-50 rounded-xl p-6">
                    {/* Voting Results List */}
                    <div className="space-y-4">
                        {candidateResults.length > 0 ? (
                            candidateResults.map((result, index) => (
                                <div key={result.candidate.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <User className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                    {result.candidate.firstName} {result.candidate.lastName}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                                        {result.position?.name || 'No Position'}
                                                    </span>
                                                    <span className="text-sm text-gray-600 flex items-center gap-1">
                                                        <Award className="h-4 w-4" />
                                                        {result.votes} {result.votes === 1 ? 'vote' : 'votes'}
                                                    </span>
                                                    {index < 3 && (
                                                        <span className={`text-sm px-3 py-1 rounded-full ${
                                                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                                            index === 1 ? 'bg-gray-100 text-gray-800' :
                                                            'bg-orange-100 text-orange-800'
                                                        }`}>
                                                            {index === 0 ? '🥇 Leading' : index === 1 ? '🥈 2nd' : '🥉 3rd'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900">{result.votes}</div>
                                                <div className="text-sm text-gray-600">votes</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No voting data available</h3>
                                <p className="text-gray-500">No votes have been cast in this election yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Votes Section */}
                    {/* {votes.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Votes</h3>
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="max-h-96 overflow-y-auto">
                                    {votes.slice(0, 10).map((vote) => (
                                        <div key={vote.id} className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                        <User className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            Voted for {vote.candidate.firstName} {vote.candidate.lastName}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Position: {vote.position.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(vote.createdAt).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(vote.createdAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default Summary;