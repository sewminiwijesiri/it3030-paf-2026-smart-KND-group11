import React, { useState, useEffect } from 'react';
import { X, Plus, Clock, AlertCircle } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ResourceForm = ({ resource, onSubmit, onCancel }) => {
  const [availabilityWindows, setAvailabilityWindows] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentWindow, setCurrentWindow] = useState({
    days: [],
    startTime: '08:00',
    endTime: '17:00'
  });

  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: 1,
    location: '',
    status: 'AVAILABLE',
    imageUrl: '',
    file: null
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
        status: resource.status,
        imageUrl: resource.imageUrl || '',
        file: null
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
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[600px] overflow-hidden animate-fade-in-up border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
              {resource ? 'Edit Resource' : 'Add New Resource'}
            </h2>
            <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
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
                <div className="col-span-1">
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
                </div>
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
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Availability Slots</label>
                  <div className={`bg-slate-50 border ${errors.availability ? 'border-rose-400 ring-2 ring-rose-50' : 'border-slate-100'} rounded-2xl p-3 space-y-3`}>
                    {availabilityWindows.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {availabilityWindows.map((window, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-white border border-slate-100 pl-2 pr-1 py-1 rounded-lg text-[9px] shadow-sm animate-fade-in-up">
                            <div className="flex gap-0.5">
                              {window.days.map(d => (
                                <span key={d} className="text-indigo-600 font-bold">{d[0]}</span>
                              ))}
                            </div>
                            <span className="text-slate-500">{window.startTime}-{window.endTime}</span>
                            <button type="button" onClick={() => removeWindow(idx)} className="text-rose-400 hover:text-rose-600 ml-1"><X size={10} /></button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {DAYS.map(day => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`w-6 h-6 rounded-md text-[9px] font-bold transition-all border ${
                              currentWindow.days.includes(day)
                                ? 'bg-indigo-600 text-white border-transparent'
                                : 'bg-white text-slate-400 border-slate-100'
                            }`}
                          >
                            {day[0]}
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="time"
                          value={currentWindow.startTime}
                          onChange={(e) => setCurrentWindow({...currentWindow, startTime: e.target.value})}
                          className="w-full bg-white border border-slate-100 rounded-lg py-1 px-2 text-[10px] focus:outline-none"
                        />
                        <span className="text-slate-300 text-[10px]">to</span>
                        <input
                          type="time"
                          value={currentWindow.endTime}
                          onChange={(e) => setCurrentWindow({...currentWindow, endTime: e.target.value})}
                          className="w-full bg-white border border-slate-100 rounded-lg py-1 px-2 text-[10px] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={addWindow}
                          className="bg-indigo-600 text-white p-1.5 rounded-lg hover:shadow-lg transition-all"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Asset Image</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-2 px-3 h-[60px]">
                    <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {previewUrl || formData.imageUrl ? (
                        <img src={previewUrl || formData.imageUrl} alt="Resource Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-[8px] text-slate-300 font-bold uppercase text-center p-1">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <input
                        type="file"
                        accept="image/*"
                        id="resource-image"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setFormData({ ...formData, file });
                            setPreviewUrl(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <label 
                        htmlFor="resource-image"
                        className="px-3 py-1.5 bg-white text-indigo-600 rounded-lg text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:bg-indigo-50 transition-all border border-indigo-100"
                      >
                        {formData.file ? 'Change' : 'Upload'}
                      </label>
                      {(previewUrl || formData.file) && (
                        <button type="button" onClick={() => { setFormData({ ...formData, file: null }); setPreviewUrl(null); }} className="text-rose-400 hover:text-rose-600"><X size={14} /></button>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Initial Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 px-4 focus:outline-none text-xs font-semibold appearance-none"
                  >
                    <option value="AVAILABLE">Active</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="OUT_OF_ORDER">Decommissioned</option>
                  </select>
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
