import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus, Mail, Phone, MapPin } from 'lucide-react';
import { useParams } from "react-router-dom";
import {Tooltip} from "react-tooltip";

const VoterManagement = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
    const electionId = parseInt(id);

  

 


  const fetchUsers = async() => {

    fetch(`http://localhost:5231/api/account/electionId?electionId=${electionId}`, {
        method: 'GET',
        headers: {Accept: 'application.json'}
    }).then((response) =>{
        if(!response.ok) throw new Error("failed to fetch elections")
      return   response.json()
    }).then((data)=> {
        console.log('fetched users', data)
        setVoters(data);
    }).catch((error)=> {
        console.log("failed to fetch voters", error)
    })
    
  }
  // Mock data - replace with actual API call
  useEffect(() => 
    {
        fetchUsers();
    }, []);



  return (
    <div className="card bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      
        <div className="flex items-center justify-end">
          
          <button data-tooltip-id = "voterTip" className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            
          </button>
           <Tooltip id="voterTip" place="top" content="Add Voter"  className="!text-white !px-3 !py-1 !rounded-lg !shadow-lg"/>
        </div>
     

      {/* Voters List */}
      <div className=" p-6">
        
          <div className="grid gap-4 max-h-[350px] overflow-y-auto">
            {voters.map((voter) => (
              <div key={voter.id} className="bg-gray-50 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-indigo-600">
                
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{voter.userName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{voter.email}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{voter.phone}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      voter.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {voter.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">Registered: {voter.registered}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  {/* <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{voter.address}</span>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        
      </div>

     
    </div>
  );
};

export default VoterManagement;