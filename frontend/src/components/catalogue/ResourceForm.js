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
    const trimmedName = data.name.trim();
    if (!trimmedName) newErrors.name = 'Resource name is required';
    else if (trimmedName.length < 3) newErrors.name = 'Name must be at least 3 characters';
    else if (trimmedName.length > 100) newErrors.name = 'Name cannot exceed 100 characters';

    if (!data.type) newErrors.type = 'Please select a valid resource type';

    const cap = parseInt(data.capacity);
    if (isNaN(cap)) newErrors.capacity = 'Capacity is required';
    else if (!Number.isInteger(Number(data.capacity))) newErrors.capacity = 'Capacity must be a whole number';
    else if (cap < 1) newErrors.capacity = 'Capacity must be at least 1';
    else if (cap > 1000) newErrors.capacity = 'Capacity cannot exceed 1000';

    const trimmedLoc = data.location.trim();
    if (!trimmedLoc) newErrors.location = 'Location is required';
    else if (trimmedLoc.length < 2) newErrors.location = 'Location must be at least 2 characters';
    else if (trimmedLoc.length > 100) newErrors.location = 'Location cannot exceed 100 characters';

    if (windows.length === 0) newErrors.availability = 'At least one availability slot is required';
    if (!data.status) newErrors.status = 'Please select a valid status';

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
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
    }));
    setErrors(prev => ({ ...prev, currentWindow: '' }));
  };

  const addWindow = () => {
    let windowError = '';
    if (currentWindow.days.length === 0) windowError = 'Select at least one available day';
    else if (!currentWindow.startTime) windowError = 'Start time is required';
    else if (!currentWindow.endTime) windowError = 'End time is required';
    else if (currentWindow.startTime >= currentWindow.endTime) windowError = 'End time must be later than start time';

    if (windowError) { setErrors(prev => ({ ...prev, currentWindow: windowError })); return; }

    const isDuplicate = availabilityWindows.some(w =>
      w.days.some(d => currentWindow.days.includes(d)) &&
      w.startTime === currentWindow.startTime &&
      w.endTime === currentWindow.endTime
    );
    if (isDuplicate) { setErrors(prev => ({ ...prev, currentWindow: 'Duplicate availability slot is not allowed' })); return; }

    const newWindows = [...availabilityWindows, currentWindow];
    setAvailabilityWindows(newWindows);
    setCurrentWindow({ days: [], startTime: '08:00', endTime: '17:00' });
    setErrors(prev => ({ ...prev, currentWindow: '', availability: '' }));
  };

  const removeWindow = (index) => {
    const newWindows = availabilityWindows.filter((_, i) => i !== index);
    setAvailabilityWindows(newWindows);
    if (newWindows.length === 0) setErrors(prev => ({ ...prev, availability: 'At least one availability slot is required' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = {};
    Object.keys(formData).forEach(key => allTouched[key] = true);
    setTouched(allTouched);
    const formErrors = validate(formData, availabilityWindows);
    if (Object.keys(formErrors).length > 0) { setErrors(formErrors); return; }

    const formattedWindows = availabilityWindows.map(w => `${w.days.join(',')} ${w.startTime}-${w.endTime}`);
    onSubmit({ ...formData, name: formData.name.trim(), location: formData.location.trim(), availabilityWindows: formattedWindows });
  };

  const getFieldError = (name) => touched[name] && errors[name];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[600px] overflow-hidden animate-fade-in-up border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
              {resource ? 'Edit Resource' : 'Add New Resource'}
      <div className="bg-white rounded border border-slate-200 shadow-2xl w-full max-w-[520px] overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <p className="text-[#3f4175] font-black text-[10px] uppercase tracking-[0.3em] mb-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]"></span>
              Facilities Console
            </p>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {resource ? 'Edit Resource' : 'New Resource'}
            </h2>
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
          <button onClick={onCancel} className="w-9 h-9 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Resource Name */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Resource Name</label>
              <input
                type="text" name="name" value={formData.name}
                onChange={handleChange} onBlur={handleBlur}
                className={`w-full bg-slate-50 border ${getFieldError('name') ? 'border-rose-400' : 'border-slate-200'} rounded px-5 py-4 focus:bg-white focus:border-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-sm font-bold text-slate-800 transition-all placeholder:text-slate-400 placeholder:font-medium`}
                placeholder="e.g. Main Auditorium, Lab B2"
              />
              {getFieldError('name') && <p className="text-[10px] text-rose-500 mt-1.5 font-bold flex items-center gap-1"><AlertCircle size={10}/> {errors.name}</p>}
            </div>

            {/* Type & Capacity */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Type</label>
                <select
                  name="type" value={formData.type}
                  onChange={handleChange} onBlur={handleBlur}
                  className={`w-full bg-slate-50 border ${getFieldError('type') ? 'border-rose-400' : 'border-slate-200'} rounded px-5 py-4 focus:bg-white focus:border-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-sm font-bold text-slate-800 appearance-none cursor-pointer`}
                >
                  <option value="LECTURE_HALL">Lecture Hall</option>
                  <option value="LAB">Laboratory</option>
                  <option value="MEETING_ROOM">Meeting Room</option>
                  <option value="PROJECTOR">Projector</option>
                  <option value="CAMERA">Camera</option>
                  <option value="LAPTOP">Laptop</option>
                  <option value="OTHER">Other</option>
                </select>
                {getFieldError('type') && <p className="text-[10px] text-rose-500 mt-1.5 font-bold flex items-center gap-1"><AlertCircle size={10}/> {errors.type}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Capacity</label>
                <input
                  type="number" name="capacity" value={formData.capacity}
                  onChange={handleChange} onBlur={handleBlur}
                  className={`w-full bg-slate-50 border ${getFieldError('capacity') ? 'border-rose-400' : 'border-slate-200'} rounded px-5 py-4 focus:bg-white focus:border-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-sm font-bold text-slate-800`}
                />
                {getFieldError('capacity') && <p className="text-[10px] text-rose-500 mt-1.5 font-bold flex items-center gap-1"><AlertCircle size={10}/> {errors.capacity}</p>}
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
            {/* Location & Status */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Location</label>
                <input
                  type="text" name="location" value={formData.location}
                  onChange={handleChange} onBlur={handleBlur}
                  className={`w-full bg-slate-50 border ${getFieldError('location') ? 'border-rose-400' : 'border-slate-200'} rounded px-5 py-4 focus:bg-white focus:border-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium`}
                  placeholder="Bldg A, Fl 2"
                />
                {getFieldError('location') && <p className="text-[10px] text-rose-500 mt-1.5 font-bold flex items-center gap-1"><AlertCircle size={10}/> {errors.location}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Status</label>
                <select
                  name="status" value={formData.status}
                  onChange={handleChange} onBlur={handleBlur}
                  className={`w-full bg-slate-50 border ${getFieldError('status') ? 'border-rose-400' : 'border-slate-200'} rounded px-5 py-4 focus:bg-white focus:border-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-sm font-bold text-slate-800 appearance-none cursor-pointer`}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="BUSY">Reserved</option>
                  <option value="MAINTENANCE">Under Maintenance</option>
                  <option value="OUT_OF_ORDER">Out of Service</option>
                </select>
                {getFieldError('status') && <p className="text-[10px] text-rose-500 mt-1.5 font-bold flex items-center gap-1"><AlertCircle size={10}/> {errors.status}</p>}
              </div>
            </div>

            {/* Availability Slots */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Availability Slots</label>
              <div className={`bg-slate-50 border ${errors.availability ? 'border-rose-400' : 'border-slate-200'} rounded p-5 space-y-4`}>
                
                {/* Existing Windows */}
                {availabilityWindows.length > 0 && (
                  <div className="space-y-2">
                    {availabilityWindows.map((window, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 px-4 py-3 rounded shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            {window.days.map(d => (
                              <span key={d} className="bg-[#3f4175] text-white px-1.5 py-0.5 rounded text-[9px] font-black">{d[0]}</span>
                            ))}
                          </div>
                          <span className="text-slate-600 font-bold text-xs">{window.startTime} – {window.endTime}</span>
                        </div>
                        <button type="button" onClick={() => removeWindow(idx)} className="text-rose-400 hover:text-rose-600 transition-colors w-6 h-6 rounded flex items-center justify-center hover:bg-rose-50">
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Day Selector */}
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
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Days</p>
                  <div className="flex justify-between gap-1">
                    {DAYS.map(day => (
                      <button
                        key={day} type="button" onClick={() => toggleDay(day)}
                        className={`flex-1 h-9 rounded text-[10px] font-black transition-all border ${
                          currentWindow.days.includes(day)
                            ? 'bg-[#FFD166] text-slate-900 border-[#FFCC29] shadow-sm'
                            : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {day[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Pickers */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                    <input
                      type="time" value={currentWindow.startTime}
                      onChange={(e) => setCurrentWindow({...currentWindow, startTime: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded px-3 py-3 pl-9 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]"
                    />
                  </div>
                  <span className="text-slate-400 font-black text-xs upper">to</span>
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                    <input
                      type="time" value={currentWindow.endTime}
                      onChange={(e) => setCurrentWindow({...currentWindow, endTime: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded px-3 py-3 pl-9 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]"
                    />
                  </div>
                  <button
                    type="button" onClick={addWindow}
                    className="w-10 h-10 bg-[#0F172A] text-white rounded flex items-center justify-center hover:bg-[#3f4175] transition-colors shrink-0 shadow-sm"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {errors.currentWindow && <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1"><AlertCircle size={10}/> {errors.currentWindow}</p>}
              </div>
              {errors.availability && <p className="text-[10px] text-rose-500 mt-1.5 font-bold flex items-center gap-1"><AlertCircle size={10}/> {errors.availability}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button" onClick={onCancel}
                className="flex-1 bg-slate-50 text-slate-600 font-black py-4 rounded border border-slate-200 hover:bg-slate-100 transition-all text-[11px] uppercase tracking-widest"
              >
                Discard
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#FFD166] text-slate-900 font-black py-4 rounded border border-[#FFCC29] hover:scale-[1.02] hover:bg-[#FFCC29] transition-all text-[11px] uppercase tracking-widest shadow-lg shadow-[#FFD166]/20"
              >
                {resource ? 'Update Resource' : 'Create Resource'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;
