import React, { useState, useEffect } from 'react';
import { CODING_PROBLEMS } from '../constants';
import { CodingProblem } from '../types';
import { Play, Check, X, RotateCcw, ChevronRight, Terminal, Code2, Loader2 } from 'lucide-react';

const CodingArena: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [output, setOutput] = useState<any[]>([]);
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  const [pyodideError, setPyodideError] = useState<string | null>(null);

  // Initialize Pyodide on mount
  useEffect(() => {
    const loadPyodide = async () => {
      try {
        if ((window as any).pyodide) {
          setIsPyodideReady(true);
          return;
        }

        if ((window as any).loadPyodide) {
          (window as any).pyodide = await (window as any).loadPyodide();
          setIsPyodideReady(true);
        } else {
          // Wait a bit for script to load if called too early
          setTimeout(loadPyodide, 500);
        }
      } catch (err) {
        setPyodideError("Failed to load Python engine. Please refresh.");
      }
    };
    loadPyodide();
  }, []);

  const loadProblem = (problem: CodingProblem) => {
    setSelectedProblem(problem);
    setUserCode(problem.starterCode);
    setOutput([]);
    setExecutionStatus('idle');
  };

  const runTests = async () => {
    if (!selectedProblem || !isPyodideReady) return;
    const pyodide = (window as any).pyodide;
    
    setExecutionStatus('running');
    const results = [];
    let allPassed = true;

    try {
      // 1. Run User Code to define the function in Python environment
      // We wrap it to ensure indentation or scope doesn't break easily, 
      // but simplistic 'runPython' usually works for global definitions.
      pyodide.runPython(userCode);

      // 2. Extract function name from definition
      // e.g., "def twoSum(nums, target):" -> "twoSum"
      const match = userCode.match(/def\s+(\w+)/);
      if (!match) {
        throw new Error("Could not find function definition. Did you change the function name?");
      }
      const functionName = match[1];
      const pythonFunc = pyodide.globals.get(functionName);

      if (!pythonFunc) {
        throw new Error(`Function '${functionName}' is not defined.`);
      }

      // 3. Run Test Cases
      for (const testCase of selectedProblem.testCases) {
        try {
            // Pyodide automatically converts JS arrays to Python lists for arguments
            const result = pythonFunc(...testCase.input);
            
            // Handle Proxy objects returned by Pyodide (e.g., Python lists become JS proxies)
            let actualJS = result;
            if (result && typeof result.toJs === 'function') {
                actualJS = result.toJs();
            }

            // Simple deep comparison via JSON stringify
            const passed = JSON.stringify(actualJS) === JSON.stringify(testCase.expected);
            
            if (!passed) allPassed = false;

            results.push({
              input: JSON.stringify(testCase.input),
              expected: JSON.stringify(testCase.expected),
              actual: JSON.stringify(actualJS),
              passed
            });

            // Cleanup if needed (Pyodide usually manages simple types fine)
            if (result && typeof result.destroy === 'function') {
              result.destroy();
            }

        } catch (err: any) {
            allPassed = false;
            results.push({
              input: JSON.stringify(testCase.input),
              expected: JSON.stringify(testCase.expected),
              actual: `Error: ${err.message}`,
              passed: false
            });
        }
      }

      setOutput(results);
      setExecutionStatus(allPassed ? 'success' : 'failed');

    } catch (globalErr: any) {
       setExecutionStatus('failed');
       setOutput([{ input: '-', expected: '-', actual: `Runtime Error: ${globalErr.message}`, passed: false}]);
    }
  };

  if (!selectedProblem) {
    return (
      <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
             <Terminal className="text-slate-800" />
             Coding Arena
          </h1>
          <p className="text-slate-500 mt-2">Practice logic and algorithms with an integrated Python environment.</p>
          {!isPyodideReady && !pyodideError && (
             <div className="flex items-center gap-2 mt-4 text-sm text-primary-600 bg-primary-50 px-3 py-2 rounded-lg inline-block">
               <Loader2 className="animate-spin" size={16} /> Initializing Python Engine...
             </div>
          )}
          {pyodideError && (
             <div className="mt-4 text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-lg inline-block">
               {pyodideError}
             </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CODING_PROBLEMS.map(problem => (
            <div 
              key={problem.id}
              onClick={() => isPyodideReady && loadProblem(problem)}
              className={`bg-white p-6 rounded-xl border shadow-sm transition-all group relative
                ${!isPyodideReady ? 'opacity-50 cursor-wait' : 'hover:shadow-md hover:border-primary-300 cursor-pointer border-slate-200'}
              `}
            >
              <div className="flex justify-between items-start mb-4">
                 <div className={`
                   w-10 h-10 rounded-lg flex items-center justify-center 
                   ${problem.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-600' : 
                     problem.difficulty === 'Medium' ? 'bg-amber-100 text-amber-600' : 
                     'bg-rose-100 text-rose-600'}
                 `}>
                   <Code2 size={20} />
                 </div>
                 <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide
                    ${problem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                      'bg-rose-50 text-rose-600 border border-rose-100'}
                 `}>
                   {problem.difficulty}
                 </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                {problem.title}
              </h3>
              <div className="flex items-center text-sm text-slate-400">
                 Solve Problem <ChevronRight size={16} className="ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-4 animate-in slide-in-from-right-4 duration-300">
      
      {/* Left Panel: Problem Description */}
      <div className="w-full md:w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <button onClick={() => setSelectedProblem(null)} className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center gap-1">
             <RotateCcw size={14} /> All Problems
          </button>
          <span className={`text-xs font-bold px-2 py-1 rounded border ${
            selectedProblem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
            selectedProblem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
            'bg-rose-50 text-rose-600 border-rose-100'
          }`}>
             {selectedProblem.difficulty}
          </span>
        </div>
        <div className="p-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
           <h2 className="text-2xl font-bold text-slate-900 mb-4">{selectedProblem.title}</h2>
           <div className="prose prose-slate prose-sm">
             <p className="whitespace-pre-line text-slate-600">{selectedProblem.description}</p>
           </div>
           
           <div className="mt-8">
             <h4 className="font-bold text-slate-900 mb-2 text-sm">Example 1:</h4>
             <div className="bg-slate-100 p-3 rounded-lg text-xs font-mono text-slate-700">
                <p><span className="font-semibold">Input:</span> {JSON.stringify(selectedProblem.testCases[0].input)}</p>
                <p><span className="font-semibold">Output:</span> {JSON.stringify(selectedProblem.testCases[0].expected)}</p>
             </div>
           </div>
        </div>
      </div>

      {/* Right Panel: Editor & Console */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Editor Area */}
        <div className="flex-1 bg-[#1e1e1e] rounded-xl shadow-sm border border-slate-800 flex flex-col overflow-hidden">
           <div className="bg-[#252526] px-4 py-2 border-b border-[#333] flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-2">
                <Code2 size={14} /> Python 3 (Pyodide)
              </span>
              <button 
                onClick={runTests}
                disabled={executionStatus === 'running'}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-wait text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-2 transition-colors"
              >
                {executionStatus === 'running' ? <Loader2 className="animate-spin" size={12} /> : <Play size={12} />}
                Run Code
              </button>
           </div>
           <textarea 
             className="flex-1 w-full bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm resize-none focus:outline-none leading-relaxed [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full"
             value={userCode}
             onChange={(e) => setUserCode(e.target.value)}
             spellCheck={false}
             placeholder="Write your Python code here..."
           />
        </div>

        {/* Output Console */}
        <div className="h-48 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
           <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">Test Results</span>
              {executionStatus === 'success' && <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><Check size={12}/> All Passed</span>}
              {executionStatus === 'failed' && <span className="text-xs text-rose-600 font-bold flex items-center gap-1"><X size={12}/> Tests Failed</span>}
           </div>
           
           <div className="p-4 overflow-y-auto font-mono text-sm space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
              {output.length === 0 ? (
                <div className="text-slate-400 text-center mt-4">
                  {executionStatus === 'running' ? 'Executing Python code...' : 'Run the code to see results...'}
                </div>
              ) : (
                output.map((res, idx) => (
                  <div key={idx} className={`p-2 rounded border ${res.passed ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'} flex items-center justify-between`}>
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {res.passed ? <Check size={14} className="text-emerald-500" /> : <X size={14} className="text-rose-500" />}
                          <span className={`font-bold ${res.passed ? 'text-emerald-700' : 'text-rose-700'}`}>Test Case {idx + 1}</span>
                        </div>
                        <div className="text-xs text-slate-600 pl-6">
                           Input: {res.input} <br/>
                           Expected: {res.expected} <br/>
                           Actual: {res.actual}
                        </div>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default CodingArena;