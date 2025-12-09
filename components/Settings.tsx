import React, { useRef, useState, useEffect } from 'react';
import { Download, Upload, Trash2, AlertTriangle, Check, Bell, BellRing } from 'lucide-react';

const Settings: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  const handleExport = () => {
    const data = {
      progress: localStorage.getItem('capf_progress_v3'),
      activityLog: localStorage.getItem('capf_activity_log_v3'),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capf-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Support v3 keys
        if (data.progress) localStorage.setItem('capf_progress_v3', data.progress);
        if (data.activityLog) localStorage.setItem('capf_activity_log_v3', data.activityLog);
        
        setImportStatus('success');
        setTimeout(() => window.location.reload(), 1500); // Reload to reflect changes
      } catch (err) {
        console.error(err);
        setImportStatus('error');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure? This will delete all your progress permanently.')) {
      localStorage.removeItem('capf_progress_v3');
      localStorage.removeItem('capf_activity_log_v3');
      window.location.reload();
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support desktop notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationStatus(permission);

    if (permission === 'granted') {
      new Notification("Notifications Enabled", {
        body: "You will now receive alerts for timers and reminders.",
        icon: "/vite.svg" // Fallback icon
      });
    }
  };

  const sendTestNotification = () => {
    if (notificationStatus === 'granted') {
      new Notification("Test Notification", {
        body: "Your study notifications are working perfectly! 🚀",
      });
    } else {
      alert("Please enable notifications first.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Settings & Data</h1>
        <p className="text-slate-500 mt-2">Manage your application data and preferences.</p>
      </header>

      {/* Notifications Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Bell className="text-primary-500" size={20} />
            Notifications
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Get alerts when your practice test timer ends.
          </p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-semibold text-slate-900">Desktop Alerts</h3>
              <p className="text-sm text-slate-500">
                Status: <span className={`font-medium ${notificationStatus === 'granted' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {notificationStatus === 'granted' ? 'Enabled' : notificationStatus === 'denied' ? 'Blocked' : 'Not Enabled'}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
               {notificationStatus !== 'granted' ? (
                <button 
                  onClick={requestNotificationPermission}
                  className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Enable
                </button>
               ) : (
                <button 
                  onClick={sendTestNotification}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2"
                >
                  <BellRing size={16} /> Test
                </button>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Data Backup Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Download className="text-primary-500" size={20} />
            Backup & Restore
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Since this app runs without a database, your data is stored on this device. 
            Export your data to move it to another device or keep a backup.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Section */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-semibold text-slate-900">Export Data</h3>
              <p className="text-sm text-slate-500">Download your progress as a JSON file.</p>
            </div>
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-slate-300 shadow-sm text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:text-primary-600 transition-colors flex items-center gap-2"
            >
              <Download size={18} />
              Export
            </button>
          </div>

          {/* Import Section */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <h3 className="font-semibold text-slate-900">Import Data</h3>
              <p className="text-sm text-slate-500">Restore your progress from a backup file.</p>
              {importStatus === 'success' && <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1"><Check size={12}/> Success! Reloading...</span>}
              {importStatus === 'error' && <span className="text-xs text-rose-600 font-bold flex items-center gap-1 mt-1"><AlertTriangle size={12}/> Invalid File</span>}
            </div>
            <div className="relative">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json"
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-sm shadow-primary-500/20"
              >
                <Upload size={18} />
                Import
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 text-rose-600">
            <Trash2 size={20} />
            Danger Zone
          </h2>
        </div>
        <div className="p-6 bg-rose-50/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Reset All Progress</h3>
              <p className="text-sm text-slate-500">Permanently delete all tracking data from this device.</p>
            </div>
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-white border border-rose-200 text-rose-600 font-medium rounded-lg hover:bg-rose-50 transition-colors"
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;