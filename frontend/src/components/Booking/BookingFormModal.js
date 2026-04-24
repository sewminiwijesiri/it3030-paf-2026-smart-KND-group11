import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

const BookingFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({
    resourceId: '',
    bookingDate: new Date(),
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: 1,
  });
  const [error, setError] = useState('');
  const [availabilityInfo, setAvailabilityInfo] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (formData.resourceId && formData.bookingDate) {
        setAvailabilityLoading(true);
        try {
          const dateStr = format(formData.bookingDate, 'yyyy-MM-dd');
          const response = await axios.get(`http://localhost:8081/api/resources/${formData.resourceId}/availability?date=${dateStr}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setAvailabilityInfo(response.data);
        } catch (err) {
          console.error('Failed to load availability', err);
          setAvailabilityInfo(null);
        } finally {
          setAvailabilityLoading(false);
        }
      } else {
        setAvailabilityInfo(null);
      }
    };
    if (isOpen) {
      fetchAvailability();
    }
  }, [formData.resourceId, formData.bookingDate, isOpen]);

  useEffect(() => {
    if (availabilityInfo) {
      if (!availabilityInfo.isAvailable) {
        setError(availabilityInfo.reason || 'Resource not available on this day.');
      } else if (availabilityInfo.availableStartTime && availabilityInfo.availableEndTime && formData.startTime && formData.endTime) {
        const reqStart = formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime;
        const reqEnd = formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime;
        const availStart = availabilityInfo.availableStartTime;
        const availEnd = availabilityInfo.availableEndTime;

        if (reqStart < availStart || reqEnd > availEnd) {
          const formatTime = (t) => t.substring(0, 5);
          setError(`Resource only available from ${formatTime(availStart)} to ${formatTime(availEnd)} on selected days`);
        } else {
          setError('');
        }
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  }, [availabilityInfo, formData.startTime, formData.endTime]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/resources', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setResources(response.data);
      } catch (error) {
        console.error('Failed to load resources', error);
      }
    };
    if (isOpen) fetchResources();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, bookingDate: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) return;

    const formattedData = {
      ...formData,
      bookingDate: format(formData.bookingDate, 'yyyy-MM-dd'),
      startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
      endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
    };
    const success = await onSubmit(formattedData);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource</label>
            <select
              name="resourceId"
              required
              value={formData.resourceId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a resource</option>
              <option value="Computer Lab">Computer Lab</option>
              <option value="Lecture Hall">Lecture Hall</option>
              <option value="Conference Hall">Conference Hall</option>
              {resources.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.name} ({res.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <DatePicker
              selected={formData.bookingDate}
              onChange={handleDateChange}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 block"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                required
                value={formData.startTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                required
                value={formData.endTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
            <textarea
              name="purpose"
              required
              value={formData.purpose}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Attendees</label>
            <input
              type="number"
              name="expectedAttendees"
              min="1"
              required
              value={formData.expectedAttendees}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {availabilityInfo && availabilityInfo.isAvailable && availabilityInfo.availableStartTime && (
            <div className="col-span-2 text-xs text-gray-500 italic mt-1">
              Available: {availabilityInfo.availableStartTime.substring(0,5)} - {availabilityInfo.availableEndTime.substring(0,5)} on {availabilityInfo.availableDays}
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm font-medium p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!error || availabilityLoading}
              className={`px-4 py-2 text-white rounded-md font-medium ${!!error || availabilityLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {availabilityLoading ? 'Checking...' : 'Submit Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

BookingFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default BookingFormModal;
