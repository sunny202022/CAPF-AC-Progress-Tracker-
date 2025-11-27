import React from 'react';
import { Subject, ProgressState } from '../types';
import { CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';

interface SubjectDetailProps {
  subject: Subject;
  progress: ProgressState;
  onToggle: (topicId: string, subtopicIdx: number) => void;
}

const SubjectDetail: React.FC<SubjectDetailProps> = ({ subject, progress, onToggle }) => {
  const [expandedTopic, setExpandedTopic] = React.useState<string | null>(subject.topics[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedTopic(expandedTopic === id ? null : id);
  };

  // Helper to get today's date formatted
  const getTodayDate = () => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{subject.name} Syllabus</h2>
          <p className="text-slate-500 mt-1">Track your daily topics and subtopics coverage.</p>
        </div>
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm font-semibold">
          {getTodayDate()}
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {subject.topics.map((topic) => {
          
          // Calculate progress for this specific topic card
          const totalSubs = topic.subtopics.length;
          const completedSubs = topic.subtopics.filter((_, idx) => progress[`${subject.id}-${topic.id}-${idx}`]).length;
          const percent = totalSubs === 0 ? 0 : Math.round((completedSubs / totalSubs) * 100);
          const isComplete = percent === 100 && totalSubs > 0;
          const isExpanded = expandedTopic === topic.id;

          return (
            <div 
              key={topic.id} 
              className={`bg-white rounded-xl border transition-all duration-300 ${isComplete ? 'border-emerald-200' : 'border-slate-200'} shadow-sm overflow-hidden`}
            >
              {/* Accordion Header */}
              <div 
                onClick={() => toggleExpand(topic.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2
                    ${isComplete 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                      : 'bg-white border-slate-200 text-slate-500'}
                  `}>
                    {percent}%
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${isComplete ? 'text-emerald-900' : 'text-slate-900'}`}>
                      {topic.title}
                    </h3>
                    <p className="text-sm text-slate-500">{completedSubs}/{totalSubs} subtopics completed</p>
                  </div>
                </div>
                <div className="text-slate-400">
                  {isExpanded ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>

              {/* Accordion Content (Subtopics) */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-0 bg-slate-50/50 border-t border-slate-100">
                  <div className="grid grid-cols-1 gap-3 mt-4">
                    {topic.subtopics.length === 0 ? (
                      <p className="text-sm text-slate-400 italic">No specific subtopics defined for this day.</p>
                    ) : (
                      topic.subtopics.map((sub, idx) => {
                        const isChecked = progress[`${subject.id}-${topic.id}-${idx}`] || false;
                        return (
                          <div 
                            key={idx}
                            onClick={() => onToggle(topic.id, idx)}
                            className={`
                              flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 group
                              ${isChecked 
                                ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                                : 'bg-white border-slate-200 hover:border-primary-300'}
                            `}
                          >
                            <div className={`mr-4 transition-colors ${isChecked ? 'text-emerald-500' : 'text-slate-300 group-hover:text-primary-400'}`}>
                              {isChecked ? <CheckCircle className="fill-current" /> : <Circle />}
                            </div>
                            <span className={`text-sm font-medium ${isChecked ? 'text-emerald-900 line-through opacity-70' : 'text-slate-700'}`}>
                              {sub}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectDetail;