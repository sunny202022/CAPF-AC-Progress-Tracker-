import React from 'react';
import { Subject } from '../types';
import { LayoutDashboard, BookOpen, Scroll, Globe, Scale, Atom, TrendingUp, Leaf, Calculator } from 'lucide-react';

interface SidebarProps {
  subjects: Subject[];
  activeView: string;
  onSelectView: (viewId: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ subjects, activeView, onSelectView, isMobileOpen, setIsMobileOpen }) => {
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scale': return <Scale size={20} />;
      case 'Scroll': return <Scroll size={20} />;
      case 'Globe': return <Globe size={20} />;
      case 'Atom': return <Atom size={20} />;
      case 'TrendingUp': return <TrendingUp size={20} />;
      case 'Leaf': return <Leaf size={20} />;
      case 'Calculator': return <Calculator size={20} />;
      default: return <BookOpen size={20} />;
    }
  };

  const navClasses = (isActive: boolean) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer font-medium ${
      isActive 
        ? 'bg-primary-50 text-primary-700 shadow-sm border border-primary-100' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">CAPF AC</h1>
              <p className="text-xs text-slate-500 font-medium">Prep Tracker</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
          <div className="mb-6">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Overview</p>
            <div 
              onClick={() => { onSelectView('home'); setIsMobileOpen(false); }}
              className={navClasses(activeView === 'home')}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>
          </div>

          <div>
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Subjects</p>
            <div className="space-y-1">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  onClick={() => { onSelectView(subject.id); setIsMobileOpen(false); }}
                  className={navClasses(activeView === subject.id)}
                >
                  {getIcon(subject.icon)}
                  <span>{subject.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User / Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
              JD
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">John Doe</p>
              <p className="text-xs text-slate-500">Aspirant</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;