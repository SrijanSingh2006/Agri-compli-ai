import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';

export function AlertsInterface() {
  const [autoReminder, setAutoReminder] = useState(true);

  const notifications = [
    { 
      id: 1, 
      type: 'critical', 
      title: 'TDS Payment Missed', 
      date: 'Feb 07, 2026', 
      desc: 'Deadline for TDS payment of Jan salaries was Feb 7. Action required immediately to avoid penalties.',
      action: 'Pay Now'
    },
    { 
      id: 2, 
      type: 'warning', 
      title: 'GST Filing Deadline', 
      date: 'March 10, 2026', 
      desc: 'GSTR-1 filing is due in 10 days. All invoices should be uploaded by March 8.',
      action: 'Start Filing'
    },
    { 
      id: 3, 
      type: 'info', 
      title: 'EPF Deposit Reminder', 
      date: 'March 15, 2026', 
      desc: 'EPF contributions for Feb are due on March 15. Draft is ready for review.',
      action: 'Review Draft'
    }
  ];

  const upcomingDeadlines = [
    { date: 'Feb 28', title: 'Professional Tax (State)', days: 2 },
    { date: 'Mar 07', title: 'TDS Payment (Monthly)', days: 9 },
    { date: 'Mar 10', title: 'GSTR-1 Filing', days: 12 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Recent Notifications</h2>
          <button className="text-sm text-blue-600 font-semibold hover:underline">Mark all as read</button>
        </div>

        <div className="space-y-4">
          {notifications.map((notif) => (
            <motion.div 
              key={notif.id}
              whileHover={{ scale: 1.005 }}
              className={`p-5 rounded-2xl border ${
                notif.type === 'critical' ? 'bg-rose-50 border-rose-100' : 
                notif.type === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-100'
              } shadow-sm`}
            >
              <div className="flex gap-4">
                <div className={`mt-1 p-2 rounded-xl ${
                  notif.type === 'critical' ? 'bg-rose-100 text-rose-600' : 
                  notif.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {notif.type === 'critical' ? <AlertTriangle size={20} /> : <Bell size={20} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-900">{notif.title}</h4>
                    <span className="text-xs font-medium text-slate-500">{notif.date}</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">{notif.desc}</p>
                  <div className="flex gap-3">
                    <button className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                      notif.type === 'critical' ? 'bg-rose-600 text-white hover:bg-rose-700' : 
                      notif.type === 'warning' ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}>
                      {notif.action}
                    </button>
                    <button className="px-4 py-1.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" /> Upcoming
            </h3>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold text-slate-500">FEB - MAR</span>
          </div>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                  <span className="text-xs font-bold text-slate-400 group-hover:text-blue-400">{deadline.date.split(' ')[0]}</span>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-blue-800">{deadline.date.split(' ')[1]}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800">{deadline.title}</h4>
                  <p className="text-xs text-slate-500">In {deadline.days} days</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Automation</h3>
            <Settings size={18} className="text-slate-400" />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Auto Reminders</p>
              <p className="text-xs text-slate-500">Email & Mobile alerts</p>
            </div>
            <button 
              onClick={() => setAutoReminder(!autoReminder)}
              className={`w-12 h-6 rounded-full transition-colors relative ${autoReminder ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${autoReminder ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-slate-50">
            <div>
              <p className="text-sm font-semibold text-slate-800">Penalty Prediction</p>
              <p className="text-xs text-slate-500">AI-driven risk analysis</p>
            </div>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
