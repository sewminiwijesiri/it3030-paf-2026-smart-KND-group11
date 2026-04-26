import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlignLeft, Users } from 'lucide-react';
import axios from 'axios';

const BookingFormModal = ({ resource, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    bookingDate: '',
    startTime: '09:00',
    endTime: '11:00',
    purpose: '',
    expectedAttendees: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busySlots, setBusySlots] = useState([]);
  const [availabilityDetails, setAvailabilityDetails] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');

  useEffect(() => {
    const fetchAvailabilityDetails = async () => {
      if (resource?.id) {
        setAvailabilityLoading(true);
        try {
          const response = await axios.get(`http://localhost:8081/api/resources/${resource.id}/availability-details`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setAvailabilityDetails(response.data);
        } catch (err) {
          console.error('Failed to load availability details', err);
        } finally {
          setAvailabilityLoading(false);
        }
      }
    };
    fetchAvailabilityDetails();
  }, [resource?.id]);

  useEffect(() => {
    if (availabilityDetails && formData.bookingDate && formData.startTime && formData.endTime) {
      let isError = false;
      const { availableDays, availableStartTime, availableEndTime } = availabilityDetails;
      
      if (availableDays && availableDays.length > 0) {
        const [year, month, day] = formData.bookingDate.split('-');
        const localDateObj = new Date(year, month - 1, day);
        const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const dayOfWeek = dayNames[localDateObj.getDay()];
        
        const isDayAvailable = availableDays.some(d => d.toUpperCase() === dayOfWeek);
        if (!isDayAvailable) {
           isError = true;
        }
      }
      
      if (availableStartTime && availableEndTime) {
        const reqStart = formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime;
        const reqEnd = formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime;
        
        if (reqStart < availableStartTime || reqEnd > availableEndTime) {
           isError = true;
        }
      }
      
      if (isError) {
        const formatTime = (t) => t.substring(0, 5);
        const daysLabel = (availableDays && availableDays.length > 0) ? availableDays.map(d => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase()).join(', ') : 'all days';
        const startLabel = availableStartTime ? formatTime(availableStartTime) : 'any time';
        const endLabel = availableEndTime ? formatTime(availableEndTime) : 'any time';
        setAvailabilityError(`This resource is only available on ${daysLabel} from ${startLabel} to ${endLabel}`);
      } else {
        setAvailabilityError('');
      }
    } else {
      setAvailabilityError('');
    }
  }, [availabilityDetails, formData.bookingDate, formData.startTime, formData.endTime]);

  useEffect(() => {
    if (formData.bookingDate && resource?.id) {
      const fetchBusySlots = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:8081/api/resources/${resource.id}/busy-slots?date=${formData.bookingDate}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setBusySlots(response.data);
        } catch (err) {
          console.error('Failed to fetch busy slots', err);
        }
      };
      fetchBusySlots();
    }
  }, [formData.bookingDate, resource?.id]);

  const now = new Date();
  const localYear = now.getFullYear();
  const localMonth = String(now.getMonth() + 1).padStart(2, '0');
  const localDay = String(now.getDate()).padStart(2, '0');
  const todayLocal = `${localYear}-${localMonth}-${localDay}`;
  
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const attendeesCount = parseInt(formData.expectedAttendees, 10) || 1;
  const maxCapacity = resource.capacity ? parseInt(resource.capacity, 10) : Infinity;
  const isCapacityExceeded = attendeesCount > maxCapacity;
  
  let startTimeError = '';
  if (formData.bookingDate === todayLocal && formData.startTime) {
    if (formData.startTime < currentTime) {
      startTimeError = 'Start time cannot be in the past.';
    }
  }

  let endTimeError = '';
  if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
    endTimeError = 'End time must be after start time.';
  }

  let conflictError = '';
  if (formData.startTime && formData.endTime && !startTimeError && !endTimeError) {
    const hasOverlap = busySlots.some(slot => {
      const existingStart = slot.startTime.substring(0, 5);
      const existingEnd = slot.endTime.substring(0, 5);
      return existingStart < formData.endTime && existingEnd > formData.startTime;
    });
    if (hasOverlap) {
      conflictError = 'Selected time overlaps with an existing booking.';
    }
  }

  const isFormIncomplete = !formData.bookingDate || !formData.startTime || !formData.endTime || !formData.purpose || !formData.expectedAttendees;
  const isSubmitDisabled = loading || availabilityLoading || isCapacityExceeded || isFormIncomplete || startTimeError !== '' || endTimeError !== '' || conflictError !== '' || availabilityError !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        resourceId: resource.id,
        bookingDate: formData.bookingDate,
        startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
        endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
        purpose: formData.purpose,
        expectedAttendees: parseInt(formData.expectedAttendees, 10)
      };

      await axios.post('http://localhost:8081/api/bookings', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onSuccess(resource.name);
      onClose();
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) {
          setError('❌ Time slot already booked!');
        } else {
          setError(err.response.data?.message || 'Failed to create booking.');
        }
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#002147]/80 backdrop-blur-md p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in-up border border-white/20">
        <div className="px-8 py-8 border-b border-slate-100 flex items-center justify-between bg-[#002147] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-black tracking-tight uppercase leading-none mb-2">Reserve Resource</h2>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-blue-200 uppercase tracking-[0.2em] bg-white/10 px-2 py-1 rounded-lg border border-white/10">
                {resource.name}
              </span>
              <span className="text-[9px] font-black text-blue-100/50 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#FF9F1C]"></span>
                Cap: {resource.capacity || "N/A"}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90 relative z-10">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Deployment Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="date" name="bookingDate" required min={todayLocal}
                  value={formData.bookingDate} onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-10 pr-4 py-3 text-[13px] font-bold text-[#002147] focus:border-[#002147] transition-all focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="time" name="startTime" required value={formData.startTime}
                    onChange={handleChange}
                    className={`w-full bg-slate-50 border-2 rounded-xl pl-10 pr-4 py-3 text-[13px] font-bold transition-all focus:outline-none ${
                      startTimeError ? 'border-rose-400 text-rose-600' : 'border-slate-100 focus:border-[#002147] text-[#002147]'
                    }`}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">End Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="time" name="endTime" required value={formData.endTime}
                    onChange={handleChange}
                    className={`w-full bg-slate-50 border-2 rounded-xl pl-10 pr-4 py-3 text-[13px] font-bold transition-all focus:outline-none ${
                      endTimeError ? 'border-rose-400 text-rose-600' : 'border-slate-100 focus:border-[#002147] text-[#002147]'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
                {availabilityDetails && (availabilityDetails.availableDays?.length > 0 || availabilityDetails.availableStartTime) && (
                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                        <p className="text-[8px] font-black text-[#4DA8DA] uppercase tracking-widest leading-relaxed">
                            <span className="text-[#002147]">Operational Windows:</span> {(availabilityDetails.availableDays?.length > 0) ? availabilityDetails.availableDays.map(d => d.substring(0,3)).join(', ') : 'Daily'}
                            {availabilityDetails.availableStartTime && ` | ${availabilityDetails.availableStartTime.substring(0,5)} - ${availabilityDetails.availableEndTime.substring(0,5)}`}
                        </p>
                    </div>
                )}
                {(startTimeError || endTimeError || conflictError || availabilityError) && (
                    <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl space-y-1">
                        {startTimeError && <p className="text-[8px] font-black text-rose-500 uppercase tracking-wider flex items-center gap-2"><span>❌</span> {startTimeError}</p>}
                        {endTimeError && <p className="text-[8px] font-black text-rose-500 uppercase tracking-wider flex items-center gap-2"><span>❌</span> {endTimeError}</p>}
                        {conflictError && <p className="text-[8px] font-black text-amber-600 uppercase tracking-wider flex items-center gap-2"><span>⚠️</span> {conflictError}</p>}
                        {availabilityError && <p className="text-[8px] font-black text-rose-500 uppercase tracking-wider flex items-center gap-2"><span>⏱️</span> {availabilityError}</p>}
                    </div>
                )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Engagement Purpose</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-3.5 w-3.5 h-3.5 text-slate-400" />
                <textarea
                  name="purpose" required placeholder="Describe utility..."
                  value={formData.purpose} onChange={handleChange} rows="2"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-10 pr-4 py-3 text-[13px] font-bold text-[#002147] focus:border-[#002147] transition-all resize-none focus:outline-none"
                ></textarea>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Scale</label>
                {isCapacityExceeded && <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Threshold Exceeded</span>}
              </div>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="number" name="expectedAttendees" min="1" required
                  value={formData.expectedAttendees} onChange={handleChange}
                  className={`w-full bg-slate-50 border-2 rounded-xl pl-10 pr-4 py-3 text-[13px] font-bold transition-all focus:outline-none ${
                    isCapacityExceeded ? 'border-rose-400 text-rose-600 bg-rose-50/30' : 'border-slate-100 focus:border-[#002147] text-[#002147]'
                  }`}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl text-[9px] font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-[0.3em]">
                Abort
              </button>
              <button
                type="submit" disabled={isSubmitDisabled}
                className={`flex-[2] px-6 py-4 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isSubmitDisabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-[#FF9F1C] hover:bg-orange-500 hover:shadow-orange-500/20 active:scale-95'
                }`}
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Confirm'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingFormModal;
