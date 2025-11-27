import React, { useMemo } from 'react';
import { ActivityLog } from '../types';

interface StreakGridProps {
  activityLog: ActivityLog[];
}

const StreakGrid: React.FC<StreakGridProps> = ({ activityLog }) => {
  // Generate last 30 days
  const days = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      // Check activity
      const hasActivity = activityLog.some(log => log.date === dateStr && log.count > 0);
      
      result.push({
        date: dateStr,
        active: hasActivity,
        dayOfMonth: d.getDate()
      });
    }
    return result;
  }, [activityLog]);

  return (
    <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
      {days.map((day, idx) => (
        <div key={day.date} className="flex flex-col items-center gap-1 group">
           <div 
             className={`
               w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-all duration-300
               ${day.active 
                 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-100' 
                 : 'bg-rose-100 text-rose-400 border border-rose-200'}
             `}
             title={day.date}
           >
             {day.active && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
           </div>
           <span className="text-[10px] text-slate-400 hidden group-hover:block absolute -bottom-4 bg-slate-800 text-white px-1 rounded z-10">
             {day.date.slice(5)}
           </span>
        </div>
      ))}
    </div>
  );
};

export default StreakGrid;