import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SubjectDetail from './components/SubjectDetail';
import Settings from './components/Settings';
import PreviousPapers from './components/PreviousPapers';
import PracticeTest from './components/PracticeTest';
import CodingArena from './components/CodingArena';
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
      // Using v3 keys for new Day-based logic
      const savedProgress = localStorage.getItem('capf_progress_v3');
      const savedLog = localStorage.getItem('capf_activity_log_v3');

      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }

      if (savedLog) {
        setActivityLog(JSON.parse(savedLog));
      } else {
        setActivityLog([]);
      }
    } catch (e) {
      console.error("Failed to load from local storage", e);
    }
  }, []);

  // Save Progress to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('capf_progress_v3', JSON.stringify(progress));
  }, [progress]);

  // Save ActivityLog to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('capf_activity_log_v3', JSON.stringify(activityLog));
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
    
    // Calculate Weight: 1 Day / Total Subtopics in that Day
    const subject = SYLLABUS_DATA.find(s => s.id === activeView);
    const topic = subject?.topics.find(t => t.id === topicId);
    const totalSubtopics = topic?.subtopics.length || 1;
    const weight = 1 / totalSubtopics;

    setActivityLog(prevLog => {
      const existingIdx = prevLog.findIndex(log => log.date === todayStr);
      let newLog = [...prevLog];
      
      if (existingIdx >= 0) {
        // Update existing entry for today
        const currentCount = newLog[existingIdx].count || 0;
        // Increment by weight if checking, decrement if unchecking
        const newCount = isNowChecked 
          ? currentCount + weight 
          : Math.max(0, currentCount - weight);
        
        newLog[existingIdx] = { ...newLog[existingIdx], count: newCount };
      } else {
        // Create new entry for today
        if (isNowChecked) {
          newLog.unshift({ date: todayStr, count: weight });
        }
      }
      return newLog;
    });
  };

  const activeSubject = SYLLABUS_DATA.find(s => s.id === activeView);

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex font-sans">
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
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between z-30 flex-shrink-0">
          <div className="font-bold text-slate-800">Exam Prep</div>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
          <div className="max-w-6xl mx-auto">
            
            {activeView === 'home' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header className="mb-8">
                  <h1 className="text-3xl font-bold text-slate-900">Welcome back!</h1>
                  <p className="text-slate-500 mt-2">Here is your preparation overview for the upcoming exam.</p>
                </header>
                <Dashboard 
                  subjects={SYLLABUS_DATA} 
                  progress={progress}
                  activityLog={activityLog}
                />
              </div>
            )}

            {activeView === 'practice' && (
              <PracticeTest />
            )}

            {activeView === 'coding' && (
              <CodingArena />
            )}

            {activeView === 'papers' && (
              <PreviousPapers />
            )}

            {activeView === 'settings' && (
              <Settings />
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