import React from 'react';

const ResourceFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Type Filter */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Type</label>
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="LECTURE_HALL">Lecture Hall</option>
          <option value="LAB">Lab</option>
          <option value="MEETING_ROOM">Meeting Room</option>
          <option value="PROJECTOR">Projector</option>
          <option value="CAMERA">Camera</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Min Capacity Filter */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Min Capacity</label>
        <input
          type="number"
          name="minCapacity"
          value={filters.minCapacity}
          onChange={handleChange}
          placeholder="e.g. 50"
          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Search location..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="BUSY">Busy</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="OUT_OF_ORDER">Out of Order</option>
        </select>
      </div>
    </div>
  );
};

export default ResourceFilters;
