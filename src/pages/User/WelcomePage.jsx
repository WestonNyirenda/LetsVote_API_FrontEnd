import React, { useState, useEffect, useReducer } from 'react';

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

  console.log("Filtered elections:", filteredData);
  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-6">
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-300 to-emerald-400 text-white py-10 px-6 rounded-xl mb-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome, {users.userName}</h1>
        <p className="text-xl text-green-100">Your voice matters. Make it count.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* User Status Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-blue-800">Election Information</h2>
              
              <span className="px-4 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                Registered
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row">
                <span className="text-gray-600 font-medium sm:w-40">Voter ID:</span>
                <span className="font-semibold">123456789</span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="text-gray-600 font-medium sm:w-40">Location:</span>
                <span className="font-semibold">Lilongwe, Malawi</span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="text-gray-600 font-medium sm:w-40">Voting Status:</span>
                <span className="font-semibold text-blue-600">Eligible to Vote</span>
              </div>
            </div>
          </div>

          {/* Upcoming Elections */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Upcoming Elections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Presidential Elections</h3>
                <p className="text-gray-600 mb-4">December 10, 2025</p>
                <div className="flex space-x-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    View Details
                  </button>
                  <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Add to Calendar
                  </button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Parliamentary Elections</h3>
                <p className="text-gray-600 mb-4">January 15, 2026</p>
                <div className="flex space-x-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    View Details
                  </button>
                  <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Add to Calendar
                  </button>
                </div>
              </div>
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
                <span className="font-medium">Vote Now</span>
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
                <span className="font-medium">Download Voter ID</span>
              </button>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Announcements</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-800">Registration Opens Soon</h3>
                <p className="text-gray-600 text-sm my-2">Voter registration will begin on November 1, 2025.</p>
                <span className="text-xs text-gray-500">October 10, 2025</span>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-800">Election Awareness Campaign</h3>
                <p className="text-gray-600 text-sm my-2">Join our nationwide campaign to promote voting awareness.</p>
                <span className="text-xs text-gray-500">October 15, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default WelcomePage;