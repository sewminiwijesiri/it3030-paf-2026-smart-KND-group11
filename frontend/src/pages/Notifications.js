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
          <div className="max-w-4xl mx-auto">
            
            {/* Page Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8 animate-fade-in-up">
              <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                        System Alerts
                    </span>
                    <span className="text-slate-300 text-xs font-bold">/</span>
                    <span className="text-slate-400 text-xs font-bold italic">Activity Center</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
                  Notifications
                </h1>
                <p className="text-slate-400 font-medium">Keep track of all system events and personal updates.</p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={markAllAsRead}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Mark All Read
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all notifications?')) clearNotifications();
                  }}
                  className="px-5 py-2.5 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              </div>
            </header>

            {/* Notifications List */}
            <div className="space-y-4">
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
                    className={`bg-white rounded-[2rem] border border-slate-100 p-6 flex items-start gap-6 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group cursor-pointer animate-fade-in-up ${!notif.read ? 'border-l-4 border-l-indigo-500' : ''}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${!notif.read ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <Bell className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-lg font-black tracking-tight transition-colors group-hover:text-indigo-600 ${!notif.read ? 'text-slate-900' : 'text-slate-500'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <p className={`text-sm font-medium leading-relaxed mb-4 ${!notif.read ? 'text-slate-600' : 'text-slate-400'}`}>
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${notif.type?.includes('BOOKING') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                             {notif.type || 'SYSTEM'}
                           </span>
                           {!notif.read && (
                             <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                           )}
                        </div>
                        
                        {notif.targetUrl && (
                          <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            Action Required <ChevronRight className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Note */}
            {notifications.length > 0 && (
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 rounded-full">
                        <AlertCircle className="w-4 h-4 text-slate-400" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
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
