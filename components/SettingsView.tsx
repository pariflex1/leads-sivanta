
import React, { useState } from 'react';

interface SettingsViewProps {
  onOpenMenu: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onOpenMenu }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden w-full">
      <header className="p-4 px-6 flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800 w-full">
        <button onClick={onOpenMenu} className="lg:hidden text-slate-900 dark:text-white p-1 mr-4 shrink-0">
          <span className="material-symbols-outlined text-[28px]">menu</span>
        </button>
        <h2 className="text-xl font-bold truncate">User Settings</h2>
      </header>

      <div className="p-6 space-y-8 max-w-4xl w-full overflow-x-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Profile Card */}
          <div className="md:col-span-1 w-full">
             <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center text-center w-full">
              <div className="relative mb-4">
                <div className="size-24 rounded-3xl border-4 border-primary/20 overflow-hidden shadow-lg rotate-3 group hover:rotate-0 transition-transform cursor-pointer">
                  <img src="https://picsum.photos/seed/agent/200" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 size-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </div>
              </div>
              <p className="text-xl font-black truncate w-full">Jane Cooper</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Senior Agent</p>
              <div className="mt-6 w-full space-y-2">
                 <button className="w-full py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 truncate">View Public Profile</button>
              </div>
            </div>
          </div>

          {/* Preferences and System */}
          <div className="md:col-span-2 space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 px-1">Application Preferences</h3>
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <ToggleItem 
                  icon="dark_mode" 
                  label="Interface Dark Mode" 
                  checked={isDarkMode} 
                  onToggle={toggleDarkMode} 
                />
                <NavItem icon="notifications" label="Push Notifications" />
                <NavItem icon="language" label="App Language" sub="English (US)" />
                <NavItem icon="lock" label="Privacy & Data Security" isLast />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 px-1">System & Support</h3>
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined">info</span>
                    </div>
                    <span className="font-bold">Software Version</span>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black">PRO v2.4.0</span>
                </div>
                <NavItem icon="help" label="Help Center & Documentation" />
                <NavItem icon="bug_report" label="Report a Technical Issue" isLast />
              </div>
            </div>

            <div className="pt-4">
              <button className="w-full py-5 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 font-black flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                <span className="material-symbols-outlined">logout_variant</span>
                Terminate Session (Logout)
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest py-8">© 2024 RealEstate CRM Pro • Cloud Verified</p>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, sub, isLast }: any) => (
  <div className={`flex items-center justify-between px-6 h-16 ${!isLast ? 'border-b border-gray-100 dark:border-gray-700' : ''} cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors`}>
    <div className="flex items-center gap-4">
      <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-sm">{label}</span>
        {sub && <span className="text-[10px] text-slate-400 font-bold uppercase">{sub}</span>}
      </div>
    </div>
    <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
  </div>
);

const ToggleItem = ({ icon, label, checked, onToggle }: any) => (
  <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 dark:border-gray-700">
    <div className="flex items-center gap-4">
      <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="font-bold text-sm">{label}</span>
    </div>
    <label className={`relative h-7 w-12 rounded-full cursor-pointer transition-colors ${checked ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
      <input type="checkbox" className="hidden" checked={checked} onChange={onToggle} />
      <div className={`absolute top-1 left-1 size-5 bg-white rounded-full shadow-md transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </label>
  </div>
);

export default SettingsView;
