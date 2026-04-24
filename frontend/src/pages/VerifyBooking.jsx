import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { BOOKING_STATUS } from '../utils/bookingConstants';
import BookingStatusBadge from '../components/Booking/BookingStatusBadge';

const VerifyBooking = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';
        const response = await axios.get(`${baseUrl}/public/booking/${bookingId}`);
        setBooking(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching booking verification:', err);
        setError('Unable to verify this booking. It may not exist or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Verifying Booking...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 text-center shadow-xl max-w-lg w-full">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
            <XCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">Verification Failed</h2>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  const isApproved = booking.status === BOOKING_STATUS.APPROVED;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden max-w-md w-full animate-fade-in-up">
        
        {/* Header Status */}
        <div className={`p-8 text-center text-white ${isApproved ? 'bg-emerald-500' : 'bg-rose-500'}`}>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            {isApproved ? <CheckCircle className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
          </div>
          <h1 className="text-3xl font-black mb-1">
            {isApproved ? 'Valid Booking' : 'Invalid Status'}
          </h1>
          <p className="text-white/80 font-medium tracking-wide">
            {isApproved ? 'This reservation is confirmed and active.' : `Current Status: ${booking.status}`}
          </p>
        </div>

        {/* Booking Details */}
        <div className="p-8 space-y-6">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resource</p>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-500" />
              {booking.resourceName}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Calendar className="w-3 h-3"/> Date</p>
              <p className="font-bold text-slate-800">
                {new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Clock className="w-3 h-3"/> Time</p>
              <p className="font-bold text-slate-800">
                {booking.startTime ? booking.startTime.substring(0,5) : ''} - {booking.endTime ? booking.endTime.substring(0,5) : ''}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Purpose</p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-sm font-medium text-slate-700">{booking.purpose}</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendees</p>
                <p className="font-bold text-slate-800">{booking.expectedAttendees} Expected</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <BookingStatusBadge status={booking.status} />
            </div>
          </div>

          <div className="text-center pt-4">
             <p className="text-xs text-slate-400 font-medium">Verified by Smart Campus System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyBooking;
