
import React, { useState } from 'react';
import { Client } from '../types';
import { FOLLOW_UPS } from '../constants';

interface DashboardViewProps {
  clients: Client[];
  onClientClick: (client: Client) => void;
  onOpenMenu: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ clients, onClientClick, onOpenMenu }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-background-light dark:bg-background-dark overflow-x-hidden w-full">
      {/* Floating Android-style Search Bar */}
      <div className="sticky top-0 z-20 px-3 md:px-4 pt-3 md:pt-4 pb-2 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md w-full">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center h-12 md:h-14 w-full bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-100 dark:border-slate-700 px-3 md:px-4">
            <button
              onClick={onOpenMenu}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[22px] md:text-[24px]">menu</span>
            </button>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-base placeholder:text-slate-500 px-2 md:px-3 py-2 outline-none dark:text-white min-w-0"
              placeholder="Search contacts"
            />
            <div className="flex items-center gap-1 shrink-0">
              <button className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                <span className="material-symbols-outlined text-[22px] md:text-[24px]">mic</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-4 lg:p-6 space-y-6 md:space-y-8 w-full overflow-x-hidden">
        {/* Today's Follow-up - Horizontal Scroll */}
        <section className="w-full overflow-x-hidden">
          <div className="flex items-center justify-between pb-3 md:pb-4 px-1">
            <h2 className="text-lg md:text-xl font-bold">Today's Follow-Up</h2>
            <span className="text-primary text-xs md:text-sm font-semibold cursor-pointer">View Calendar</span>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-3 md:gap-4 pb-2 -mx-3 px-3 md:mx-0 md:px-0 w-full">
            {FOLLOW_UPS.map(item => (
              <div
                key={item.id}
                onClick={() => onClientClick(item)}
                className="flex-shrink-0 w-64 md:w-72 bg-white dark:bg-slate-800 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="flex gap-3 md:gap-4">
                  <div className="size-12 md:size-16 bg-slate-100 dark:bg-slate-700 rounded-lg md:rounded-xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base font-bold truncate text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">{item.followUpTime} • {item.followUpType}</p>
                    <div className={`mt-1.5 md:mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${item.status === 'Warm Prospect' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-primary/10 text-primary'
                      }`}>
                      {item.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {FOLLOW_UPS.length === 0 && (
              <div className="w-full py-6 md:py-8 flex flex-col items-center justify-center text-slate-400 bg-white/50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <span className="material-symbols-outlined text-3xl md:text-4xl mb-2">event_available</span>
                <p className="text-xs md:text-sm">No follow-ups for today</p>
              </div>
            )}
          </div>
        </section>

        {/* Client Listing */}
        <section className="max-w-5xl mx-auto w-full overflow-x-hidden">
          <div className="flex items-center justify-between mb-3 md:mb-4 px-1">
            <h2 className="text-lg md:text-xl font-bold">All Contacts</h2>
            <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-slate-500">
              <span className="material-symbols-outlined text-base md:text-lg">filter_list</span>
              <span className="font-medium">Filter</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
            {filteredClients.map(client => (
              <div
                key={client.id}
                onClick={() => onClientClick(client)}
                className="flex items-center gap-3 md:gap-4 bg-white dark:bg-slate-800 p-3 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-primary/30 transition-all active:scale-[0.98]"
              >
                <div className="size-11 md:size-14 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0 ring-2 ring-slate-50 dark:ring-slate-800">
                  <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-0.5 md:mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate text-base md:text-lg">{client.name}</h3>
                    <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wide px-1.5 md:px-2 py-0.5 rounded-md shrink-0 ${client.status === 'Hot' ? 'bg-primary text-white' :
                        client.status === 'Viewing' ? 'bg-amber-500 text-white' :
                          client.status === 'Closed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                      {client.status}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 truncate">{client.phone}</p>
                  <div className="flex items-center gap-2 md:gap-3 mt-1.5 md:mt-2">
                    <div className="flex items-center gap-1 text-slate-400 min-w-0">
                      <span className="material-symbols-outlined text-[14px] md:text-[16px] shrink-0">location_on</span>
                      <span className="text-[10px] md:text-xs truncate">{client.city}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredClients.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
              <p className="text-sm">No contacts found</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardView;
