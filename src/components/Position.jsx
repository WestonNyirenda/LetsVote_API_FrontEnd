import React, { useEffect, useState } from "react";
import { Plus, Users, Award, Pencil, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import {Tooltip} from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {toast} from 'react-toastify';



const Position = () => {
  const [positions, setPositions] = useState([]);
  const { id } = useParams();
  const electionId = parseInt(id);
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    electionId: electionId,
  });

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      electionId: electionId,
    });
  };

  // Fetch all positions
  const fetchPositions = async () => {
    try {
      const response = await fetch(
        `http://localhost:5231/api/Position/electionId?electionId=${electionId}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch positions");
      }

      const data = await response.json();
      setPositions(data);
    } catch (error) {
      console.error("Failed Message:", error);
      alert("Failed to get data");
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new position
  const handleAddPosition = async (e) => {
    e.preventDefault();
    try {
      const { id, ...postData } = formData;

      const response = await fetch("http://localhost:5231/api/Position", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok){
        toast.success("Added Position successfully")
      }else{
        throw new Error("Failed to add position");
        
      };

      const newPosition = await response.json();
      setPositions((prev) => [...prev, newPosition]);
      setIsPositionModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to add position", error);
      
      toast.error("Failed to add position");
    }
  };

  // Update position
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!formData.id){
          toast.error("No ID provided for update");
          return;
      } 

      const updateData = {
        id: formData.id,
        name: formData.name,
        description: formData.description,
        electionId: formData.electionId,
      };

      console.log(updateData);
      const response = await fetch(
        `http://localhost:5231/api/Position/${formData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok){
      
        toast.success("Updated Position Successfully");
        
      }else{
          toast.error("Failed to update position");
          return;
      }

      let updated = null;

        try {
      updated = await response.json();
      } catch {
        // If backend sent plain text or no content
        updated = { ...formData };
      }

      setPositions((prev) =>
        prev.map((p) => (p.id === formData.id ? updated : p))
      );
      setIsPositionModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update position");
    }
  };

  // Delete position
  const handleDelete = async (positionId) => {
    if (!window.confirm("Are you sure you want to delete this position?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:5231/api/Position/${positionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete position");

      setPositions((prev) => prev.filter((p) => p.id !== positionId));
    } catch (error) {
      console.error("Failed to delete position", error);
      alert("Failed to delete position. Check console for details.");
    }
  };

  // Open modal for editing
  const openEditModal = (position) => {
    setFormData({
      id: position.id,
      name: position.name,
      description: position.description || "",
      electionId: electionId,
    });
    setIsPositionModalOpen(true);
  };

  return (
    <>
      <div className="card bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-blue-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-800">Positions</h2>
              <span className="bg-amber-200 text-teal-800 text-sm px-3 py-1 mx-2 rounded-full font-medium">
                {positions.length}
              </span>
            </div>
            <button data-tooltip-id = "positionTip"
              onClick={() => {
                resetForm();
                setIsPositionModalOpen(true);
              }}
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-7 h-7" />
            
              
            </button>
            <Tooltip id="positionTip" place="top" content="Add Position"  className="!text-white !px-3 !py-1 !rounded-lg !shadow-lg"/>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[350px] overflow-y-auto p-6">
          {positions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No positions yet</p>
              <p className="text-sm">Add your first position to get started</p>
            </div>
          ) : (
            positions.map((pos) => (
              <div
                key={pos.id}
               n className="flex items-center justify-between p-4 mb-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {pos.name}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md mx-5">
                        {pos.candidatesCount || 0} candidates
                      </span>
                    </h3>
                    {pos.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {pos.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => openEditModal(pos)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg flex items-center gap-2 shadow-sm hover:shadow"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pos.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg flex items-center gap-2 shadow-sm hover:shadow"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {/* <div className="p-4 border-t border-gray-100 bg-gray-50 text-center text-sm text-gray-600">
          Manage election positions and their candidates zoona izi
        </div> */}
      </div>

      {/* Modal */}
      {isPositionModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            {/* Close */}
            <button
              onClick={() => {
                setIsPositionModalOpen(false);
                resetForm();
              }}
              type="button"
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {formData.id ? "Edit Position" : "Add Position"}
            </h3>

            <form
              className="space-y-4"
              onSubmit={formData.id ? handleUpdate : handleAddPosition}
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400"
                  required
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
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsPositionModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  {formData.id ? "Update Position" : "Save Position"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Position;
