import React from 'react';
import PropTypes from 'prop-types';
import { STATUS_COLORS, STATUS_LABELS, BOOKING_STATUS } from '../../utils/bookingConstants';

const BookingStatusBadge = ({ status }) => {
  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
};

BookingStatusBadge.propTypes = {
  status: PropTypes.oneOf(Object.values(BOOKING_STATUS)).isRequired,
};

export default BookingStatusBadge;
