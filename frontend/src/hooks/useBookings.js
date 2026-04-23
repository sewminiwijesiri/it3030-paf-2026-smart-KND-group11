import { useState, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import toast from 'react-hot-toast';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to fetch personal bookings';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllBookings = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getAllBookings(filters);
      setBookings(data);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to fetch all bookings';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = async (bookingData) => {
    try {
      await bookingService.createBooking(bookingData);
      toast.success('Booking created successfully!');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create booking';
      toast.error(errMsg);
      return false;
    }
  };

  const updateStatus = async (id, status, reason = '') => {
    try {
      const updatedBooking = await bookingService.updateStatus(id, status, reason);
      setBookings(prev => prev.map(b => b.id === id ? updatedBooking : b));
      toast.success(`Booking status updated to ${status}`);
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update booking status';
      toast.error(errMsg);
      return false;
    }
  };

  const cancelBooking = async (id) => {
    try {
      await bookingService.cancelBooking(id);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
      toast.success('Booking cancelled successfully');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to cancel booking';
      toast.error(errMsg);
      return false;
    }
  };

  return {
    bookings,
    loading,
    error,
    fetchMyBookings,
    fetchAllBookings,
    createBooking,
    updateStatus,
    cancelBooking
  };
};
