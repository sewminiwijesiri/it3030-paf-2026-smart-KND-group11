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
      // Sort by createdAt descending (newest first)
      const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.id);
        const dateB = new Date(b.createdAt || b.id);
        return dateB - dateA;
      });
      setBookings(sortedData);
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
      // Sort by createdAt descending (newest first)
      const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.id);
        const dateB = new Date(b.createdAt || b.id);
        return dateB - dateA;
      });
      setBookings(sortedData);
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
      setBookings(prev => prev.filter(b => b.id !== id));
      toast.success('Booking removed successfully');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to remove booking';
      toast.error(errMsg);
      return false;
    }
  };

  const bulkDeleteBookings = async (ids) => {
    try {
      // Local-only clear as requested by user
      setBookings(prev => prev.filter(b => !ids.includes(b.id)));
      toast.success(`${ids.length} records cleared from view`);
      return true;
    } catch (err) {
      toast.error('Failed to clear records');
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
    cancelBooking,
    bulkDeleteBookings
  };
};
