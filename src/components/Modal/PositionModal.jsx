import React from 'react';

const PositionModal = ({onClose}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        
        {/* Close Button */}
        <button
         onClick={onClose}
          type="button"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Add Position
        </h3>

        {/* Form */}
        <form className="space-y-4" >
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Election Name
            </label>
            <input
              type="text"
              name="firstName"
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
              rows="3"
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-400"
            ></textarea>
          </div>

         

         

          {/* Footer */}
          <div className="mt-9 flex justify-end gap-2">
            <button
                onClick={onClose}
              type="button"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
            >
              Save Candidate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PositionModal;
