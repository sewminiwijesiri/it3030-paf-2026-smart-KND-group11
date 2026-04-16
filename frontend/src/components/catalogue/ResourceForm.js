import React, { useState, useEffect } from 'react';

const ResourceForm = ({ resource, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: 0,
    location: '',
    availabilityWindows: '',
    status: 'AVAILABLE'
  });

  useEffect(() => {
    if (resource) {
      setFormData({
        ...resource,
        availabilityWindows: resource.availabilityWindows ? resource.availabilityWindows.join(', ') : ''
      });
    }
  }, [resource]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      availabilityWindows: formData.availabilityWindows.split(',').map(s => s.trim()).filter(s => s !== '')
    };
    onSubmit(processedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {resource ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Lecture Hall B"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LECTURE_HALL">Lecture Hall</option>
                  <option value="LAB">Lab</option>
                  <option value="MEETING_ROOM">Meeting Room</option>
                  <option value="PROJECTOR">Projector</option>
                  <option value="CAMERA">Camera</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  min="0"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Building, Floor, Room"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability Windows (Comma separated)</label>
              <input
                type="text"
                name="availabilityWindows"
                value={formData.availabilityWindows}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Mon-Fri 08:00-16:00, Sat 09:00-12:00"
              />
              <p className="text-xs text-gray-400 mt-1">Separate windows with commas.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="AVAILABLE">Available</option>
                <option value="BUSY">Busy</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="OUT_OF_ORDER">Out of Order</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 shadow-md transition duration-200"
              >
                {resource ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;
