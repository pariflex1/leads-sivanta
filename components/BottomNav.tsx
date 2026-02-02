
import React from 'react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const tabs = [
    { label: 'Dashboard', icon: 'dashboard', view: View.DASHBOARD },
    { label: 'Clients', icon: 'groups', view: View.CLIENTS },
    { label: 'Add', icon: 'add_circle', view: View.ADD_CLIENT },
    { label: 'Stats', icon: 'insights', view: View.OVERVIEW },
    { label: 'AI', icon: 'smart_toy', view: View.ASSISTANT },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 pb-6 pt-2 w-full overflow-x-hidden">
      <div className="max-w-md mx-auto flex justify-around items-center w-full px-2">
        {tabs.map((tab) => (
          <button
            key={tab.view}
            onClick={() => onNavigate(tab.view)}
            className={`flex flex-col items-center gap-0.5 transition-colors min-w-0 ${
              currentView === tab.view ? 'text-primary' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span className={`material-symbols-outlined ${currentView === tab.view ? 'fill-1' : ''}`}>{tab.icon}</span>
            <span className="text-[10px] font-bold truncate">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
