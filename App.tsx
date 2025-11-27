import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SubjectDetail from './components/SubjectDetail';
import { SYLLABUS_DATA } from './constants';
import { ProgressState, ActivityLog } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('home');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // State for tracking checked items
  const [progress, setProgress] = useState<ProgressState>({});
  
  // State for activity log
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('capf_progress');
      const savedLog = localStorage.getItem('capf_activity_log');

      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }

      if (savedLog) {
        setActivityLog(JSON.parse(savedLog));
      } else {
        // Initialize mock data only if no log exists
        const mockLog: ActivityLog[] = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
          const d = new Date();
          d.setDate(today.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          // Randomly decide if work was done (30% chance for past random data)
          const count = Math.random() > 0.7 ? 1 : 0; 
          mockLog.push({ date: dateStr, count });
        }
        setActivityLog(mockLog);
      }
    } catch (e) {
      console.error("Failed to load from local storage", e);
    }
  }, []);

  // Save Progress to LocalStorage whenever it changes
  useEffect(() => {
    if (Object.keys(progress).length > 0) {
      localStorage.setItem('capf_progress', JSON.stringify(progress));
    }
  }, [progress]);

  // Save ActivityLog to LocalStorage whenever it changes
  useEffect(() => {
    if (activityLog.length > 0) {
      localStorage.setItem('capf_activity_log', JSON.stringify(activityLog));
    }
  }, [activityLog]);

  // Handle toggling a subtopic
  const handleToggleProgress = (topicId: string, subtopicIdx: number) => {
    const key = `${activeView}-${topicId}-${subtopicIdx}`;
    const isNowChecked = !progress[key];

    // Update Progress State
    setProgress(prev => ({
      ...prev,
      [key]: isNowChecked
    }));

    // Update Activity Log for Today
    const todayStr = new Date().toISOString().split('T')[0];
    
    setActivityLog(prevLog => {
      const existingIdx = prevLog.findIndex(log => log.date === todayStr);
      let newLog = [...prevLog];
      
      // If we are checking an item, ensure today is marked active.
      // Even if unchecking, if we did *something* today, we count it. 
      // For a simple "Streak", any interaction today counts as 1.
      if (isNowChecked) {
        if (existingIdx >= 0) {
          newLog[existingIdx] = { ...newLog[existingIdx], count: 1 };
        } else {
          newLog.unshift({ date: todayStr, count: 1 });
        }
      }
      // Note: We don't remove activity on uncheck to preserve "effort made today"
      return newLog;
    });
  };

  const activeSubject = SYLLABUS_DATA.find(s => s.id === activeView);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <Sidebar 
        subjects={SYLLABUS_DATA}
        activeView={activeView}
        onSelectView={setActiveView}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between z-30">
          <div className="font-bold text-slate-800">CAPF AC Tracker</div>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            
            {activeView === 'home' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header className="mb-8">
                  <h1 className="text-3xl font-bold text-slate-900">Welcome back, Aspirant!</h1>
                  <p className="text-slate-500 mt-2">Here is your preparation overview for the upcoming exam.</p>
                </header>
                <Dashboard 
                  subjects={SYLLABUS_DATA} 
                  progress={progress}
                  activityLog={activityLog}
                />
              </div>
            )}

            {activeSubject && (
              <div className="animate-in zoom-in-95 duration-300">
                 <SubjectDetail 
                   subject={activeSubject} 
                   progress={progress}
                   onToggle={handleToggleProgress}
                 />
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default App;