import React from 'react';
import { Subject, ProgressState, ActivityLog } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { TrendingUp, Award, Calendar } from 'lucide-react';
import StreakGrid from './StreakGrid';

interface DashboardProps {
  subjects: Subject[];
  progress: ProgressState;
  activityLog: ActivityLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ subjects, progress, activityLog }) => {
  
  // Calculate Global Stats
  let totalSubtopics = 0;
  let completedSubtopics = 0;
  
  const subjectProgressData = subjects.map(subj => {
    let subjTotal = 0;
    let subjCompleted = 0;
    
    subj.topics.forEach(topic => {
      topic.subtopics.forEach((_, idx) => {
        subjTotal++;
        totalSubtopics++;
        if (progress[`${subj.id}-${topic.id}-${idx}`]) {
          subjCompleted++;
          completedSubtopics++;
        }
      });
    });

    return {
      name: subj.name,
      completed: subjCompleted,
      total: subjTotal,
      percentage: subjTotal > 0 ? Math.round((subjCompleted / subjTotal) * 100) : 0
    };
  });

  const totalPercentage = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;
  
  // Data for Pie Chart
  const pieData = [
    { name: 'Completed', value: completedSubtopics },
    { name: 'Remaining', value: totalSubtopics - completedSubtopics }
  ];
  const PIE_COLORS = ['#3b82f6', '#e2e8f0'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric Card 1: Weekly Progress (Simulated) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <TrendingUp size={80} className="text-primary-500" />
          </div>
          <div>
            <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide">Weekly Goal</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900">68%</span>
              <span className="text-sm font-medium text-emerald-500 flex items-center">
                <TrendingUp size={14} className="mr-1" /> +12%
              </span>
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full transition-all duration-1000" style={{ width: '68%' }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Based on tasks scheduled for this week</p>
        </div>

        {/* Metric Card 2: Total Coverage */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide">Total Coverage</h3>
            <div className="mt-2">
              <span className="text-4xl font-bold text-slate-900">{totalPercentage}%</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{completedSubtopics} of {totalSubtopics} topics</p>
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
              <span className="text-4xl font-bold text-slate-900">5</span>
              <span className="text-lg text-slate-400 font-medium">days</span>
              <Award className="text-orange-400 ml-auto" size={32} />
             </div>
           </div>
           <p className="text-xs text-slate-400 mt-2">Keep it up! You are consistent.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Streak Calendar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
               <Calendar className="text-primary-500" size={20} />
               Monthly Activity
             </h3>
             <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Last 30 Days</span>
           </div>
           <StreakGrid activityLog={activityLog} />
           <div className="mt-4 flex items-center justify-end gap-4 text-xs text-slate-500">
             <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-rose-100 border border-rose-200"></div> Missed</div>
             <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-500"></div> Study Day</div>
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
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="percentage" barSize={20} radius={[0, 4, 4, 0]}>
                  {subjectProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : index === 1 ? '#8b5cf6' : '#10b981'} />
                  ))}
                </Bar>
                {/* Custom Y-Axis labels rendered manually for better control or just map over data below chart */}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-2">
            {subjectProgressData.map((subj, idx) => (
              <div key={subj.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-violet-500' : 'bg-emerald-500'}`}></div>
                   <span className="font-medium text-slate-700">{subj.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-100 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-violet-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${subj.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-slate-500 w-8 text-right">{subj.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;