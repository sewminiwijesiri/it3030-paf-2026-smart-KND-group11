import React, { useEffect, useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import BookingFilters from '../components/Booking/BookingFilters';
import BookingStatusBadge from '../components/Booking/BookingStatusBadge';
import { BOOKING_STATUS } from '../utils/bookingConstants';
import { CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const AdminBookings = () => {
  const { bookings, loading, error, fetchAllBookings, updateStatus, bulkDeleteBookings } = useBookings();
  const [filters, setFilters] = useState({});
  const [rejectingBooking, setRejectingBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

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

  const toggleSelectAll = () => {
    if (selectedIds.length === bookings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(bookings.map(b => b.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkClear = async () => {
    if (window.confirm(`Clear ${selectedIds.length} selected records permanently?`)) {
      const success = await bulkDeleteBookings(selectedIds);
      if (success) setSelectedIds([]);
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
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl shadow-xl">
            <div className="flex -space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none mb-1">Live Registry</span>
                <span className="text-xs font-black text-[#FFD166] uppercase tracking-widest leading-none">Total Bookings: {bookings.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 md:p-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <BookingFilters currentFilters={filters} onFilterChange={setFilters} />
            
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-3 animate-fade-in">
                <span className="text-[10px] font-black text-[#FFD166] bg-[#0F172A] px-4 py-2 rounded-xl shadow-lg uppercase tracking-widest">
                  {selectedIds.length} Selected
                </span>
                <button 
                  onClick={handleBulkClear}
                  className="px-5 py-2 bg-rose-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 flex items-center gap-2"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>

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
        <div className="mt-8 bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                  <th className="px-6 py-4 w-10">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-[#0F172A] focus:ring-[#0F172A] cursor-pointer"
                      checked={selectedIds.length === bookings.length && bookings.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset / User</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Schedule</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Purpose</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Attendees</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Registry Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.includes(booking.id) ? 'bg-indigo-50/30' : ''}`}>
                    <td className="px-6 py-5">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-[#0F172A] focus:ring-[#0F172A] cursor-pointer"
                        checked={selectedIds.includes(booking.id)}
                        onChange={() => toggleSelect(booking.id)}
                      />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                            {booking.resourceName || (booking.resourceId.length > 12 ? `${booking.resourceId.substring(0, 12)}...` : booking.resourceId)}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Requester: {booking.userId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-700">{booking.bookingDate}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          {booking.startTime.substring(0,5)} - {booking.endTime.substring(0,5)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="truncate max-w-[180px] block text-[11px] font-bold text-slate-600 italic" title={booking.purpose}>
                        "{booking.purpose}"
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-[11px] font-black text-slate-600 border border-slate-200/50">
                        {booking.expectedAttendees}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <BookingStatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      {booking.status === BOOKING_STATUS.PENDING ? (
                        <div className="flex justify-end gap-3 transition-opacity">
                          <button
                            onClick={() => handleApprove(booking.id)}
                            className="flex items-center gap-1.5 text-emerald-600 hover:text-white hover:bg-emerald-500 border border-emerald-200 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                            <CheckCircle className="w-3 h-3" /> Approve
                          </button>
                          <button
                            onClick={() => setRejectingBooking(booking)}
                            className="flex items-center gap-1.5 text-rose-600 hover:text-white hover:bg-rose-500 border border-rose-200 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic pr-4">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
