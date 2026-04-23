import React from 'react';
import PropTypes from 'prop-types';
import { BOOKING_STATUS, STATUS_LABELS } from '../../utils/bookingConstants';

const BookingFilters = ({ currentFilters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...currentFilters, [name]: value });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white shadow rounded-lg">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          name="status"
          value={currentFilters.status || ''}
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
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
        <label className="text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          name="date"
          value={currentFilters.date || ''}
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Resource ID</label>
        <input
          type="text"
          name="resourceId"
          placeholder="Resource ID"
          value={currentFilters.resourceId || ''}
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
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
