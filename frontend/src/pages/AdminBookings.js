import React, { useEffect, useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import BookingFilters from '../components/Booking/BookingFilters';
import BookingStatusBadge from '../components/Booking/BookingStatusBadge';
import { BOOKING_STATUS } from '../utils/bookingConstants';
import { CheckCircle, XCircle } from 'lucide-react';

const AdminBookings = () => {
  const { bookings, loading, error, fetchAllBookings, updateStatus } = useBookings();
  const [filters, setFilters] = useState({});
  const [rejectingBooking, setRejectingBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchAllBookings(filters);
  }, [filters, fetchAllBookings]);

  const handleApprove = async (id) => {
    if (window.confirm('Approve this booking?')) {
      await updateStatus(id, BOOKING_STATUS.APPROVED, '');
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }
    const success = await updateStatus(rejectingBooking.id, BOOKING_STATUS.REJECTED, rejectReason);
    if (success) {
      setRejectingBooking(null);
      setRejectReason('');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage All Bookings</h1>

      <BookingFilters currentFilters={filters} onFilterChange={setFilters} />

      {loading && <p className="text-gray-500">Loading bookings...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
          No bookings match the given criteria.
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                <th className="px-6 py-4 border-b">ID / User</th>
                <th className="px-6 py-4 border-b">Resource ID</th>
                <th className="px-6 py-4 border-b">Date / Time</th>
                <th className="px-6 py-4 border-b">Purpose</th>
                <th className="px-6 py-4 border-b">Attendees</th>
                <th className="px-6 py-4 border-b">Status</th>
                <th className="px-6 py-4 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">#{booking.id}</div>
                    <div className="text-sm text-gray-500">User: {booking.userId}</div>
                  </td>
                  <td className="px-6 py-4">{booking.resourceId}</td>
                  <td className="px-6 py-4">
                    <div>{booking.bookingDate}</div>
                    <div className="text-sm text-gray-500">
                      {booking.startTime.substring(0,5)} - {booking.endTime.substring(0,5)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="truncate max-w-[200px] block" title={booking.purpose}>
                      {booking.purpose}
                    </span>
                  </td>
                  <td className="px-6 py-4">{booking.expectedAttendees}</td>
                  <td className="px-6 py-4">
                    <BookingStatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {booking.status === BOOKING_STATUS.PENDING && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove(booking.id)}
                          className="flex items-center gap-1 text-green-600 hover:text-green-800 bg-green-50 px-3 py-1 rounded"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => setRejectingBooking(booking)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 relative">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Reject Booking #{rejectingBooking.id}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
                rows="3"
                placeholder="e.g. Room is under maintenance."
              ></textarea>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setRejectingBooking(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
