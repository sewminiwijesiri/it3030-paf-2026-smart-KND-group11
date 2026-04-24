import React, { useState, useEffect } from 'react';
import { X, Plus, Clock, AlertCircle } from 'lucide-react';
import { resolveImageUrl } from '../../utils/imageUtils';

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

      if (resource.availableDays && resource.availableDays.length > 0) {
        const reverseMap = { 'MONDAY': 'Mon', 'TUESDAY': 'Tue', 'WEDNESDAY': 'Wed', 'THURSDAY': 'Thu', 'FRIDAY': 'Fri', 'SATURDAY': 'Sat', 'SUNDAY': 'Sun' };
        const days = resource.availableDays.map(d => reverseMap[d]).filter(Boolean);
        const startTime = resource.availableStartTime ? resource.availableStartTime.substring(0, 5) : '08:00';
        const endTime = resource.availableEndTime ? resource.availableEndTime.substring(0, 5) : '17:00';
        
        setAvailabilityWindows([{ days, startTime, endTime }]);
      } else if (resource.availabilityWindows) {
        const parsed = resource.availabilityWindows.map(window => {
          const parts = window.split(' ');
          if (parts.length < 2) return null;
          const [daysStr, timeStr] = parts;
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
    if (!trimmedName) newErrors.name = 'Required';
    else if (trimmedName.length < 3) newErrors.name = 'Too short';

    if (!data.type) newErrors.type = 'Required';
    
    const cap = parseInt(data.capacity);
    if (isNaN(cap) || cap < 1) newErrors.capacity = 'Min 1';

    if (!data.location.trim()) newErrors.location = 'Required';
    if (windows.length === 0) newErrors.availability = 'Required';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
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
  };

  const addWindow = () => {
    if (currentWindow.days.length === 0) return;
    const newWindows = [...availabilityWindows, currentWindow];
    setAvailabilityWindows(newWindows);
    setCurrentWindow({ days: [], startTime: '08:00', endTime: '17:00' });
    setErrors(prev => ({ ...prev, availability: '' }));
  };

  const removeWindow = (index) => {
    setAvailabilityWindows(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate(formData, availabilityWindows);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    const formattedWindows = availabilityWindows.map(w => `${w.days.join(',')} ${w.startTime}-${w.endTime}`);
    
    const availableDaysMap = {
        'Mon': 'MONDAY',
        'Tue': 'TUESDAY',
        'Wed': 'WEDNESDAY',
        'Thu': 'THURSDAY',
        'Fri': 'FRIDAY',
        'Sat': 'SATURDAY',
        'Sun': 'SUNDAY'
    };
    
    let availableDays = [];
    let availableStartTime = null;
    let availableEndTime = null;
    
    if (availabilityWindows.length > 0) {
        const primaryWindow = availabilityWindows[0];
        availableDays = primaryWindow.days.map(d => availableDaysMap[d]).filter(Boolean);
        availableStartTime = primaryWindow.startTime.length === 5 ? `${primaryWindow.startTime}:00` : primaryWindow.startTime;
        availableEndTime = primaryWindow.endTime.length === 5 ? `${primaryWindow.endTime}:00` : primaryWindow.endTime;
    }

    onSubmit({
      ...formData,
      availabilityWindows: formattedWindows,
      availableDays,
      availableStartTime,
      availableEndTime
    });
  };

  const getFieldError = (name) => touched[name] && errors[name];

  return (
    <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded border border-slate-200 shadow-2xl w-full max-w-[480px] overflow-hidden max-h-[95vh] flex flex-col animate-up">
        
        {/* Modal Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <p className="text-[#3f4175] font-black text-[9px] uppercase tracking-[0.3em] mb-0.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]"></span>
              Facilities Console
            </p>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {resource ? 'Edit Resource' : 'New Resource'}
            </h2>
          </div>
          <button onClick={onCancel} className="w-9 h-9 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-3 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-2">

            {/* Resource Name */}
            <div>
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Resource Name</label>
              <input
                type="text" name="name" value={formData.name}
                onChange={handleChange} onBlur={handleBlur}
                className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 focus:bg-white focus:border-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-sm font-bold text-slate-800 transition-all placeholder:text-slate-400 placeholder:font-medium"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 focus:bg-white focus:border-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-sm font-bold text-slate-800 appearance-none cursor-pointer"
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
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Capacity</label>
                  <input
                    type="number" name="capacity" value={formData.capacity}
                    onChange={handleChange} onBlur={handleBlur}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 focus:bg-white focus:border-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-sm font-bold text-slate-800"
                  />
              </div>
            </div>

            {/* Location & Status */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Location</label>
                  <input
                    type="text" name="location" value={formData.location}
                    onChange={handleChange} onBlur={handleBlur}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 focus:bg-white focus:border-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-sm font-bold text-slate-800 transition-all"
                    placeholder="e.g. Block A, Floor 2"
                  />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Status</label>
                  <select
                    name="status" value={formData.status}
                    onChange={handleChange} onBlur={handleBlur}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 focus:bg-white focus:border-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F172A] text-sm font-bold text-slate-800 appearance-none cursor-pointer"
                  >
                  <option value="AVAILABLE">Available</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="OUT_OF_ORDER">Out of Order</option>
                </select>
              </div>
            </div>

            {/* Availability Slots */}
            <div className="bg-slate-50 border border-slate-200 rounded p-3">
              <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Availability Schedule</label>
              
              {availabilityWindows.length > 0 && (
                <div className="space-y-2 mb-6">
                  {availabilityWindows.map((window, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 px-3 py-1.5 rounded shadow-sm group">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {window.days.map(d => (
                            <span key={d} className="bg-slate-100 text-[#3f4175] px-1.5 py-0.5 rounded font-black text-[9px]">{d[0]}</span>
                          ))}
                        </div>
                        <span className="text-slate-500 font-bold text-[11px] font-mono tracking-tight">{window.startTime} - {window.endTime}</span>
                      </div>
                      <button type="button" onClick={() => removeWindow(idx)} className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Select Days</p>
                <div className="flex justify-between gap-1">
                  {DAYS.map(day => (
                    <button
                      key={day} type="button" onClick={() => toggleDay(day)}
                      className={`flex-1 h-7 rounded text-[10px] font-black transition-all border ${
                        currentWindow.days.includes(day)
                          ? 'bg-[#FFD166] text-slate-900 border-[#FFCC29] shadow-sm'
                          : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {day[0]}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                    <input
                      type="time" value={currentWindow.startTime}
                      onChange={(e) => setCurrentWindow({...currentWindow, startTime: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-2 pl-8 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]"
                    />
                  </div>
                  <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">to</span>
                  <div className="relative flex-1">
                    <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                    <input
                      type="time" value={currentWindow.endTime}
                      onChange={(e) => setCurrentWindow({...currentWindow, endTime: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-2 pl-8 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]"
                    />
                  </div>
                  <button
                    type="button" onClick={addWindow}
                    className="w-9 h-9 bg-[#0F172A] text-white rounded flex items-center justify-center hover:bg-[#3f4175] transition-colors shrink-0 shadow-sm"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              {errors.availability && <p className="text-[9px] text-rose-500 mt-2 font-bold flex items-center gap-1"><AlertCircle size={9}/> {errors.availability}</p>}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2.5 flex items-center justify-between">
                <div>
                  <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Asset Image</label>
                  <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">CDN Accelerated Upload</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white border border-slate-200 rounded flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                    {previewUrl || formData.imageUrl ? (
                      <img src={previewUrl || resolveImageUrl(formData.imageUrl)} alt="Asset Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[7px] text-slate-300 font-black uppercase text-center leading-tight">NONE</div>
                    )}
                  </div>
                  <input
                    type="file" accept="image/*" id="resource-image" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData({ ...formData, file });
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <label 
                      htmlFor="resource-image"
                      className="px-3 py-1.5 bg-white text-slate-900 border border-slate-200 rounded text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-50 transition-all shadow-sm"
                    >
                      {formData.file || formData.imageUrl ? 'Change' : 'Select'}
                    </label>
                    {(previewUrl || formData.file) && (
                      <button 
                        type="button" onClick={() => { setFormData({ ...formData, file: null }); setPreviewUrl(null); }}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                         <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-3 border-t border-slate-100 p-4 bg-slate-50/50 mt-auto">
              <button
                type="button" onClick={onCancel}
                className="flex-1 bg-white text-slate-600 font-black py-2.5 rounded border border-slate-200 hover:bg-slate-100 transition-all text-[10px] uppercase tracking-widest"
              >
                Discard
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#FFD166] text-slate-900 font-black py-2.5 rounded border border-[#FFCC29] hover:bg-[#FFD166] hover:scale-[1.01] active:scale-[0.99] transition-all text-[10px] uppercase tracking-widest shadow-lg shadow-[#FFD166]/20"
              >
                {resource ? 'Sync Changes' : 'Deploy Resource'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;
