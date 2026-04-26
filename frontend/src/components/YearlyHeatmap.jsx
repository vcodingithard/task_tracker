import React, { useState } from 'react';
import { clsx } from 'clsx';

const YearlyHeatmap = ({ history }) => {
  const days = [];
  const today = new Date();
  
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  const historyMap = history.reduce((acc, item) => {
    acc[item.date] = item;
    return acc;
  }, {});

  const [hoverData, setHoverData] = useState(null);

  const weeks = [];
  let currentWeek = [];
  
  // To make it look like a proper calendar, first day needs to be offset by day of week
  const firstDayOfWeek = new Date(days[0]).getDay(); 
  // We pad the first week
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  days.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="flex flex-col items-start w-full overflow-x-auto py-4 relative">
      <div className="flex gap-1 relative">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1">
            {week.map((day, dIdx) => {
              if (!day) return <div key={`empty-${wIdx}-${dIdx}`} className="w-3 h-3" />;

              const record = historyMap[day];
              let statusClass = "bg-gray-200 dark:bg-gray-800";
              let statusText = "No Activity";
              let reason = "";

              if (record) {
                if (record.completed) {
                  statusClass = "bg-green-500 hover:bg-green-400";
                  statusText = "Completed";
                } else if (record.completed === false) {
                  statusClass = "bg-red-500 hover:bg-red-400";
                  statusText = "Missed";
                  reason = record.reason || "No reason given";
                }
              }

              return (
                <div
                  key={day}
                  className={clsx("w-3 h-3 rounded-[2px] transition-all cursor-pointer hover:ring-2 hover:ring-gray-400", statusClass)}
                  onMouseEnter={(e) => {
                    const rect = e.target.getBoundingClientRect();
                    setHoverData({ x: rect.left + rect.width / 2, y: rect.top, date: day, status: statusText, reason });
                  }}
                  onMouseLeave={() => setHoverData(null)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {hoverData && (
        <div 
          className="fixed z-50 pointer-events-none bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap transform -translate-x-1/2 -translate-y-full mt-[-8px]"
          style={{ top: hoverData.y, left: hoverData.x }}
        >
          <div className="font-bold text-sm mb-1">{new Date(hoverData.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
          <div className={hoverData.status === 'Completed' ? 'text-green-400 font-medium' : hoverData.status === 'Missed' ? 'text-red-400 font-medium' : 'text-gray-400'}>
            {hoverData.status}
          </div>
          {hoverData.reason && <div className="text-gray-300 italic mt-1 border-t border-gray-700 pt-1">"{hoverData.reason}"</div>}
        </div>
      )}
    </div>
  );
};

export default YearlyHeatmap;
