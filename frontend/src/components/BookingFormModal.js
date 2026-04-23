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
  const isSubmitDisabled = loading || isCapacityExceeded || isFormIncomplete || startTimeError !== '' || endTimeError !== '' || conflictError !== '';

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
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden relative animate-fade-in-up">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-800">Book Resource</h2>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Submit a new request</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {/* Resource Info */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 mb-8">
            <h3 className="font-black text-indigo-900 text-lg">{resource.name}</h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs font-bold text-indigo-600 bg-white px-3 py-1 rounded-full shadow-sm">
                📍 {resource.location}
              </span>
              <span className="text-xs font-bold text-indigo-600 bg-white px-3 py-1 rounded-full shadow-sm">
                👥 Capacity: {resource.capacity || 'N/A'}
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}

          {conflictError && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-sm font-bold flex items-center gap-2">
              ⚠️ {conflictError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Date
              </label>
              <input
                type="date"
                name="bookingDate"
                required
                min={todayLocal}
                value={formData.bookingDate}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5 relative">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  required
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 transition-all ${
                    startTimeError ? 'border-rose-300 text-rose-600 focus:ring-rose-500' : 'border-slate-200 text-slate-700 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
                {startTimeError && (
                  <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                    ⚠️ {startTimeError}
                  </p>
                )}
              </div>
              <div className="space-y-1.5 relative">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  required
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 transition-all ${
                    endTimeError ? 'border-rose-300 text-rose-600 focus:ring-rose-500' : 'border-slate-200 text-slate-700 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
                {endTimeError && (
                  <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                    ⚠️ {endTimeError}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <AlignLeft className="w-3.5 h-3.5" /> Purpose
              </label>
              <textarea
                name="purpose"
                required
                placeholder="e.g., Group meeting, Project presentation"
                value={formData.purpose}
                onChange={handleChange}
                rows="3"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> Expected Attendees
              </label>
              <input
                type="number"
                name="expectedAttendees"
                min="1"
                max={resource.capacity || ''}
                required
                value={formData.expectedAttendees}
                onChange={handleChange}
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 transition-all ${
                  isCapacityExceeded 
                    ? 'border-rose-300 text-rose-600 focus:ring-rose-500' 
                    : 'border-slate-200 text-slate-700 focus:ring-indigo-500'
                }`}
              />
              {isCapacityExceeded && (
                <p className="text-xs font-bold text-rose-500 mt-2 flex items-center gap-1">
                  ⚠️ Attendees cannot exceed capacity ({resource.capacity})
                </p>
              )}
            </div>

            <div className="pt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-xl text-sm font-black text-slate-500 hover:bg-slate-100 transition-colors uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`flex-1 px-6 py-4 rounded-xl text-sm font-black text-white uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isSubmitDisabled 
                    ? 'bg-slate-300 shadow-none cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Booking'
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
