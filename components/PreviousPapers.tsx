import React from 'react';
import { PREVIOUS_PAPERS } from '../constants';
import { FileDown, AlertCircle } from 'lucide-react';

const PreviousPapers: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Previous Year Papers</h1>
        <p className="text-slate-500 mt-2">Download official question papers for Paper 1 (General Ability) and Paper 2 (General Studies, Essay & Comp).</p>
      </header>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-blue-700">
          <p className="font-semibold">How to add PDFs?</p>
          <p className="mt-1 opacity-90">
            Place your PDF files in the <code>public/papers/</code> folder of your project structure. 
            Name them like <code>2023_paper1.pdf</code> to match the default links, or update <code>constants.ts</code> to point to your custom URLs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {PREVIOUS_PAPERS.map((paper) => (
          <div 
            key={paper.year}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-xl text-slate-600">
                {paper.year}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">CAPF AC Examination {paper.year}</h3>
                <p className="text-sm text-slate-500">Union Public Service Commission</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a 
                href={paper.paper1Url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:text-primary-600 transition-colors"
              >
                <FileDown size={18} />
                Paper 1
              </a>
              <a 
                href={paper.paper2Url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 text-primary-700 font-medium rounded-lg hover:bg-primary-100 transition-colors"
              >
                <FileDown size={18} />
                Paper 2
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviousPapers;