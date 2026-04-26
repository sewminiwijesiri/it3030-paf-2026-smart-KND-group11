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
import Footer from '../components/Footer';

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
      
      <div className="flex flex-1">
        {renderSidebar()}
        <main className={`flex-1 ${role === 'USER' ? 'lg:ml-72' : 'lg:ml-72'} h-[calc(100vh-64px)] overflow-y-auto scroll-smooth pb-10`}>
          
          {/* Header Section - Modern Hero Style */}
          <div className="bg-[#002147] border-b border-white/10 py-10 mb-8 shadow-lg">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
              <p className="text-blue-200 font-black text-[10px] uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F1C]"></span>
                Reservation Registry
              </p>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-2">
                    My <span className="text-blue-100/50">Bookings</span>
                  </h1>
                  <p className="text-blue-100/60 font-bold uppercase tracking-wider text-[11px]">Manage your resource reservations and schedules.</p>
                </div>
                <div className="bg-white/5 p-2 border border-white/10 rounded-2xl shrink-0 shadow-inner flex items-center gap-4 px-4">
                  <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest pl-2">Active Slots:</span>
                  <span className="bg-[#FF9F1C] text-white px-4 py-1.5 rounded-xl text-xs font-black shadow-lg shadow-orange-500/20">{filteredBookings.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            {/* Filters Panel */}
            <div className="mb-8 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-wrap items-center gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-[#002147] rounded-xl flex items-center justify-center border border-blue-100">
                  <Filter className="w-5 h-5" />
                </div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Filter Status</label>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002147] transition-all flex-1 md:flex-none md:w-64 appearance-none shadow-inner"
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#002147]"></div>
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
                    <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px] text-center shrink-0 border border-slate-100 group-hover:bg-blue-50 group-hover:border-[#4DA8DA] transition-colors">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-[#4DA8DA]">{new Date(booking.bookingDate).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="text-2xl font-black text-slate-800 group-hover:text-[#002147]">{new Date(booking.bookingDate).getDate()}</span>
                      <span className="text-xs font-bold text-slate-500 group-hover:text-[#4DA8DA] mb-2">{new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      <div className="w-full h-px bg-slate-200 my-2 group-hover:bg-blue-200"></div>
                      <span className="text-[11px] font-black text-slate-600 flex items-center gap-1 group-hover:text-[#002147]">
                        <Clock className="w-3 h-3" /> {booking.startTime ? booking.startTime.substring(0,5) : ''}
                      </span>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-black text-[#002147] truncate pr-4 uppercase tracking-tight">
                          Ref: {booking.resourceId}
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
                            className="w-full md:w-auto px-4 py-3 bg-blue-50 border border-blue-100 text-[#4DA8DA] hover:bg-[#4DA8DA] hover:text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <QrCode className="w-4 h-4" /> QR Code
                          </button>
                          <button
                            onClick={() => handleCancelClick(booking.id)}
                            className="w-full md:w-auto px-4 py-3 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
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
          <Footer />
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
                  <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#002147]"></div>
                ) : currentQrCode ? (
                  <img src={`data:image/png;base64,${currentQrCode}`} alt="Booking QR Code" className="w-48 h-48 rounded-xl shadow-md border-4 border-white" />
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
