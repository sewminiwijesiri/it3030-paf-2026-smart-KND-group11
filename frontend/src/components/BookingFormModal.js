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
          setError('❌ Time slot already booked! Please choose different time.');
        } else if (err.response.status === 400) {
          setError('Validation error: Please check your form fields.');
        } else if (err.response.status === 401) {
          setError('Please login again');
        } else {
          setError('Failed to create booking. Please try again.');
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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[1.5rem] shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-black text-slate-800">Book {resource.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">📍 {resource.location}</span>
                <span className="text-slate-200">|</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">👥 Capacity: {resource.capacity || 'N/A'}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-[11px] font-bold flex items-center gap-2">
              <span className="shrink-0 text-lg">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date Section */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Booking Date
              </label>
              <input
                type="date"
                name="bookingDate"
                required
                min={todayLocal}
                value={formData.bookingDate}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Start
                </label>
                <input
                  type="time"
                  name="startTime"
                  required
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 transition-all ${
                    startTimeError ? 'border-rose-300 text-rose-600 focus:ring-rose-500' : 'border-slate-200 text-slate-700 focus:ring-indigo-500'
                  }`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3 h-3" /> End
                </label>
                <input
                  type="time"
                  name="endTime"
                  required
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 transition-all ${
                    endTimeError ? 'border-rose-300 text-rose-600 focus:ring-rose-500' : 'border-slate-200 text-slate-700 focus:ring-indigo-500'
                  }`}
                />
              </div>
            </div>

            {/* Inline Errors for Time */}
            {(startTimeError || endTimeError || conflictError || availabilityError) && (
              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl space-y-1">
                {startTimeError && <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1">❌ {startTimeError}</p>}
                {endTimeError && <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1">❌ {endTimeError}</p>}
                {conflictError && <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1">⚠️ {conflictError}</p>}
                {availabilityError && <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1">⏱️ {availabilityError}</p>}
              </div>
            )}

            {/* Purpose */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <AlignLeft className="w-3 h-3" /> Purpose
              </label>
              <textarea
                name="purpose"
                required
                placeholder="Briefly describe the booking purpose..."
                value={formData.purpose}
                onChange={handleChange}
                rows="2"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
              ></textarea>
            </div>

            {/* Attendees */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-3 h-3" /> Attendees
                </label>
                {isCapacityExceeded && (
                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Capacity Exceeded!</span>
                )}
              </div>
              <input
                type="number"
                name="expectedAttendees"
                min="1"
                required
                value={formData.expectedAttendees}
                onChange={handleChange}
                className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 transition-all ${
                  isCapacityExceeded ? 'border-rose-400 text-rose-600 focus:ring-rose-500 bg-rose-50/30' : 'border-slate-200 text-slate-700 focus:ring-indigo-500'
                }`}
              />
            </div>

            {/* Submit Actions */}
            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl text-[11px] font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`flex-[2] px-6 py-3.5 rounded-xl text-[11px] font-black text-white uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isSubmitDisabled 
                    ? 'bg-slate-200 shadow-none cursor-not-allowed text-slate-400' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingFormModal;
