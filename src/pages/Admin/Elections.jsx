import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Eye } from 'lucide-react';
import Spinner from "../../components/Spinner";
import {Link} from "react-router-dom"
import {toast} from "react-toastify"

const Elections = () => {
  const [elections, setElections] = useState([]); //saving elections in an array here for Get
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingElection, setEditingElection] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [electionStatus, setElectionStatus] = useState([]);

  const [formData, setFormData] = useState({
    electionName: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
    isPublic: true
  });

  const resetForm = () => {
    setFormData({
      electionName: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "",
      isPublic: true
    });
    setEditingElection(null);
    setIsEditMode(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this election?")) return;

    try {
      const response = await fetch(`http://localhost:5231/api/Election/electionId?electionId=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete election");
      }

      setElections((prev) => prev.filter((e) => e.id !== id));
      console.log(`Election with ID ${id} deleted`);
    } catch (error) {
      console.error("Error deleting election:", error);
      alert("Failed to delete election. Check console for details.");
    }
  };

  const fetchElections = () => {
    setLoading(true);
    fetch("http://localhost:5231/api/Election", {
      method: "GET",
      headers: { Accept: "application/json" }
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch elections");
        return response.json();
      })
      .then((data) => {
        console.log("Fetched elections:", data);
        setElections(data);
      })
      .catch((error) => console.error("Error fetching elections:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value
      };
      console.log("Form updated:", updated);
      return updated;
    });
  };

    const preparePayload = () => {
      return {
        id: isEditMode ? editingElection.id : undefined,
        electionName: formData.electionName,
        description: formData.description,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : null,
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : null,
        status: formData.status !== "" ? formData.status : "Pending",
        isPublic: formData.isPublic
      };
    };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = preparePayload();
    console.log("Submitting payload:", payload);

    try {
     const url = isEditMode
  ? `http://localhost:5231/api/Election/${editingElection.id}`
  : "http://localhost:5231/api/Election";

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      console.log("Raw response:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(
          `Failed to ${isEditMode ? "update" : "create"} election: ${response.status} ${response.statusText}`
        );
      }

      if (isEditMode) {
        setElections(prev => prev.map(election => 
          election.id === editingElection.id ? { ...election, ...payload } : election
        ));
        console.log("Election updated successfully");
        toast.success("Election updated successfully");
      } else {
        const newElection = await response.json();
        console.log("Election created successfully:", newElection);
        setElections((prev) => [...prev, newElection]);
        toast.success("Election updated successfully");
      }

      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} election:`, error);
      alert(`Failed to ${isEditMode ? "update" : "create"} election. Check console for details.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  //fetching election status onlly here s

  const handleFetchElectionStatus = () => {
    fetch("http://localhost:5231/api/Election/statuses", {
        method: "GET",
        headers: { Accept: "application/json" }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch election statuses");
        }
        return response.json();
    })
    .then(data => {
        setElectionStatus(data);
        console.log("Election statuses:", data);
    })
    .catch(error => {
        console.error(error);
    });
};

useEffect(() => {
    handleFetchElectionStatus();
}, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-teal-500">
       <Spinner/>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-4 md:p-6">
      <div className=" mx-auto max-w-full lg:max-w-7xl">
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-teal-400 hover:bg-teal-500 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Add New Election
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h5 className="text-lg font-semibold text-center">
                  {isEditMode ? "Edit Election" : "Create New Election"}
                </h5>

                 <div>
                  <label className="block text-sm font-medium mb-1">
                    Election Name
                  </label>
                  <input
                    type="text"
                    name="electionName"
                    value={formData.electionName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm 
                              focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
                    placeholder="Enter election name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm 
                              focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
                    placeholder="Enter election description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm 
                              focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm 
                              focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                 
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-md border border-gray-300 shadow-sm 
                              focus:border-teal-500 focus:ring-teal-500 p-2"
                  >
                  
                  {electionStatus.map((status) => (

                      <option key={status.Id} value={status.Id}>{status.name}</option>
                  ))}
                    
                  
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label className="ml-2 text-sm">Public Election</label>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded bg-teal-500 hover:bg-teal-600 text-white text-sm"
                  >
                    {isSubmitting 
                      ? (isEditMode ? "Updating..." : "Saving...") 
                      : (isEditMode ? "Update" : "Save")
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 uppercase text-sm font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Start Date</th>
                  <th className="px-4 py-3 text-left">End Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Public</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-400 text-sm divide-y divide-gray-200 dark:divide-gray-700">
                {elections.map((e) => (
                  <tr
                    key={e.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                  >
                    <td className="px-4 py-3">{e.id}</td>
                    <td className="px-4 py-3">{e.description}</td>
                    <td className="px-4 py-3">
                      {new Date(e.startDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-4 py-3">
                      {e.endDate
                        ? new Date(e.endDate).toLocaleDateString("en-Gb",{
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })
                        : "Ongoing"}
                    </td>
                   <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium 
                            ${
                              e.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : e.status === "Pending"
                                ? "bg-amber-100 text-amber-700"
                                : e.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : e.status === "Completed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {e.status}
                        </span>
                      </td>

                    <td className="px-4 py-3">
                      {e.isPublic ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-red-600 font-medium">No</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setEditingElection(e);
                            setIsEditMode(true);
                            setFormData({
                              electionName:e.electionName,
                              description: e.description,
                              startDate: e.startDate.split("T")[0],
                              endDate: e.endDate ? e.endDate.split("T")[0] : "",
                              status: e.status.toString(),
                              isPublic: e.isPublic
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-2 rounded-full  text-blue-600 hover:bg-blue-200 transition"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(e.id)}
                          className="p-2 rounded-full  text-red-600 hover:bg-red-200 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                          
                          <Link to={`/Dashboard/ElectionDetails/${e.id}`}  className="p-2  rounded-full text-green-600 hover:bg-green-200 transition">
                            <Eye className="w-4 h-4" />
                          </Link>
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Elections;