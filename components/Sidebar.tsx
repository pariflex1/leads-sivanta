
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, onNavigate, onLogout }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Container */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 shadow-2xl lg:shadow-none lg:border-r lg:border-slate-100 lg:dark:border-slate-800 transform transition-transform duration-300 ease-in-out overflow-x-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="p-6 pt-12 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            <div className="h-14 w-14 rounded-full overflow-hidden ring-2 ring-primary/10">
              <img src="https://picsum.photos/seed/user/200" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Jane Cooper</h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Senior Real Estate Agent</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-6 overflow-y-auto">
            <ul className="space-y-1">
              {[
                { label: 'New Entry', icon: 'add_circle', view: View.ADD_CLIENT },
                { label: 'Overview', icon: 'dashboard', view: View.DASHBOARD },
                { label: 'AI Assistant', icon: 'magic_button', view: View.ASSISTANT },
                { label: 'Clients', icon: 'group', view: View.CLIENTS },
                { label: 'Analytics', icon: 'insights', view: View.OVERVIEW },
                { label: 'Settings', icon: 'settings', view: View.SETTINGS },
              ].map((item) => (
                <li key={item.view}>
                  <button
                    onClick={() => { onNavigate(item.view); onClose(); }}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-semibold transition-colors ${
                      currentView === item.view 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={onLogout}
              className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Logout
            </button>
            <div className="h-6" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
