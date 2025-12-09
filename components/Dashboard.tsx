import React from 'react';
import { Subject, ProgressState, ActivityLog } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, YAxis } from 'recharts';
import { TrendingUp, Award, Calendar, BarChart3 } from 'lucide-react';
import StreakGrid from './StreakGrid';

interface DashboardProps {
  subjects: Subject[];
  progress: ProgressState;
  activityLog: ActivityLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ subjects, progress, activityLog }) => {
  
  // Calculate Global Stats based on "Days" (Weighted)
  let totalSyllabusDays = 0;
  let completedSyllabusDays = 0;
  
  const subjectProgressData = subjects.map(subj => {
    let subjTotalDays = 0;
    let subjCompletedDays = 0;
    
    subj.topics.forEach(topic => {
      subjTotalDays += 1; // Each topic represents 1 Day in the syllabus
      totalSyllabusDays += 1;
      
      const totalSubs = topic.subtopics.length;
      if (totalSubs > 0) {
        let checkedSubs = 0;
        topic.subtopics.forEach((_, idx) => {
          if (progress[`${subj.id}-${topic.id}-${idx}`]) {
            checkedSubs++;
          }
        });
        
        // Add fractional day progress
        const fractionCompleted = checkedSubs / totalSubs;
        subjCompletedDays += fractionCompleted;
        completedSyllabusDays += fractionCompleted;
      }
    });

    return {
      name: subj.name,
      completed: subjCompletedDays,
      total: subjTotalDays,
      percentage: subjTotalDays > 0 ? Math.round((subjCompletedDays / subjTotalDays) * 100) : 0
    };
  });

  const totalPercentage = totalSyllabusDays > 0 ? Math.round((completedSyllabusDays / totalSyllabusDays) * 100) : 0;
  
  // Data for Pie Chart
  const pieData = [
    { name: 'Completed', value: completedSyllabusDays },
    { name: 'Remaining', value: totalSyllabusDays - completedSyllabusDays }
  ];
  const PIE_COLORS = ['#3b82f6', '#e2e8f0'];

  // --- Dynamic Stats Calculation ---

  // 1. Current Streak
  let currentStreak = 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const hasActivity = (dateStr: string) => {
    return activityLog.some(log => log.date === dateStr && log.count > 0.01);
  };

  let checkDate = new Date();
  if (!hasActivity(todayStr) && hasActivity(yesterdayStr)) {
     checkDate = yesterday;
  }
  
  for (let i = 0; i < 365; i++) {
    const dStr = checkDate.toISOString().split('T')[0];
    if (hasActivity(dStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // 2. Weekly Progress Logic
  // Prepare data for "Last 7 Days" Chart
  const last7DaysData = [];
  let daysCompletedLast7Days = 0;
  const today = new Date();
  
  for(let i=6; i>=0; i--) {
     const d = new Date();
     d.setDate(today.getDate() - i);
     const dStr = d.toISOString().split('T')[0];
     const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
     
     const logEntry = activityLog.find(l => l.date === dStr);
     const count = logEntry ? logEntry.count : 0;
     
     daysCompletedLast7Days += count;
     
     last7DaysData.push({
       day: dayName,
       amount: Number(count.toFixed(1))
     });
  }

  const WEEKLY_GOAL = 7; // Target: 7 Syllabus Days per week
  const weeklyPercentage = Math.min(100, Math.round((daysCompletedLast7Days / WEEKLY_GOAL) * 100));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric Card 1: Weekly Progress */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <TrendingUp size={80} className="text-primary-500" />
          </div>
          <div>
            <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide">Weekly Goal</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900">{weeklyPercentage}%</span>
              <span className="text-sm font-medium text-slate-500">
                ({daysCompletedLast7Days.toFixed(1)}/{WEEKLY_GOAL} Days)
              </span>
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${weeklyPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Syllabus days completed in last 7 days</p>
        </div>

        {/* Metric Card 2: Total Coverage */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide">Total Coverage</h3>
            <div className="mt-2">
              <span className="text-4xl font-bold text-slate-900">{totalPercentage}%</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{completedSyllabusDays.toFixed(1)} of {totalSyllabusDays} Days</p>
          </div>
          <div className="h-24 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={40}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metric Card 3: Current Streak */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
           <div>
            <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide">Current Streak</h3>
             <div className="mt-2 flex items-center gap-2">
              <span className="text-4xl font-bold text-slate-900">{currentStreak}</span>
              <span className="text-lg text-slate-400 font-medium">days</span>
              <Award className={`ml-auto ${currentStreak > 0 ? 'text-orange-400' : 'text-slate-200'}`} size={32} />
             </div>
           </div>
           <p className="text-xs text-slate-400 mt-2">
             {currentStreak > 0 ? "Keep it up! You are consistent." : "Complete a topic to build your streak!"}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* NEW: This Week's Activity Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
               <BarChart3 className="text-primary-500" size={20} />
               This Week's Activity
             </h3>
           </div>
           <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>

        {/* Subject Wise Progress Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Subject Breakdown</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectProgressData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Completion']}
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="percentage" barSize={20} radius={[0, 4, 4, 0]}>
                  {subjectProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#f43f5e'][index % 8]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-2 max-h-48 overflow-y-auto scrollbar-hide">
            {subjectProgressData.map((subj, idx) => (
              <div key={subj.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#f43f5e'][idx % 8] }}></div>
                   <span className="font-medium text-slate-700">{subj.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-100 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ 
                        width: `${subj.percentage}%`,
                        backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#f43f5e'][idx % 8]
                      }}
                    ></div>
                  </div>
                  <span className="text-slate-500 w-8 text-right">{subj.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Calendar (Moved down for better flow) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
           <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
               <Calendar className="text-primary-500" size={20} />
               Monthly Activity
             </h3>
             <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Last 30 Days</span>
           </div>
           <StreakGrid activityLog={activityLog} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;