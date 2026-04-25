import React, { useEffect, useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import { bookingService } from '../services/bookingService';
import BookingStatusBadge from '../components/Booking/BookingStatusBadge';
import { BOOKING_STATUS } from '../utils/bookingConstants';
import { Trash2, PlusCircle, AlertCircle, Calendar, Clock, MapPin, Users, Filter, QrCode, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import TechnicianSidebar from '../components/TechnicianSidebar';

const MyBookings = () => {
  const { bookings, loading, error, fetchMyBookings, cancelBooking, createBooking } = useBookings();
  const [filterStatus, setFilterStatus] = useState('');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [currentQrCode, setCurrentQrCode] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const handleCancelClick = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await cancelBooking(id);
    }
  };

  const handleGenerateQR = async (bookingId) => {
    try {
      setQrLoading(true);
      setQrModalOpen(true);
      const data = await bookingService.getQRCode(bookingId);
      setCurrentQrCode(data.qrCode);
    } catch (err) {
      console.error(err);
    } finally {
      setQrLoading(false);
    }
  };

  const filteredBookings = filterStatus
    ? bookings.filter((b) => b.status === filterStatus)
    : bookings;

  const role = localStorage.getItem('role') || 'USER';

  const renderSidebar = () => {
    switch (role) {
      case 'ADMIN': return <AdminSidebar />;
      case 'TECHNICIAN': return <TechnicianSidebar />;
      default: return <Sidebar />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans relative overflow-hidden">
      <Navbar />
      
      <div className="flex flex-1 pt-[72px]">
        {renderSidebar()}

        <main className={`flex-1 lg:ml-64 p-6 md:p-8 transition-all duration-300`}>
          <div className="max-w-5xl mx-auto">
            
            {/* Header Section */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8 animate-fade-in-up">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
                  My Bookings
                </h1>
                <p className="text-slate-400 font-medium italic">Manage your resource reservations and schedules.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="bg-white p-2 border border-slate-200/60 rounded-2xl shadow-sm flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Total Bookings:</span>
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-xl text-xs font-black">{filteredBookings.length}</span>
                </div>
              </div>
            </header>

            {/* Filters Panel */}
            <div className="mb-8 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-wrap items-center gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Filter className="w-5 h-5" />
                </div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Filter by Status:</label>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all flex-1 md:flex-none md:w-64 appearance-none"
              >
                <option value="">All Statuses</option>
                {Object.values(BOOKING_STATUS).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-[2rem] flex items-center justify-center gap-3 mb-10 font-bold animate-fade-in shadow-sm">
                <AlertCircle className="w-6 h-6"/>
                <span>{error}</span>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-fade-in">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Bookings...</p>
              </div>
            ) : !error && filteredBookings.length === 0 ? (
              /* Empty State */
              <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 text-center shadow-sm animate-fade-in">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Calendar className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">No Bookings Found</h3>
                <p className="text-slate-400 text-sm font-medium mb-8">You don't have any bookings matching this criteria.</p>
              </div>
            ) : (
              /* Bookings List */
              <div className="space-y-6">
                {filteredBookings.map((booking, index) => (
                  <div 
                    key={booking.id} 
                    className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    
                    {/* Date/Time Block */}
                    <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px] text-center shrink-0 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-400">{new Date(booking.bookingDate).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="text-2xl font-black text-slate-800 group-hover:text-indigo-600">{new Date(booking.bookingDate).getDate()}</span>
                      <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-500 mb-2">{new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      <div className="w-full h-px bg-slate-200 my-2 group-hover:bg-indigo-200"></div>
                      <span className="text-[11px] font-black text-slate-600 flex items-center gap-1 group-hover:text-indigo-600">
                        <Clock className="w-3 h-3" /> {booking.startTime ? booking.startTime.substring(0,5) : ''}
                      </span>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-black text-slate-800 truncate pr-4">
                          Resource ID: {booking.resourceId}
                        </h3>
                        <BookingStatusBadge status={booking.status} />
                      </div>
                      
                      <p className="text-sm font-medium text-slate-600 mb-4 line-clamp-2">
                        {booking.purpose}
                      </p>

                      <div className="flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <Users className="w-3.5 h-3.5" /> {booking.expectedAttendees} Attendees
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <Clock className="w-3.5 h-3.5" /> Until {booking.endTime ? booking.endTime.substring(0,5) : ''}
                        </span>
                      </div>

                      {booking.status === BOOKING_STATUS.REJECTED && booking.reason && (
                        <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                          <p className="text-xs font-bold text-rose-600 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Reason: {booking.reason}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="w-full md:w-auto flex flex-col justify-end gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6">
                      {booking.status === BOOKING_STATUS.APPROVED && (
                        <>
                          <button
                            onClick={() => handleGenerateQR(booking.id)}
                            className="w-full md:w-auto px-4 py-3 bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                          >
                            <QrCode className="w-4 h-4" /> QR Code
                          </button>
                          <button
                            onClick={() => handleCancelClick(booking.id)}
                            className="w-full md:w-auto px-4 py-3 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> Cancel
                          </button>
                        </>
                      )}
                      {booking.status !== BOOKING_STATUS.APPROVED && (
                         <div className="w-full md:w-auto px-4 py-3 text-slate-300 text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center">
                           No Actions Available
                         </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => { setQrModalOpen(false); setCurrentQrCode(null); }}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h3 className="text-xl font-black text-slate-800 mb-2">Booking QR Code</h3>
              <p className="text-sm font-medium text-slate-500 mb-6">Scan to verify this booking details.</p>
              
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-center min-h-[250px]">
                {qrLoading ? (
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600"></div>
                ) : currentQrCode ? (
                  <img src={`data:image/png;base64,${currentQrCode}`} alt="Booking QR Code" className="w-48 h-48 rounded-xl shadow-sm" />
                ) : (
                  <div className="text-rose-500 text-sm font-bold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5"/> Failed to load QR Code
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyBookings;
