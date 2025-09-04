import React, { useState, useEffect } from "react";
import Spinner from "../../components/Spinner";
import { useParams } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";

const ElectionDetails = () => {
  const { id } = useParams(); // get election id from URL
  const electionId = parseInt(id);

  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [editingCandidate, setEditingCandidate] = useState(null);

  const [submitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    description: "",
    electionId: electionId,
    positionId: "",
    imageFile: "",
   
  });

  // fetch candidates
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

  // filter candidates for this election only
  const electionCandidates = candidates.filter(
    (c) => c.electionId === electionId
  );

  // handle form input
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // handle add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
    
      const formDataToSend = new FormData();
      if(editingCandidate){
          formDataToSend.append("id", editingCandidate.id);
            formDataToSend.append("imageFile", editingCandidate.imageUrl);
          
      }
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("age", formData.age);
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
        console.log(editingCandidate);
        
        if (!response.ok) throw new Error("Failed to update candidate");
        alert("Candidate updated successfully");
      } else {
        // ADD candidate
        response = await fetch("http://localhost:5231/api/Candidate", {
          method: "POST",
          body: formDataToSend,
        });


        if (!response.ok) throw new Error("Failed to add candidate");
        alert("Candidate added successfully");
      }

      // reset
      setFormData({
        firstName: "",
        lastName: "",
        age: "",
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

  // handle delete
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
      console.log("Candidate Deleted successfully");
    } catch (Error) {
      console.error("Failed to delete candidate", Error);
      alert("Failed to delete candidate. Check console for details.");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        Election Details
      </h2>

      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      <div className="flex flex-row gap-x-2 p-4">
        {/* Stats */}
        <div className="card basis-2/3 bg-white rounded-2xl shadow-lg p-6 text-center text-lg font-semibold text-gray-700 border-gray-200">
          <div className="card-title">Statistics</div>
        </div>

        {/* Candidates */}
        <div className="card basis-1/3 bg-white rounded-2xl shadow-lg p-1 text-center border-gray-200">
          <div className="card-header mb-4 justify-between">
            <div className="card-title text-xl text-gray-800 p-3">
              Candidates
            </div>
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setEditingCandidate(null); // new candidate
                  setFormData({
                    firstName: "",
                    lastName: "",
                    age: "",
                    description: "",
                    electionId: electionId,
                    positionId: "",
                    imageFile: null,
                  });
                }}
                className="bg-teal-400 hover:bg-teal-500 text-white font-medium py-2 px-4 rounded-lg"
              >
                Add Candidate
              </button>
            </div>
          </div>

          <div className="card-body h-[300px] overflow-auto">
            {electionCandidates.length === 0 && !loading ? (
              <p className="text-gray-500 py-4">
                No candidates found for this election
              </p>
            ) : (
              electionCandidates.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start justify-between p-1 mb-2 rounded-lg hover:bg-teal-50 transition border border-gray-100"
                >
                  <div className="flex items-center gap-x-4">
                    <img
                      src={`http://localhost:5231${c.imageUrl}`}
                      className="size-10 rounded-full object-cover border-2 border-white shadow-sm"
                      alt={`${c.firstName} ${c.lastName}`}
                    />
                    <div className="flex flex-col text-left">
                      <p className="font-semibold text-slate-900">
                        {c.firstName} {c.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCandidate(c);
                        setIsViewModalOpen(true);
                      }}
                      className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-200"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Candidate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditingCandidate(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingCandidate ? "Edit Candidate" : "Add Candidate"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  required
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400"
                ></textarea>
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position (Optional)
                </label>
                <input
                  type="number"
                  name="positionId"
                  value={formData.positionId}
                  onChange={handleInputChange}
                  placeholder="Optional"
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Image
                </label>
                <input
                  type="file"
                  name="imageFile"
                  onChange={handleInputChange}
                  className="w-full text-sm text-gray-600"
                />
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCandidate(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
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
      )}

      {/* View Candidate Modal */}
      {isViewModalOpen && selectedCandidate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 "
            >
              ✕
            </button>

            <div className="flex gap-4">
              <div className="card w-full border-gray-100 p-2">
                <div className="card-header text-center">
                  <img
                    src={`http://localhost:5231${selectedCandidate.imageUrl}`}
                    className="w-24 h-24 rounded-full object-cover border shadow-sm mx-auto"
                    alt={`${selectedCandidate.firstName} ${selectedCandidate.lastName}`}
                  />
                </div>

                <div className="card-body text-left mt-3">
                  <p>
                    <strong>Name:</strong> {selectedCandidate.firstName}{" "}
                    {selectedCandidate.lastName}
                  </p>
                  <p>
                    <strong>Age:</strong> {selectedCandidate.age}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {selectedCandidate.description}
                  </p>
                </div>

                <div className="card-footer flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      handleDelete(selectedCandidate.id);
                      setIsViewModalOpen(false);
                    }}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setEditingCandidate(selectedCandidate);
                      setFormData({
                        firstName: selectedCandidate.firstName,
                        lastName: selectedCandidate.lastName,
                        age: selectedCandidate.age,
                        description: selectedCandidate.description,
                        electionId: selectedCandidate.electionId,
                        positionId: selectedCandidate.positionId || "",
                        imageFile: selectedCandidate.imageFile,
                        imageFile: selectedCandidate.imageUrl
                      });
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-green-200 text-teal-700 rounded-lg hover:bg-green-300"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ElectionDetails;
