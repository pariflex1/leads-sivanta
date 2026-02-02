
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, YAxis, CartesianGrid } from 'recharts';

interface OverviewViewProps {
  onOpenMenu: () => void;
}

const OverviewView: React.FC<OverviewViewProps> = ({ onOpenMenu }) => {
  const pieData = [
    { name: 'Active', value: 40, color: '#197fe6' },
    { name: 'Warm', value: 30, color: '#60a5fa' },
    { name: 'Cold', value: 20, color: '#cbd5e1' },
    { name: 'New', value: 10, color: '#f1f5f9' },
  ];

  const barData = [
    { day: 'Mon', value: 60 },
    { day: 'Tue', value: 85 },
    { day: 'Wed', value: 45 },
    { day: 'Thu', value: 95 },
    { day: 'Fri', value: 70 },
    { day: 'Sat', value: 30 },
    { day: 'Sun', value: 20 },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-background-light dark:bg-background-dark overflow-x-hidden w-full">
      <header className="sticky top-0 z-10 py-3 md:py-4 flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 md:px-6 border-b border-slate-100 dark:border-slate-800 gap-2 w-full">
        <button onClick={onOpenMenu} className="lg:hidden text-slate-900 dark:text-white p-1 shrink-0">
          <span className="material-symbols-outlined text-[26px] md:text-[28px]">menu</span>
        </button>
        <h1 className="text-lg md:text-xl font-bold flex-1 min-w-0 truncate">Analytics Dashboard</h1>
        <div className="flex items-center gap-1 md:gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg shrink-0">
          <button className="px-2 md:px-3 py-1 md:py-1.5 bg-white dark:bg-slate-700 rounded-md text-[10px] md:text-xs font-bold shadow-sm whitespace-nowrap">7 Days</button>
          <button className="px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-bold text-slate-500 whitespace-nowrap">30 Days</button>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-6 md:space-y-8 w-full overflow-x-hidden">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 w-full">
          <StatCard title="Total Clients" value="1,284" trend="+5.2%" icon="groups" color="text-primary" />
          <StatCard title="Follow-ups" value="12" sub="DUE TODAY" icon="event_upcoming" color="text-amber-500" />
          <StatCard title="Pending" value="48" trend="On track" icon="pending_actions" color="text-emerald-600" isCheck />
          <StatCard title="Closed Deals" value="326" trend="-3% MoM" icon="handshake" color="text-indigo-500" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8 w-full overflow-x-hidden">
          <section className="bg-white dark:bg-slate-800 p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Client Distribution</h2>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <div className="h-48 md:h-64 w-full md:w-1/2 relative flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">1,284</span>
                  <span className="text-[8px] md:text-[10px] text-slate-400 font-black tracking-widest uppercase">Database</span>
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-2 md:space-y-4">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center justify-between p-2 md:p-3 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="size-3 md:size-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                    </div>
                    <span className="text-xs md:text-sm font-black">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-800 p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4 md:mb-6 gap-2">
              <h2 className="text-lg md:text-xl font-bold truncate">Follow-up Performance</h2>
              <button className="text-primary text-xs md:text-sm font-bold flex items-center gap-1 shrink-0">
                <span className="hidden md:inline">Details</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <Bar dataKey="value" fill="#197fe6" radius={[4, 4, 0, 0]} barSize={24} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} width={30} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center gap-2">
              <div className="min-w-0">
                <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">Weekly Average</p>
                <p className="text-lg md:text-xl font-black text-primary truncate">58.4 Reachouts</p>
              </div>
              <div className="flex -space-x-2 shrink-0">
                {[1, 2, 3].map(i => (
                  <div key={i} className="size-6 md:size-8 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100`} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
                <div className="size-6 md:size-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[8px] md:text-[10px] font-bold border-2 border-white dark:border-slate-800">+8</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, sub, icon, color, isCheck }: any) => (
  <div className="flex flex-col gap-2 md:gap-3 rounded-2xl md:rounded-3xl p-4 md:p-6 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 group hover:border-primary/20 transition-all overflow-hidden min-w-0">
    <div className="flex justify-between items-start gap-1 min-w-0">
      <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl bg-opacity-10 shrink-0 ${color.replace('text-', 'bg-')} ${color}`}>
        <span className="material-symbols-outlined text-xl md:text-2xl">{icon}</span>
      </div>
      {trend && (
        <div className={`flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg text-[8px] md:text-[10px] font-black shrink-0 ${isCheck ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/5 text-primary'}`}>
          <span className="material-symbols-outlined text-[12px] md:text-[14px]">{isCheck ? 'check_circle' : 'trending_up'}</span>
          <span className="hidden md:inline">{trend}</span>
        </div>
      )}
    </div>
    <div className="min-w-0">
      <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-0.5 md:mb-1 truncate">{title}</p>
      <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white truncate">{value}</p>
      {sub && <p className="text-slate-400 text-[8px] md:text-[10px] font-bold tracking-wider mt-0.5 md:mt-1 truncate">{sub}</p>}
    </div>
  </div>
);

export default OverviewView;
