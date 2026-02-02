
import React from 'react';
import { Client, LeadStatus } from '../types';

interface ClientDetailsModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ client, isOpen, onClose, onUpdateStatus }) => {
  if (!client) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 overflow-hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-x-0 bottom-0 z-[80] flex flex-col max-h-[92%] bg-white dark:bg-slate-900 rounded-t-2xl md:rounded-t-3xl shadow-2xl overflow-hidden transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex flex-col items-center pt-3 pb-1 shrink-0">
          <div className="h-1.5 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-28 md:pb-32">
          <div className="flex flex-col px-4 pt-3 md:pt-4 w-full">
            <div className="flex justify-between items-start gap-3 min-w-0">
              <h1 className="text-slate-900 dark:text-white tracking-tight text-xl md:text-[28px] font-bold leading-tight flex-1 min-w-0 truncate">{client.name}</h1>
              <span className="bg-primary/10 text-primary px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider shrink-0">Active</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base truncate">{client.profession}</p>
          </div>

          <div className="px-4 py-3 md:py-4">
            <label className="flex flex-col w-full">
              <p className="text-slate-900 dark:text-slate-200 text-xs md:text-sm font-semibold pb-2 uppercase tracking-wide">Lead Status</p>
              <select
                value={client.status}
                onChange={(e) => onUpdateStatus(client.id, e.target.value as LeadStatus)}
                className="w-full rounded-lg md:rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-12 md:h-14 px-3 md:px-4 text-sm md:text-base font-medium focus:ring-primary"
              >
                <option value="Warm Prospect">Warm Prospect</option>
                <option value="Hot">Hot Lead</option>
                <option value="Closed">Closed Deal</option>
                <option value="New Lead">New Lead</option>
                <option value="Viewing">Viewing</option>
              </select>
            </label>
          </div>

          <div className="space-y-3 md:space-y-4 px-4 w-full overflow-x-hidden">
            <div className="flex items-center justify-between p-2 min-w-0">
              <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                <div className="text-primary flex items-center justify-center rounded-lg md:rounded-xl bg-primary/10 size-10 md:size-12 shrink-0">
                  <span className="material-symbols-outlined text-xl md:text-2xl">call</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Phone Number</p>
                  <p className="text-primary text-base md:text-lg font-semibold truncate">{client.phone}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 shrink-0">chevron_right</span>
            </div>

            <div className="flex items-center gap-3 md:gap-4 p-2 min-w-0">
              <div className="text-primary flex items-center justify-center rounded-lg md:rounded-xl bg-primary/10 size-10 md:size-12 shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">location_on</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider">Location</p>
                <p className="text-slate-900 dark:text-white text-sm md:text-base font-medium truncate">{client.location || client.city}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-slate-100 dark:border-slate-800 w-full overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-sm shrink-0">event_note</span>
                <p className="text-slate-900 dark:text-white text-xs md:text-sm font-bold uppercase tracking-wide">Recent Notes</p>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed break-words">
                {client.notes || 'No detailed notes provided for this client yet. Start tracking their preferences here.'}
              </p>
            </div>

            {client.followUpDate && (
              <div className="flex items-center justify-between bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg md:rounded-xl p-3 md:p-4 min-w-0">
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                  <span className="material-symbols-outlined text-primary shrink-0">calendar_today</span>
                  <div className="min-w-0">
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-medium uppercase">Next Follow-up</p>
                    <p className="text-slate-900 dark:text-white text-sm md:text-base font-bold truncate">{client.followUpDate} • {client.followUpTime}</p>
                  </div>
                </div>
                <button className="text-primary text-xs md:text-sm font-bold shrink-0">Edit</button>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 ios-blur border-t border-slate-100 dark:border-slate-800 px-4 md:px-6 pb-8 md:pb-10 pt-3 md:pt-4">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <ActionBtn icon="call" label="Call" color="bg-primary" />
            <ActionBtn icon="chat" label="WhatsApp" color="bg-[#25D366]" />
            <ActionBtn icon="sms" label="SMS" color="bg-primary" />
            <ActionBtn icon="mail" label="Email" color="bg-primary" />
          </div>
        </div>
      </div>
    </>
  );
};

const ActionBtn = ({ icon, label, color }: { icon: string; label: string; color: string }) => (
  <button className="flex flex-col items-center gap-1 group">
    <div className={`size-10 md:size-12 rounded-full ${color} flex items-center justify-center text-white shadow-lg group-active:scale-95 transition-transform`}>
      <span className="material-symbols-outlined text-[20px] md:text-[24px]">{icon}</span>
    </div>
    <span className="text-[9px] md:text-[10px] font-bold text-slate-500 dark:text-slate-400">{label}</span>
  </button>
);

export default ClientDetailsModal;
