
import React, { useState, useEffect } from 'react';
import { StudentProfile, ListeningEntry } from '../types';
import Calendar from './Calendar';
import { getListeningFeedback } from '../services/geminiService';

interface StudentPanelProps {
  student: StudentProfile;
  onUpdate: (updatedStudent: StudentProfile) => void;
  accentColor?: string;
}

const StudentPanel: React.FC<StudentPanelProps> = ({ student, onUpdate, accentColor = 'bg-indigo-600' }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Sync inputs with selected date
  useEffect(() => {
    const entry = student.entries[selectedDate];
    if (entry) {
      setTitle(entry.title);
      setSummary(entry.summary);
    } else {
      setTitle('');
      setSummary('');
    }
  }, [selectedDate, student.entries]);

  const handleSave = () => {
    if (!title.trim() || !summary.trim()) return;

    const newEntry: ListeningEntry = {
      title,
      summary,
      timestamp: Date.now(),
      aiFeedback: student.entries[selectedDate]?.aiFeedback
    };

    const updatedEntries = { ...student.entries, [selectedDate]: newEntry };
    onUpdate({ ...student, entries: updatedEntries });
  };

  const handleGetFeedback = async () => {
    if (!title.trim() || !summary.trim()) return;
    setLoadingFeedback(true);
    
    handleSave();
    
    const feedback = await getListeningFeedback(title, summary);
    
    const updatedEntry = { 
      ...student.entries[selectedDate], 
      title, 
      summary, 
      aiFeedback: feedback,
      timestamp: Date.now() 
    };
    
    onUpdate({
      ...student,
      entries: { ...student.entries, [selectedDate]: updatedEntry }
    });
    setLoadingFeedback(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'name' | 'surname') => {
    onUpdate({ ...student, [field]: e.target.value });
  };

  const currentEntry = student.entries[selectedDate];
  
  // Explicitly cast Object.entries results to [string, ListeningEntry][] to fix 'unknown' type errors in the map loop below.
  const sortedHistory = (Object.entries(student.entries) as [string, ListeningEntry][])
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA));

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-6 p-6 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 transition-all">
        {/* Student Identity */}
        <div className="space-y-3 pt-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Student Profile</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="First Name"
              value={student.name}
              onChange={(e) => handleNameChange(e, 'name')}
              className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-300 outline-none transition-all text-xs font-bold"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={student.surname}
              onChange={(e) => handleNameChange(e, 'surname')}
              className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-300 outline-none transition-all text-xs font-bold"
            />
          </div>
        </div>

        {/* Date Selector */}
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 px-1">2026 Calendar</label>
          <Calendar 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate} 
            entries={student.entries}
          />
        </div>

        {/* Entry Form */}
        <div className="flex-1 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between items-center px-1">
              <span>Listening Source</span>
              {currentEntry && <span className="text-emerald-500 font-black">Logged ✓</span>}
            </label>
            <input
              type="text"
              placeholder="e.g. BBC, CNN, YouTube, Podcast..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all text-sm font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Comprehension Summary</label>
            <textarea
              placeholder="What did you understand from today's listening? Write at least 2 sentences..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={5}
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all text-sm leading-relaxed resize-none font-medium"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!title || !summary}
              className={`flex-1 ${accentColor} text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:brightness-110 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100 active:scale-95`}
            >
              Save Record
            </button>
            
            {currentEntry && (
               <button
                onClick={handleGetFeedback}
                disabled={loadingFeedback}
                className="px-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black disabled:opacity-50 transition-all shadow-lg flex items-center justify-center active:scale-95"
                title="Get AI Feedback"
              >
                {loadingFeedback ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                )}
              </button>
            )}
          </div>

          {currentEntry?.aiFeedback && (
            <div className="mt-6 p-5 bg-slate-50 rounded-3xl border border-slate-200 shadow-inner animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h4 className="text-[10px] font-black text-slate-800 uppercase mb-3 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.477.859h4z"/></svg>
                AI Tutor Feedback
              </h4>
              <div className="text-xs text-slate-600 leading-relaxed space-y-2 whitespace-pre-wrap font-medium bg-white/50 p-3 rounded-xl">
                 {currentEntry.aiFeedback}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      <div className="mt-4 space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
          <span>Your Activity History</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </h3>
        
        {sortedHistory.length === 0 ? (
          <div className="p-10 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem]">
            <p className="text-sm font-bold text-slate-400">No logs found yet. Start listening!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sortedHistory.map(([date, entry]) => (
              <div 
                key={date} 
                onClick={() => setSelectedDate(date)}
                className={`p-5 rounded-[2rem] bg-white border border-slate-200 shadow-sm transition-all cursor-pointer hover:shadow-md hover:border-slate-300 group ${selectedDate === date ? 'ring-2 ring-indigo-500 border-transparent' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">
                      {date}
                    </span>
                    <h4 className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                      {entry.title}
                    </h4>
                  </div>
                  {entry.aiFeedback && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200" title="Feedback ready"></div>
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {entry.summary}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPanel;
