import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Activity, ShieldCheck, ShieldAlert, HeartPulse } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ResultSection({ result }) {
  if (!result) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-full min-h-[400px] text-center opacity-80">
        <div className="bg-gray-50 p-4 rounded-full mb-4 ring-8 ring-gray-50/50">
          <Activity className="w-12 h-12 text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700">No Assessment Data Yet</h3>
        <p className="text-gray-400 text-sm mt-3 max-w-[280px] leading-relaxed">
          Fill out the health log and generate insights to see your personalized health score.
        </p>
      </div>
    );
  }

  const chartData = {
    labels: ['Sleep', 'Appetite', 'Stress', 'Activity'],
    datasets: [
      {
        data: [result.sleep, result.appetite, result.stress, result.activity],
        backgroundColor: [
          '#6366f1', // Indigo
          '#0ea5e9', // Sky blue
          '#f43f5e', // Rose
          '#10b981', // Emerald
        ],
        borderWidth: 0,
        hoverOffset: 4,
        cutout: '70%', // Creates the doughnut hole
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { 
          usePointStyle: true, 
          padding: 24,
          font: {
            family: "'Inter', sans-serif",
            size: 11,
            weight: '500'
          },
          color: '#64748b'
        } 
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 13 },
        bodyFont: { size: 13 }
      }
    },
  };

  const getStatusInfo = (score) => {
    if (score >= 16) return { text: "Excellent", color: "text-emerald-700", bg: "bg-emerald-50", icon: ShieldCheck, ring: "ring-emerald-600/20" };
    if (score >= 12) return { text: "Good", color: "text-emerald-700", bg: "bg-emerald-50", icon: ShieldCheck, ring: "ring-emerald-600/20" };
    if (score >= 8) return { text: "Moderate", color: "text-amber-700", bg: "bg-amber-50", icon: ShieldAlert, ring: "ring-amber-600/20" };
    return { text: "Poor", color: "text-rose-700", bg: "bg-rose-50", icon: HeartPulse, ring: "ring-rose-600/20" };
  };

  const status = getStatusInfo(result.score);
  const StatusIcon = status.icon;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Health Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Based on latest assessment</p>
        </div>
        <div className={`px-3 py-1.5 rounded-md flex gap-1.5 items-center font-semibold text-xs ring-1 ring-inset ${status.bg} ${status.color} ${status.ring}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {status.text}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center flex-grow">
        {/* Score & Chart */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative min-h-[240px]">
           <div className="absolute inset-0 flex items-center justify-center mb-[46px] pointer-events-none">
             <div className="flex flex-col items-center text-center">
               <span className="text-4xl font-extrabold text-gray-900 tracking-tight">{result.score}</span>
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Score</span>
             </div>
           </div>
           <div className="w-full h-[240px] relative z-10">
             <Doughnut data={chartData} options={chartOptions} />
           </div>
        </div>

        {/* Details & Recommendation */}
        <div className="w-full md:w-1/2 flex flex-col gap-5 h-full">
           <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100/80 flex-grow relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl"></div>
             <h3 className="text-[11px] font-bold text-gray-500 mb-2.5 uppercase tracking-wider">Professional Recommendation</h3>
             <p className="text-gray-700 text-sm leading-relaxed font-medium">
               {result.recommendation}
             </p>
           </div>

           <div className="grid grid-cols-2 gap-3 mt-auto">
             <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100/50 flex flex-col items-center justify-center hover:bg-indigo-50 transition-colors">
                <span className="block text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Sleep</span>
                <span className="text-xl font-bold text-indigo-700">{result.sleep}</span>
             </div>
             <div className="bg-sky-50/50 p-3.5 rounded-xl border border-sky-100/50 flex flex-col items-center justify-center hover:bg-sky-50 transition-colors">
                <span className="block text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-1">Appetite</span>
                <span className="text-xl font-bold text-sky-700">{result.appetite}</span>
             </div>
             <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-100/50 flex flex-col items-center justify-center hover:bg-rose-50 transition-colors">
                <span className="block text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">Stress</span>
                <span className="text-xl font-bold text-rose-700">{result.stress}</span>
             </div>
             <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100/50 flex flex-col items-center justify-center hover:bg-emerald-50 transition-colors">
                <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Activity</span>
                <span className="text-xl font-bold text-emerald-700">{result.activity}</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
