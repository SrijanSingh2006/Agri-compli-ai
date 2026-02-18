import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight,
  ShieldCheck,
  Globe,
  MapPin
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

const data = [
  { name: 'Completed', value: 8, color: '#10b981' },
  { name: 'Pending', value: 3, color: '#f59e0b' },
  { name: 'Overdue', value: 1, color: '#ef4444' },
];

const barData = [
  { month: 'Jan', count: 4 },
  { month: 'Feb', count: 6 },
  { month: 'Mar', count: 3 },
  { month: 'Apr', count: 5 },
  { month: 'May', count: 7 },
  { month: 'Jun', count: 4 },
];

export function Dashboard() {
  const centralCompliances = [
    { id: 1, title: 'GST Filing (GSTR-1)', due: '2026-03-10', status: 'pending', desc: 'Monthly return for outward supplies.' },
    { id: 2, title: 'EPF Contribution', due: '2026-02-15', status: 'completed', desc: 'Employees Provident Fund monthly deposit.' },
    { id: 3, title: 'TDS Payment', due: '2026-03-07', status: 'pending', desc: 'Tax Deducted at Source for professional fees.' },
  ];

  const stateCompliances = [
    { id: 4, title: 'Professional Tax', due: '2026-02-28', status: 'pending', desc: 'State-level tax on professions and trades.' },
    { id: 5, title: 'Trade License Renewal', due: '2026-03-31', status: 'completed', desc: 'Annual municipal corporation compliance.' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Compliance Health</p>
            <h3 className="text-2xl font-bold mt-1 text-emerald-600">Excellent</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <ShieldCheck size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Upcoming Deadlines</p>
            <h3 className="text-2xl font-bold mt-1">4 Pending</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
            <Clock size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Critical Alerts</p>
            <h3 className="text-2xl font-bold mt-1 text-rose-600">1 Overdue</h3>
          </div>
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Compliance List */}
        <div className="space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold">Central Compliances</h2>
            </div>
            <div className="space-y-4">
              {centralCompliances.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 hover:border-blue-100 transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-800">{item.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                      item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-3">{item.desc}</p>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Clock size={14} />
                      Due: {item.due}
                    </div>
                    <button className="text-blue-600 text-xs font-bold flex items-center gap-0.5 hover:underline">
                      View Details <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold">State Compliances</h2>
            </div>
            <div className="space-y-4">
              {stateCompliances.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 hover:border-blue-100 transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-800">{item.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                      item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-3">{item.desc}</p>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Clock size={14} />
                      Due: {item.due}
                    </div>
                    <button className="text-blue-600 text-xs font-bold flex items-center gap-0.5 hover:underline">
                      View Details <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Charts & Analytics */}
        <div className="space-y-6 min-w-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-auto overflow-hidden">
            <h2 className="text-lg font-bold mb-6">Status Distribution</h2>
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {data.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-slate-600 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-auto overflow-hidden">
            <h2 className="text-lg font-bold mb-6">Compliance Filing History</h2>
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
