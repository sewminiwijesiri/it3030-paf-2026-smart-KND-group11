import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Trash2, CheckCircle, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import TechnicianSidebar from '../components/TechnicianSidebar';

const Notifications = () => {
  const { notifications, markAllAsRead, clearNotifications } = useNotifications();
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'USER';

  const renderSidebar = () => {
    switch (role) {
      case 'ADMIN': return <AdminSidebar />;
      case 'TECHNICIAN': return <TechnicianSidebar />;
      default: return <Sidebar />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />
      
      <div className="flex flex-1 pt-[72px]">
        {renderSidebar()}

        <main className={`flex-1 lg:ml-64 p-6 md:p-10 transition-all duration-300`}>
          <div className="max-w-6xl mx-auto w-full">
            
            {/* Page Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8 animate-fade-in-up">
              <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-0.5 bg-[#0F172A] text-white text-[7px] font-black uppercase tracking-[0.3em] rounded">
                        System Alerts
                    </span>
                    <span className="text-slate-300 text-[10px] font-bold">/</span>
                    <span className="text-slate-400 text-[10px] font-bold italic opacity-60">Activity Center</span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1.5">
                  Notifications
                </h1>
                <p className="text-slate-500 font-bold text-xs">Manage system events and personal updates.</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-[#0F172A] hover:border-slate-300 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                >
                  <CheckCircle className="w-3 h-3" /> Mark All Read
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all notifications?')) clearNotifications();
                  }}
                  className="px-4 py-2 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white hover:border-rose-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                >
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              </div>
            </header>

            {/* Notifications List */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* Notifications List - Main Column */}
              <div className="xl:col-span-8 space-y-4">
                {notifications.length === 0 ? (
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center shadow-sm animate-fade-in">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                      <Bell className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">Inbox is Empty</h3>
                    <p className="text-slate-400 text-sm font-medium">When you receive alerts, they'll appear here.</p>
                  </div>
                ) : (
                  notifications.map((notif, index) => (
                    <div 
                      key={notif.id || index}
                      onClick={() => {
                        if (notif.targetUrl) navigate(notif.targetUrl);
                      }}
                      className={`bg-white rounded-2xl border border-slate-200/60 p-4 flex items-center gap-4 hover:shadow-lg hover:border-slate-300 transition-all duration-300 group cursor-pointer animate-fade-in-up relative overflow-hidden ${!notif.read ? 'bg-slate-50/30' : ''}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {!notif.read && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#FFD166]"></div>
                      )}

                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all ${!notif.read ? 'bg-[#0F172A] border-[#0F172A] text-[#FFD166]' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                        <Bell className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className={`text-[13px] font-black tracking-tight transition-colors group-hover:text-[#0F172A] leading-none ${!notif.read ? 'text-slate-900' : 'text-slate-500'}`}>
                              {notif.title}
                            </h4>
                            <span className={`px-1.5 py-0.5 rounded-[4px] text-[7px] font-black uppercase tracking-widest border flex items-center h-4 ${
                              notif.type?.includes('BOOKING') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                              notif.type?.includes('MAINTENANCE') ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              'bg-slate-50 text-slate-500 border-slate-100'}`}>
                              {notif.type || 'SYSTEM'}
                            </span>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 opacity-70 h-4">
                              <Clock className="w-2 h-2" /> {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        
                        <p className={`text-[10px] font-bold leading-relaxed mb-1 ${!notif.read ? 'text-slate-600' : 'text-slate-400'}`}>
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             {!notif.read && (
                               <div className="flex items-center gap-1.5">
                                 <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166] animate-pulse"></span>
                                 <span className="text-[7px] font-black text-[#FFD166] uppercase tracking-widest">New Update</span>
                               </div>
                             )}
                          </div>
                          
                          {notif.targetUrl && (
                            <div className="text-[9px] font-black text-[#0F172A] uppercase tracking-[0.2em] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                              Navigate <ChevronRight className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Activity Insights - Side Column */}
              <div className="xl:col-span-4 space-y-6 sticky top-24">
                <div className="bg-[#0F172A] rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD166] opacity-10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-slate-400">Activity Summary</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Alerts</p>
                      <p className="text-3xl font-black text-[#FFD166]">{notifications.length}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Unread</p>
                        <p className="text-xl font-black text-white">{notifications.filter(n => !n.read).length}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Archived</p>
                        <p className="text-xl font-black text-white">0</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-1 h-3 bg-[#FFD166] rounded-full"></span>
                    Quick Filters
                  </h3>
                  <div className="space-y-3">
                    {['ALL ALERTS', 'BOOKINGS', 'MAINTENANCE', 'SYSTEM'].map(filter => (
                      <button key={filter} className="w-full text-left px-4 py-3 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 hover:text-[#0F172A] transition-all border border-transparent hover:border-slate-100">
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            {notifications.length > 0 && (
                <div className="mt-8 text-center pb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg">
                        <AlertCircle className="w-3 h-3 text-slate-400" />
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            History is stored locally on this device
                        </p>
                    </div>
                </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
