import React, { useState, useEffect, useReducer } from 'react';
import {Link} from 'react-router-dom'
import ElectionCountdown from '../../components/ElectionCountdown';

const WelcomePage = () => {
  const [elections, setElections] = useState([]);  
  const users = JSON.parse(localStorage.getItem("user"));
  // console.log(users);

   const fetchElections = async () => {
    try {
      const response = await fetch("http://localhost:5231/api/Election", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Failed to load elections");

      const data = await response.json();
      console.log("Fetched data:", data);
      setElections(data);
    } catch (err) {
      console.error("Failed to load:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  // Filter elections by user's ElectionId (if it exists)
  const filteredData = elections.filter(
    (e) => e.id === users?.electionId
  );

  //
  const now = new Date().getTime();
  console.log("this is time", now);


  console.log("Filtered elections:", filteredData);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-6">
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-300 to-emerald-400 text-white flex justify-between items-center py-10 px-6 rounded-xl mb-8 shadow-lg">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome, {users.userName}</h1>
          <p className="text-xl text-green-100">Your voice matters. Make it count.</p>
        </div>

        {filteredData.map((e) => (
          <div key={e.id}>
            <ElectionCountdown 
              startDate={e.startDate} 
              endDate={e.endDate} 
            />
          </div>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* User Status Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-blue-800">
                    Election Information
                  </h2>

                  <span className="px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 hover:bg-green-200">
                      {filteredData.map((e) => {
                        const now = new Date();                  // current time
                        const start = new Date(e.startDate);     // convert string → Date
                        const end = new Date(e.endDate);         // (optional if you also check end date)

                        const hasStarted = now >= start;
                        const hasEnded = now > end;

                        return (
                          hasStarted && !hasEnded ? (
                            <Link 
                              key={e.id} 
                              to={`/user/VotingPage/${users?.electionId}`}
                              className="text-blue-600 "
                            >
                              Click to Start
                            </Link>
                          ) : (
                            <Link 
                              key={e.id} 
                              to={`/user/VotingPage/${users?.electionId}`}
                              className="text-blue-600 "
                            >
                              Click to Start
                            </Link>
                          )
                        );
                      })}
                    </span>

                </div>

                {filteredData.map((e) => (
                  <div
                    key={e.id}
                    className="mb-6 p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <span className='text-gray-600 font-medium'>
                    Election Description: {e.description}
                    </span>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Start Date:</span>
                        <span className="text-gray-900">
                          {new Date(e.startDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>

                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">End Date:</span>
                        <span className="text-gray-900">
                          {e.endDate
                            ? new Date(e.endDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Status:</span>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-full text-xs
                            ${
                              e.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : e.status === "Planned"
                                ? "bg-yellow-100 text-yellow-700"
                                : e.status === "Completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                        >
                          {e.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>


          {/* Upcoming Elections */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Elections Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="font-medium">Election Details</span>
              </button>
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-medium">Find Polling Station</span>
              </button>
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-medium">Update Voter Profile</span>
              </button>
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <span className="font-medium">Download Results</span>
              </button>
            </div>
          </div>

        
        </div>

        
      </div>
    </div>
  </div>
  );
};

export default WelcomePage;