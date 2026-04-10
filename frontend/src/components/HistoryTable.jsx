import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

// Added = [] to the destructuring to prevent the .length error
export default function HistoryTable({ history = [], onSelect }) {
  
  const getStatusColor = (status) => {
    const colors = {
      'Excellent': 'text-emerald-700 bg-emerald-50 ring-emerald-600/20',
      'Good': 'text-emerald-700 bg-emerald-50 ring-emerald-600/20',
      'Moderate': 'text-amber-700 bg-amber-50 ring-amber-600/20',
      'Poor': 'text-rose-700 bg-rose-50 ring-rose-600/20',
    };
    return colors[status] || 'text-gray-700 bg-gray-50 ring-gray-600/20';
  };

  const getScorePercentage = (score) => (score / 20) * 100;

  // Safe check for length
  if (!history || history.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-slate-800 font-bold text-lg">No history yet</h3>
        <p className="text-slate-500 mt-2">Submit a health assessment to see your progress.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-6 py-5 border-b border-slate-100 bg-white flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          Assessment History
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {history.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => onSelect && onSelect(item.id)}
                className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-900">{item.score}</span>
                    <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full" 
                        style={{ width: `${getScorePercentage(item.score)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}