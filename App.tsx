
import React, { useState, useEffect } from 'react';
import { Client, View, LeadStatus } from './types';
import { INITIAL_CLIENTS } from './constants';
import { googleSheetService } from './services/googleSheetService';
import DashboardView from './components/DashboardView';
import OverviewView from './components/OverviewView';
import AssistantView from './components/AssistantView';
import SettingsView from './components/SettingsView';
import ClientFormView from './components/ClientFormView';
import ClientDetailsModal from './components/ClientDetailsModal';
import Sidebar from './components/Sidebar';
import './test-sheets-connection';

declare global {
  interface Window {
    testGoogleSheets?: () => Promise<void>;
  }
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const fetched = await googleSheetService.fetchClients();
        if (fetched && fetched.length > 0) {
          setClients(fetched);
          console.log('✅ Loaded', fetched.length, 'clients from Google Sheets');
        } else {
          console.warn('⚠️ No data from Google Sheets, using sample data');
          setFetchError('Could not fetch from Google Sheets. Check console for details.');
        }
      } catch (error) {
        console.error('❌ Error loading data:', error);
        setFetchError('Error connecting to Google Sheets. Check console.');
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  const handleSaveClient = async (client: Client) => {
    setIsLoading(true);
    const success = await googleSheetService.saveClient(client);
    if (success) {
      setClients(prev => {
        const index = prev.findIndex(c => c.id === client.id);
        if (index > -1) {
          const updated = [...prev];
          updated[index] = client;
          return updated;
        }
        return [client, ...prev];
      });
    }
    setCurrentView(View.DASHBOARD);
    setIsLoading(false);
  };

  const handleUpdateStatus = (id: string, status: LeadStatus) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    if (selectedClient?.id === id) {
      setSelectedClient({ ...selectedClient, status });
    }
  };

  const renderView = () => {
    const openMenu = () => setIsSidebarOpen(true);

    switch (currentView) {
      case View.DASHBOARD:
      case View.CLIENTS:
        return (
          <DashboardView
            clients={clients}
            onClientClick={handleClientClick}
            onOpenMenu={openMenu}
          />
        );
      case View.OVERVIEW:
        return <OverviewView onOpenMenu={openMenu} />;
      case View.ASSISTANT:
        return <AssistantView onOpenMenu={openMenu} clients={clients} />;
      case View.SETTINGS:
        return <SettingsView onOpenMenu={openMenu} />;
      case View.ADD_CLIENT:
        return <ClientFormView onCancel={() => setCurrentView(View.DASHBOARD)} onSave={handleSaveClient} />;
      default:
        return <DashboardView clients={clients} onClientClick={handleClientClick} onOpenMenu={openMenu} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden w-full">
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/50 backdrop-blur-sm overflow-hidden">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      )}

      {fetchError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[90] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            <span className="text-sm font-medium">{fetchError}</span>
          </div>
          <div className="mt-2 flex gap-2">
            <button 
              onClick={handleRefresh}
              className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => window.testGoogleSheets && window.testGoogleSheets()}
              className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
            >
              Test Connection
            </button>
          </div>
          <p className="text-xs mt-2 text-red-600">
            Open browser console (F12) for detailed error messages
          </p>
        </div>
      )}

      {/* Sidebar - Desktop persistent, Mobile drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={() => console.log('Logout')}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 transition-all duration-300 overflow-x-hidden min-w-0">
        <div className="max-w-7xl mx-auto h-full w-full">
          {renderView()}
        </div>
      </main>

      <ClientDetailsModal
        isOpen={isDetailsOpen}
        client={selectedClient}
        onClose={() => setIsDetailsOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default App;
