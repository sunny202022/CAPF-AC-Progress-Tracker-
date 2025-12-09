import React, { useState, useEffect } from 'react';
import { TEST_PAPERS, SYLLABUS_DATA } from '../constants';
import { Question, TestPaper } from '../types';
import { PlayCircle, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, ChevronLeft, RotateCcw, ArrowLeft, LayoutList, Trophy } from 'lucide-react';

const PracticeTest: React.FC = () => {
  // Test Stages: 'categories' -> 'test-list' -> 'running' -> 'result'
  const [testStage, setTestStage] = useState<'categories' | 'test-list' | 'running' | 'result'>('categories');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [activeTestPaper, setActiveTestPaper] = useState<TestPaper | null>(null);
  
  // Test State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // qId -> optionIndex
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);

  // Timer Logic
  useEffect(() => {
    let timer: any;
    if (testStage === 'running' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Trigger Notification when time runs out
            if ('Notification' in window && Notification.permission === 'granted') {
               new Notification("Time's Up!", {
                 body: "Your practice test has ended automatically.",
                 icon: "/vite.svg"
               });
            }
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStage, timeLeft]);

  // Navigate to Test List
  const handleSelectCategory = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setTestStage('test-list');
  };

  // Start specific test
  const startTest = (testPaper: TestPaper) => {
    setActiveTestPaper(testPaper);
    // Shuffle questions if needed, or keep order. Let's keep order for structured tests.
    // To shuffle: const questions = [...testPaper.questions].sort(() => Math.random() - 0.5);
    const questions = testPaper.questions;

    if (questions.length === 0) {
      alert("This test has no questions yet.");
      return;
    }

    setActiveQuestions(questions);
    setCurrentQIndex(0);
    setAnswers({});
    setMarkedForReview([]);
    
    // Set Timer from test definition
    setTimeLeft(testPaper.duration * 60); 
    
    setTestStage('running');
  };

  const handleAnswer = (optionIdx: number) => {
    const qId = activeQuestions[currentQIndex].id;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = () => {
    setTestStage('result');
  };

  const toggleReview = () => {
    const qId = activeQuestions[currentQIndex].id;
    if (markedForReview.includes(qId)) {
      setMarkedForReview(markedForReview.filter(id => id !== qId));
    } else {
      setMarkedForReview([...markedForReview, qId]);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- CATEGORIES VIEW ---
  if (testStage === 'categories') {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Practice Tests</h1>
          <p className="text-slate-500 mt-2">Select a category to view available test papers.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Mock Card */}
          <div 
            onClick={() => handleSelectCategory('all')}
            className="bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/30 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-all"></div>
            <Trophy size={48} className="mb-4 text-primary-200" />
            <h3 className="text-2xl font-bold mb-2">Full Length Mocks</h3>
            <p className="text-primary-100 mb-6">Complete syllabus mock tests. Simulate the real exam environment.</p>
            <div className="flex items-center gap-2 font-medium text-white/90">
              View Papers <ChevronRight size={18} />
            </div>
          </div>

          {/* Subject Wise Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <LayoutList size={20} className="text-slate-400" />
              Subject Wise Tests
            </h3>
            <div className="space-y-2">
              {SYLLABUS_DATA.filter(s => s.id !== 'paper2').map(subject => (
                <button
                  key={subject.id}
                  onClick={() => handleSelectCategory(subject.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors group"
                >
                  <span className="font-medium text-slate-700 group-hover:text-primary-600">{subject.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium bg-white px-2 py-1 rounded border border-slate-100">
                      {TEST_PAPERS.filter(t => t.subjectId === subject.id).length} Tests
                    </span>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-primary-500" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- TEST LIST VIEW ---
  if (testStage === 'test-list') {
    const availableTests = TEST_PAPERS.filter(t => t.subjectId === selectedSubjectId);
    const categoryName = selectedSubjectId === 'all' 
      ? "Full Length Mocks" 
      : SYLLABUS_DATA.find(s => s.id === selectedSubjectId)?.name || "Tests";

    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setTestStage('categories')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Back to Categories
        </button>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{categoryName}</h1>
          <p className="text-slate-500 mt-1">Choose a test paper to begin.</p>
        </header>

        {availableTests.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
            <div className="mx-auto w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-3">
              <LayoutList size={24} />
            </div>
            <p className="text-slate-600 font-medium">No tests available for this category yet.</p>
            <p className="text-sm text-slate-400 mt-1">Please check back later or update the constants file.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {availableTests.map(test => (
              <div 
                key={test.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-lg">{test.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${
                      test.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      test.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {test.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={14} /> {test.duration} mins</span>
                    <span className="flex items-center gap-1"><LayoutList size={14} /> {test.questions.length} Questions</span>
                  </div>
                </div>

                <button 
                  onClick={() => startTest(test)}
                  className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-sm hover:bg-primary-700 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <PlayCircle size={18} />
                  Start Test
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- RUNNING TEST VIEW ---
  if (testStage === 'running' && activeTestPaper) {
    const currentQ = activeQuestions[currentQIndex];
    const isReview = markedForReview.includes(currentQ.id);

    return (
      <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col">
        {/* Timer Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between mb-6 sticky top-0 z-20">
          <div>
            <h2 className="text-sm font-bold text-slate-900 hidden md:block">{activeTestPaper.title}</h2>
            <div className="flex items-center gap-2 text-slate-600 text-xs md:text-sm">
              <span className="bg-slate-100 px-2 py-1 rounded">Q {currentQIndex + 1} / {activeQuestions.length}</span>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 60 ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
            <Clock size={20} />
            {formatTime(timeLeft)}
          </div>
          
          <button 
             onClick={() => { if(confirm("Finish test?")) handleSubmit(); }}
             className="text-sm text-white bg-slate-900 px-4 py-2 rounded-lg hover:bg-slate-800"
          >
            Submit
          </button>
        </div>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-lg md:text-xl font-medium text-slate-900 leading-relaxed mb-6">
              <span className="text-slate-400 font-bold mr-2">{currentQIndex + 1}.</span>
              {currentQ.text}
            </h2>
            
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[currentQ.id] === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`
                      p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3
                      ${isSelected 
                        ? 'border-primary-500 bg-primary-50 text-primary-900' 
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700'}
                    `}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary-500' : 'border-slate-300'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                    </div>
                    {option}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <button 
             onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
             disabled={currentQIndex === 0}
             className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 text-slate-600 font-medium"
           >
             <ChevronLeft size={20} /> Prev
           </button>

           <button 
             onClick={toggleReview}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium ${isReview ? 'bg-amber-50 border-amber-200 text-amber-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
           >
             <AlertCircle size={18} /> {isReview ? 'Unmark Review' : 'Mark for Review'}
           </button>

           <button 
             onClick={() => setCurrentQIndex(prev => Math.min(activeQuestions.length - 1, prev + 1))}
             disabled={currentQIndex === activeQuestions.length - 1}
             className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 text-slate-600 font-medium"
           >
             Next <ChevronRight size={20} />
           </button>
        </div>
      </div>
    );
  }

  // --- RESULTS VIEW ---
  if (testStage === 'result') {
    let score = 0;
    let correctCount = 0;
    activeQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score += 2; // Assuming 2 marks per question
        correctCount++;
      }
    });
    
    const accuracy = Math.round((correctCount / activeQuestions.length) * 100) || 0;

    return (
      <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-300">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h1 className="text-3xl font-bold text-slate-900">Test Results</h1>
             <p className="text-slate-500 mt-1">{activeTestPaper?.title}</p>
          </div>
          <button 
            onClick={() => setTestStage('categories')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 shadow-sm justify-center"
          >
            <RotateCcw size={18} /> Back to Tests
          </button>
        </header>

        {/* Score Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
           <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
             <div className="text-slate-500 text-[10px] md:text-xs uppercase font-bold tracking-wider">Score</div>
             <div className="text-2xl md:text-3xl font-black text-primary-600 mt-2">{score} <span className="text-sm text-slate-400 font-medium">/ {activeQuestions.length * 2}</span></div>
           </div>
           <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
             <div className="text-slate-500 text-[10px] md:text-xs uppercase font-bold tracking-wider">Correct</div>
             <div className="text-2xl md:text-3xl font-black text-emerald-500 mt-2">{correctCount}</div>
           </div>
           <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
             <div className="text-slate-500 text-[10px] md:text-xs uppercase font-bold tracking-wider">Accuracy</div>
             <div className="text-2xl md:text-3xl font-black text-slate-800 mt-2">{accuracy}%</div>
           </div>
        </div>

        {/* Detailed Review */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Detailed Solutions</h2>
          {activeQuestions.map((q, idx) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            const isSkipped = userAnswer === undefined;

            return (
              <div key={q.id} className={`bg-white p-6 rounded-xl border ${isCorrect ? 'border-emerald-100' : isSkipped ? 'border-slate-200' : 'border-rose-100'} shadow-sm`}>
                 <div className="flex items-start gap-3">
                   <div className="mt-1 flex-shrink-0">
                     {isCorrect 
                       ? <CheckCircle className="text-emerald-500" size={24} /> 
                       : isSkipped 
                         ? <AlertCircle className="text-slate-400" size={24} />
                         : <XCircle className="text-rose-500" size={24} />
                     }
                   </div>
                   <div className="flex-1 min-w-0">
                     <h3 className="text-lg font-medium text-slate-900 mb-3"><span className="text-slate-400 mr-2">Q{idx+1}.</span> {q.text}</h3>
                     
                     <div className="space-y-2 mb-4">
                       {q.options.map((opt, optIdx) => (
                         <div 
                           key={optIdx} 
                           className={`
                             px-3 py-2 rounded-lg text-sm border
                             ${optIdx === q.correctAnswer 
                               ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium' 
                               : optIdx === userAnswer 
                                 ? 'bg-rose-50 border-rose-200 text-rose-800' 
                                 : 'border-transparent text-slate-500'}
                           `}
                         >
                           {opt} {optIdx === q.correctAnswer && "(Correct Answer)"} {optIdx === userAnswer && !isCorrect && "(Your Answer)"}
                         </div>
                       ))}
                     </div>

                     <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600">
                       <span className="font-bold text-slate-700">Explanation: </span>
                       {q.explanation || "No explanation provided."}
                     </div>
                   </div>
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default PracticeTest;