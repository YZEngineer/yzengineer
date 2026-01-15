
import React, { useState, useEffect } from 'react';
import { AppState, StudentProfile } from './types';
import StudentPanel from './components/StudentPanel';

const INITIAL_STATE: AppState = {
  students: [
    { id: 'student-1', name: 'Muhammed Eymen', surname: 'Aydın', entries: {} },
    { id: 'student-2', name: 'Enes Talha', surname: 'Fırat', entries: {} },
    { id: 'student-3', name: 'Kenan', surname: 'Çetin', entries: {} },
  ]
};

const STUDENT_COLORS = [
  { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', fill: 'bg-indigo-600', hover: 'hover:bg-indigo-100' },
  { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', fill: 'bg-emerald-600', hover: 'hover:bg-emerald-100' },
  { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', fill: 'bg-violet-600', hover: 'hover:bg-violet-100' },
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('listen_track_2026_data_v2');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('listen_track_2026_data_v2', JSON.stringify(state));
  }, [state]);

  const updateStudent = (updatedStudent: StudentProfile) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === updatedStudent.id ? updatedStudent : s)
    }));
  };

  const activeStudent = state.students.find(s => s.id === activeStudentId);
  const activeIndex = state.students.findIndex(s => s.id === activeStudentId);
  const activeColor = activeIndex !== -1 ? STUDENT_COLORS[activeIndex % STUDENT_COLORS.length] : null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12">
      <style>{`
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(99, 102, 241, 0.2); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          50% { border-color: rgba(99, 102, 241, 1); box-shadow: 0 0 20px 0 rgba(99, 102, 241, 0.2); }
        }
        .pulse-select {
          animation: pulse-border 2s infinite ease-in-out;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-2.5 rounded-2xl shadow-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">ListenTrack <span className="text-indigo-600">2026</span></h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                {activeStudent ? `${activeStudent.name}'s Dashboard` : 'Student Selection'}
              </p>
            </div>
          </div>

          {activeStudent && (
            <button 
              onClick={() => setActiveStudentId(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
              Switch Student
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-10">
        {!activeStudentId ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Welcome Back!</h2>
            <p className="text-slate-500 font-medium mb-12">Please select your name to continue your English journey.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
              {state.students.map((s, idx) => {
                const color = STUDENT_COLORS[idx % STUDENT_COLORS.length];
                return (
                  <button 
                    key={s.id}
                    onClick={() => setActiveStudentId(s.id)}
                    className={`group relative flex flex-col items-center p-10 rounded-[3rem] bg-white border-2 border-transparent transition-all hover:-translate-y-2 pulse-select`}
                  >
                    <div className={`w-20 h-20 rounded-3xl ${color.bg} ${color.text} flex items-center justify-center text-2xl font-black mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                      {s.name[0]}{s.surname[0]}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-1">
                      {s.name}
                    </h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                      {s.surname}
                    </p>
                    <div className={`mt-8 px-6 py-2 rounded-full ${color.fill} text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-indigo-100`}>
                      Open Profile
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="relative pt-4">
              <div className="absolute -top-1 left-6 z-10">
                <span className={`bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-2 border-2 border-white`}>
                  <span className={`w-2 h-2 rounded-full ${activeColor?.fill}`}></span>
                  Active Session: {activeStudent?.name} {activeStudent?.surname}
                </span>
              </div>
              {activeStudent && (
                <StudentPanel 
                  student={activeStudent} 
                  onUpdate={updateStudent} 
                  accentColor={activeColor?.fill}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 text-center border-t border-slate-200">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em]">
          Classroom Listening Log &bull; AI Evaluation &bull; 2026
        </p>
      </footer>
    </div>
  );
};

export default App;
