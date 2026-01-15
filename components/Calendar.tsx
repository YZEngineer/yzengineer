
import React, { useState } from 'react';

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  entries: Record<string, any>;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, entries }) => {
  const [currentMonth, setCurrentMonth] = useState(0); // 0-11
  const year = 2026;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
  const nextMonth = () => setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));

  const days = Array.from({ length: daysInMonth(currentMonth) }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth(currentMonth) }, (_, i) => i);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h3 className="font-bold text-slate-700">{months[currentMonth]} {year}</h3>
        <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
          <div key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map(b => <div key={`b-${b}`} />)}
        {days.map(d => {
          const dateStr = `${year}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const isSelected = selectedDate === dateStr;
          const hasEntry = !!entries[dateStr];

          return (
            <button
              key={d}
              onClick={() => onDateSelect(dateStr)}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg relative transition-all
                ${isSelected ? 'bg-indigo-600 text-white shadow-md scale-110 z-10' : 'hover:bg-indigo-50 text-slate-600'}
                ${hasEntry && !isSelected ? 'bg-emerald-50 text-emerald-700 font-semibold' : ''}
              `}
            >
              {d}
              {hasEntry && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
