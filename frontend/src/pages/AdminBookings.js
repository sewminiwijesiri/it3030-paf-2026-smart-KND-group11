import React, { useEffect, useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import BookingFilters from '../components/Booking/BookingFilters';
import BookingStatusBadge from '../components/Booking/BookingStatusBadge';
import { BOOKING_STATUS } from '../utils/bookingConstants';
import { CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

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
    <AdminLayout>
      <div className="max-w-7xl mx-auto animate-up">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div className="space-y-2">
            <span className="inline-block px-4 py-1 bg-[#3f4175] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm">
              System Administrator
            </span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Manage Bookings</h1>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Total Bookings: {bookings.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 md:p-8 relative">
          <BookingFilters currentFilters={filters} onFilterChange={setFilters} />

      {loading && <p className="text-gray-500">Loading bookings...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center mt-6">
          <p className="text-slate-500 font-bold tracking-tight">No bookings match the given criteria.</p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="mt-6 border border-slate-200 rounded-2xl overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-4">ID / User</th>
                <th className="px-6 py-4">Resource ID</th>
                <th className="px-6 py-4">Date / Time</th>
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4">Attendees</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 tracking-tight">#{booking.id}</div>
                    <div className="text-xs font-medium text-slate-500">User: {booking.userId}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{booking.resourceId}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700">{booking.bookingDate}</div>
                    <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      {booking.startTime.substring(0,5)} - {booking.endTime.substring(0,5)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="truncate max-w-[200px] block text-sm font-medium text-slate-600" title={booking.purpose}>
                      {booking.purpose}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{booking.expectedAttendees}</td>
                  <td className="px-6 py-4">
                    <BookingStatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {booking.status === BOOKING_STATUS.PENDING && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove(booking.id)}
                          className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                        >
                          <CheckCircle className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => setRejectingBooking(booking)}
                          className="flex items-center gap-1 text-rose-600 hover:text-rose-700 bg-rose-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                        >
                          <XCircle className="w-3 h-3" /> Reject
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
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
