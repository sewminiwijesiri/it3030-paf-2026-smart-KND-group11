import React from 'react';

const ResourceFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Type Filter */}
      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Type</label>
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold text-slate-800 transition-all focus:bg-white focus:border-[#0F172A] focus:outline-none"
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
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Min Capacity</label>
        <input
          type="number"
          name="minCapacity"
          value={filters.minCapacity}
          onChange={handleChange}
          placeholder="e.g. 50"
          className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold text-slate-800 transition-all focus:bg-white focus:border-[#0F172A] focus:outline-none"
        />
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Location</label>
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Search location..."
          className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold text-slate-800 transition-all focus:bg-white focus:border-[#0F172A] focus:outline-none"
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Status</label>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold text-slate-800 transition-all focus:bg-white focus:border-[#0F172A] focus:outline-none"
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
