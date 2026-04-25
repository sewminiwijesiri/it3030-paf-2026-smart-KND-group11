import React from 'react';
import PropTypes from 'prop-types';
import { BOOKING_STATUS, STATUS_LABELS } from '../../utils/bookingConstants';

const BookingFilters = ({ currentFilters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...currentFilters, [name]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-6 mb-2 p-2">
      <div className="flex flex-col">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Status Protocol</label>
        <select
          name="status"
          value={currentFilters.status || ''}
          onChange={handleChange}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer min-w-[160px]"
        >
          <option value="">All Statuses</option>
          {Object.values(BOOKING_STATUS).map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Schedule Date</label>
        <input
          type="date"
          name="date"
          value={currentFilters.date || ''}
          onChange={handleChange}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
        />
      </div>

      <div className="flex flex-col flex-1 max-w-xs">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Asset Reference</label>
        <input
          type="text"
          name="resourceId"
          placeholder="Search by Resource ID..."
          value={currentFilters.resourceId || ''}
          onChange={handleChange}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
        />
      </div>
    </div>
  );
};

BookingFilters.propTypes = {
  currentFilters: PropTypes.shape({
    status: PropTypes.string,
    date: PropTypes.string,
    resourceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default BookingFilters;
