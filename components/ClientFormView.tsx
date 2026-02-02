
import React, { useState, useRef } from 'react';
import { Client } from '../types';

interface ClientFormViewProps {
  onCancel: () => void;
  onSave: (client: Client) => void;
  initialData?: Client;
}

const ClientFormView: React.FC<ClientFormViewProps> = ({ onCancel, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Client>>(initialData || {
    status: 'New Lead',
    avatar: 'https://picsum.photos/seed/new/200'
  });
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to get under 90KB
        let quality = 0.7;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Simple loop to reduce quality if too big
        while (dataUrl.length > 120000 && quality > 0.1) { // 120000 chars is roughly 90KB in base64
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        setFormData(prev => ({ ...prev, avatar: dataUrl }));
        setIsCompressing(false);
      };
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: formData.id || Date.now().toString() } as Client);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-32 overflow-x-hidden w-full">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 w-full">
        <div className="flex items-center justify-between max-w-md mx-auto w-full">
          <button onClick={onCancel} className="text-primary text-base font-medium shrink-0">Cancel</button>
          <h1 className="text-lg font-bold truncate px-2">Client Entry Form</h1>
          <span className="material-symbols-outlined opacity-0 shrink-0">more_horiz</span>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-md mx-auto w-full overflow-x-hidden">
        {/* Photo */}
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div
              className="size-32 rounded-full border-4 border-white dark:border-slate-800 shadow-sm bg-cover bg-center overflow-hidden bg-slate-100 dark:bg-slate-800"
              style={{ backgroundImage: `url(${formData.avatar})` }}
            >
              {isCompressing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-sm">photo_camera</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-primary text-base font-semibold"
          >
            {isCompressing ? 'Compressing...' : 'Upload Profile Photo'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Image optimized automatically (&lt;90KB)</p>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-full overflow-hidden">
          <label className="block text-slate-900 dark:text-slate-100 text-sm font-bold uppercase mb-2">Primary Contact Number</label>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-slate-900 overflow-hidden h-16 transition-colors focus-within:border-primary/50 min-w-0">
            <input
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-bold tracking-widest p-4 outline-none dark:text-white min-w-0"
              placeholder="000-000-0000"
              required
            />
            <div className="flex items-center px-4 text-slate-400 shrink-0">
              <span className="material-symbols-outlined">call</span>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <section className="space-y-4 w-full">
          <h3 className="text-lg font-bold">Basic Information</h3>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 w-full">
            <Input label="Client Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Profession" name="profession" value={formData.profession} onChange={handleChange} placeholder="Architect" />
              <Input label="City" name="city" value={formData.city} onChange={handleChange} placeholder="New York" />
            </div>
            <Input label="Email Address" name="email" value={formData.email} onChange={handleChange} placeholder="client@example.com" type="email" />
          </div>
        </section>

        {/* Requirements */}
        <section className="space-y-4 w-full">
          <h3 className="text-lg font-bold">Property Requirements</h3>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 w-full">
            <Input label="Project Name" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="Skyline Towers" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-slate-500 mb-1">Property Type</span>
                <select
                  name="propertyType"
                  value={formData.propertyType || ''}
                  onChange={handleChange}
                  className="w-full h-14 bg-background-light dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm px-3 dark:text-white focus:ring-primary focus:border-primary"
                >
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Condo</option>
                  <option>Commercial</option>
                </select>
              </label>
              <Input label="Budget Range" name="budgetRange" value={formData.budgetRange} onChange={handleChange} placeholder="$500k - $800k" />
            </div>
          </div>
        </section>

        {/* Management */}
        <section className="space-y-4 w-full">
          <h3 className="text-lg font-bold">Management</h3>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-slate-500 mb-1">Lead Status</span>
                <select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleChange}
                  className="w-full h-14 bg-background-light dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm px-3 dark:text-white focus:ring-primary focus:border-primary"
                >
                  <option>New Lead</option>
                  <option>Hot</option>
                  <option>Warm Prospect</option>
                  <option>Follow-up</option>
                  <option>Viewing</option>
                  <option>Closed</option>
                </select>
              </label>
              <Input label="Follow-up Date" name="followUpDate" value={formData.followUpDate} onChange={handleChange} type="date" />
            </div>
            <label className="block">
              <span className="text-xs font-medium text-slate-500 mb-1">Notes</span>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                className="w-full min-h-[120px] bg-background-light dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm p-4 resize-none dark:text-white focus:ring-primary focus:border-primary"
                placeholder="Add detailed notes..."
              />
            </label>
          </div>
        </section>

        <footer className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 pb-8 z-40">
          <div className="max-w-md mx-auto">
            <button
              type="submit"
              disabled={isCompressing}
              className="w-full bg-primary disabled:bg-primary/50 text-white font-bold h-14 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined">save</span>
              Save Client Information
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
};

const Input = ({ label, ...props }: any) => (
  <label className="block w-full min-w-0">
    <span className="text-xs font-medium text-slate-500 mb-1">{label}</span>
    <input
      className="w-full h-14 bg-background-light dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg text-sm px-4 focus:ring-primary focus:border-primary dark:text-white outline-none min-w-0"
      {...props}
    />
  </label>
);

export default ClientFormView;
