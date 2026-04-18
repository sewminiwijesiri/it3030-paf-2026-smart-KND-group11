import React, { useState, useEffect } from 'react';
import { X, Plus, Clock, AlertCircle } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ResourceForm = ({ resource, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: 1,
    location: '',
    status: 'AVAILABLE'
  });

  const [availabilityWindows, setAvailabilityWindows] = useState([]);
  const [currentWindow, setCurrentWindow] = useState({
    days: [],
    startTime: '08:00',
    endTime: '17:00'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name,
        type: resource.type,
        capacity: resource.capacity,
        location: resource.location,
        status: resource.status
      });

      if (resource.availabilityWindows) {
        const parsed = resource.availabilityWindows.map(window => {
          const [daysStr, timeStr] = window.split(' ');
          if (!daysStr || !timeStr) return null;
          const days = daysStr.split(',');
          const [startTime, endTime] = timeStr.split('-');
          return { days, startTime, endTime };
        }).filter(w => w !== null);
        setAvailabilityWindows(parsed);
      }
    }
  }, [resource]);

  const validate = (data = formData, windows = availabilityWindows) => {
    const newErrors = {};

    // Name Validation
    const trimmedName = data.name.trim();
    if (!trimmedName) {
      newErrors.name = 'Resource name is required';
    } else if (trimmedName.length < 3) {
      newErrors.name = 'Resource name must be at least 3 characters';
    } else if (trimmedName.length > 100) {
      newErrors.name = 'Resource name cannot exceed 100 characters';
    }

    // Type Validation
    if (!data.type) {
      newErrors.type = 'Please select a valid resource type';
    }

    // Capacity Validation
    const cap = parseInt(data.capacity);
    if (isNaN(cap)) {
      newErrors.capacity = 'Capacity is required';
    } else if (!Number.isInteger(Number(data.capacity))) {
      newErrors.capacity = 'Capacity must be a whole number';
    } else if (cap < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    } else if (cap > 1000) {
      newErrors.capacity = 'Capacity cannot exceed 1000';
    }

    // Location Validation
    const trimmedLoc = data.location.trim();
    if (!trimmedLoc) {
      newErrors.location = 'Location is required';
    } else if (trimmedLoc.length < 2) {
      newErrors.location = 'Location must be at least 2 characters';
    } else if (trimmedLoc.length > 100) {
      newErrors.location = 'Location cannot exceed 100 characters';
    }

    // Availability Validation
    if (windows.length === 0) {
      newErrors.availability = 'At least one availability slot is required';
    }

    // Status Validation
    if (!data.status) {
      newErrors.status = 'Please select a valid status';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    
    if (touched[name]) {
      const fieldErrors = validate(newData, availabilityWindows);
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldErrors = validate(formData, availabilityWindows);
    setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
  };

  const toggleDay = (day) => {
    setCurrentWindow(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
    setErrors(prev => ({ ...prev, currentWindow: '' }));
  };

  const addWindow = () => {
    let windowError = '';
    if (currentWindow.days.length === 0) {
      windowError = 'Select at least one available day';
    } else if (!currentWindow.startTime) {
      windowError = 'Start time is required';
    } else if (!currentWindow.endTime) {
      windowError = 'End time is required';
    } else if (currentWindow.startTime >= currentWindow.endTime) {
      windowError = 'End time must be later than start time';
    }

    if (windowError) {
      setErrors(prev => ({ ...prev, currentWindow: windowError }));
      return;
    }

    // Check for duplicate day slots
    const isDuplicate = availabilityWindows.some(w => 
      w.days.some(d => currentWindow.days.includes(d)) &&
      w.startTime === currentWindow.startTime &&
      w.endTime === currentWindow.endTime
    );

    if (isDuplicate) {
      setErrors(prev => ({ ...prev, currentWindow: 'Duplicate availability slot is not allowed' }));
      return;
    }

    const newWindows = [...availabilityWindows, currentWindow];
    setAvailabilityWindows(newWindows);
    setCurrentWindow({ days: [], startTime: '08:00', endTime: '17:00' });
    setErrors(prev => ({ ...prev, currentWindow: '', availability: '' }));
  };

  const removeWindow = (index) => {
    const newWindows = availabilityWindows.filter((_, i) => i !== index);
    setAvailabilityWindows(newWindows);
    if (newWindows.length === 0) {
      setErrors(prev => ({ ...prev, availability: 'At least one availability slot is required' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => allTouched[key] = true);
    setTouched(allTouched);

    const formErrors = validate(formData, availabilityWindows);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const formattedWindows = availabilityWindows.map(w => 
      `${w.days.join(',')} ${w.startTime}-${w.endTime}`
    );
    
    onSubmit({
      ...formData,
      name: formData.name.trim(),
      location: formData.location.trim(),
      availabilityWindows: formattedWindows
    });
  };

  const getFieldError = (name) => touched[name] && errors[name];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden animate-fade-in-up border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="p-7">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
              {resource ? 'Edit Resource' : 'New Resource'}
            </h2>
            <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Resource Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-slate-50 border ${getFieldError('name') ? 'border-rose-400 ring-2 ring-rose-50' : 'border-slate-100'} rounded-2xl py-2.5 px-4 focus:ring-4 focus:ring-indigo-500/5 focus:border-[var(--primary)] focus:bg-white focus:outline-none text-xs font-semibold transition-all`}
                  placeholder="e.g. Main Auditorium"
                />
                {getFieldError('name') && <p className="text-[10px] text-rose-500 mt-1 ml-1 font-medium flex items-center gap-1"><AlertCircle size={10}/> {errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-slate-50 border ${getFieldError('type') ? 'border-rose-400 ring-2 ring-rose-50' : 'border-slate-100'} rounded-2xl py-2.5 px-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-[var(--primary)] focus:bg-white text-xs font-semibold appearance-none`}
                  >
                    <option value="LECTURE_HALL">Lecture Hall</option>
                    <option value="LAB">Laboratory</option>
                    <option value="MEETING_ROOM">Meeting Room</option>
                    <option value="PROJECTOR">Projector</option>
                    <option value="CAMERA">Camera</option>
                    <option value="LAPTOP">Laptop</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {getFieldError('type') && <p className="text-[10px] text-rose-500 mt-1 ml-1 font-medium flex items-center gap-1"><AlertCircle size={10}/> {errors.type}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-slate-50 border ${getFieldError('capacity') ? 'border-rose-400 ring-2 ring-rose-50' : 'border-slate-100'} rounded-2xl py-2.5 px-4 focus:ring-4 focus:ring-indigo-500/5 focus:border-[var(--primary)] focus:bg-white focus:outline-none text-xs font-semibold`}
                  />
                  {getFieldError('capacity') && <p className="text-[10px] text-rose-500 mt-1 ml-1 font-medium flex items-center gap-1"><AlertCircle size={10}/> {errors.capacity}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Availability Slots</label>
                <div className={`bg-slate-50 border ${errors.availability ? 'border-rose-400 ring-2 ring-rose-50' : 'border-slate-100'} rounded-2xl p-4 space-y-4`}>
                  {availabilityWindows.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {availabilityWindows.map((window, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white border border-slate-100 px-3 py-2 rounded-xl text-[11px] shadow-sm animate-fade-in-up">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {window.days.map(d => (
                                <span key={d} className="bg-indigo-50 text-indigo-600 px-1 rounded font-bold text-[9px]">{d[0]}</span>
                              ))}
                            </div>
                            <span className="text-slate-500 font-medium">{window.startTime} - {window.endTime}</span>
                          </div>
                          <button type="button" onClick={() => removeWindow(idx)} className="text-rose-400 hover:text-rose-600 transition-colors"><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between gap-1">
                      {DAYS.map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`w-8 h-8 rounded-full text-[10px] font-bold transition-all border ${
                            currentWindow.days.includes(day)
                              ? 'bg-[var(--primary)] text-white border-transparent shadow-lg shadow-indigo-100'
                              : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                          }`}
                        >
                          {day[0]}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <div className="relative flex-1">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                          type="time"
                          value={currentWindow.startTime}
                          onChange={(e) => setCurrentWindow({...currentWindow, startTime: e.target.value})}
                          className="w-full bg-white border border-slate-100 rounded-xl py-1.5 pl-9 pr-3 text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                       </div>
                       <span className="text-slate-300 text-xs">to</span>
                       <div className="relative flex-1">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                          type="time"
                          value={currentWindow.endTime}
                          onChange={(e) => setCurrentWindow({...currentWindow, endTime: e.target.value})}
                          className="w-full bg-white border border-slate-100 rounded-xl py-1.5 pl-9 pr-3 text-[11px] focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                       </div>
                       <button
                        type="button"
                        onClick={addWindow}
                        className="bg-indigo-50 text-indigo-600 p-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                       >
                        <Plus size={16} />
                       </button>
                    </div>
                    {errors.currentWindow && <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1"><AlertCircle size={10}/> {errors.currentWindow}</p>}
                  </div>
                </div>
                {errors.availability && <p className="text-[10px] text-rose-500 mt-1 ml-1 font-medium flex items-center gap-1"><AlertCircle size={10}/> {errors.availability}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-slate-50 border ${getFieldError('location') ? 'border-rose-400 ring-2 ring-rose-50' : 'border-slate-100'} rounded-2xl py-2.5 px-4 focus:ring-4 focus:ring-indigo-500/5 focus:border-[var(--primary)] focus:bg-white focus:outline-none text-xs font-semibold`}
                    placeholder="Bldg A, Fl 2"
                  />
                  {getFieldError('location') && <p className="text-[10px] text-rose-500 mt-1 ml-1 font-medium flex items-center gap-1"><AlertCircle size={10}/> {errors.location}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-slate-50 border ${getFieldError('status') ? 'border-rose-400 ring-2 ring-rose-50' : 'border-slate-100'} rounded-2xl py-2.5 px-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-[var(--primary)] focus:bg-white text-xs font-semibold appearance-none`}
                  >
                    <option value="AVAILABLE">Active (Available)</option>
                    <option value="BUSY">Reserved</option>
                    <option value="MAINTENANCE">Under Maintenance</option>
                    <option value="OUT_OF_ORDER">Out of Service</option>
                  </select>
                  {getFieldError('status') && <p className="text-[10px] text-rose-500 mt-1 ml-1 font-medium flex items-center gap-1"><AlertCircle size={10}/> {errors.status}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-slate-50 text-slate-500 font-bold py-3.5 rounded-2xl hover:bg-slate-100 transition-all text-xs border border-transparent hover:border-slate-200"
              >
                Discard
              </button>
              <button
                type="submit"
                className="flex-1 bg-[var(--primary)] text-white font-bold py-3.5 rounded-2xl hover:shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-0.5 transition-all text-xs"
              >
                {resource ? 'Update Changes' : 'Create Resource'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;
