import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Activity, BarChart3, Clock, User, HeartPulse } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    sleepQuality: 3,
    appetite: 3,
    stressLevel: 3,
    physicalActivity: 3,
  });

  // Results State
  const [result, setResult] = useState(null);
  
  // History State
  const [history, setHistory] = useState([
    { id: 1, date: '2023-11-15', score: 85, status: 'Good' },
    { id: 2, date: '2023-11-10', score: 65, status: 'Moderate' },
  ]);

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const calculateScore = () => {
    // Basic calculation: Higher physical activity, sleep, appetite is good. Low stress is good.
    // Inverting stress: 5 -> 1, 1 -> 5
    const invertedStress = 6 - formData.stressLevel;
    const totalScore = formData.sleepQuality + formData.appetite + invertedStress + formData.physicalActivity;
    // Max possible is 20
    const percentage = Math.round((totalScore / 20) * 100);
    return percentage;
  };

  const getStatus = (score) => {
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Moderate';
    return 'Poor';
  };

  const getRecommendation = (score) => {
    if (score >= 80) return 'Great job! Keep maintaining your healthy lifestyle routines.';
    if (score >= 60) return 'You are doing okay, but there is room for improvement. Consider adjusting your active routine and managing stress.';
    return 'We highly recommend consulting a healthcare professional and making immediate lifestyle changes.';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const score = calculateScore();
    const status = getStatus(score);
    const newResult = {
      score,
      status,
      recommendation: getRecommendation(score),
      inputs: { ...formData },
    };
    
    setResult(newResult);

    const newHistoryEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      score,
      status,
    };
    
    setHistory([newHistoryEntry, ...history]);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const chartData = result ? {
    labels: ['Sleep Quality', 'Appetite', 'Stress Level', 'Physical Activity'],
    datasets: [
      {
        data: [
          result.inputs.sleepQuality,
          result.inputs.appetite,
          result.inputs.stressLevel,
          result.inputs.physicalActivity,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue-500
          'rgba(16, 185, 129, 0.8)', // emerald-500
          'rgba(244, 63, 94, 0.8)',  // rose-500
          'rgba(245, 158, 11, 0.8)', // amber-500
        ],
        borderColor: [
          'rgba(255, 255, 255, 1)',
        ],
        borderWidth: 2,
      },
    ],
  } : null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Good': return 'text-emerald-600 bg-emerald-50';
      case 'Moderate': return 'text-amber-600 bg-amber-50';
      case 'Poor': return 'text-rose-600 bg-rose-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Health AI</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-500 hover:text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-6">
              <HeartPulse className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800">Health Assessment</h2>
            </div>
            <p className="text-gray-500 text-sm mb-8">Rate your current status for the following indicators on a scale of 1 to 5.</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Slider Component Generator */}
              {[
                { name: 'sleepQuality', label: 'Sleep Quality', desc: '1 = Poor, 5 = Excellent' },
                { name: 'appetite', label: 'Appetite', desc: '1 = Poor, 5 = Excellent' },
                { name: 'stressLevel', label: 'Stress Level', desc: '1 = Very Low, 5 = Very High' },
                { name: 'physicalActivity', label: 'Physical Activity', desc: '1 = Sedentary, 5 = Very Active' },
              ].map((field) => (
                <div key={field.name} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-700 text-sm">{field.label}</label>
                    <span className="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full text-xs">
                      {formData[field.name]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-xs text-gray-400">{field.desc}</p>
                </div>
              ))}

              <button
                type="submit"
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-all pt-3 focus:ring-4 focus:ring-blue-100 flex justify-center items-center space-x-2"
              >
                <Activity className="w-5 h-5" />
                <span>Generate Health Analysis</span>
              </button>
            </form>
          </div>

          {/* Right Column: Result */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800">Your Results</h2>
            </div>

            {result ? (
              <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-8">
                  <div className="inline-flex justify-center items-center w-32 h-32 rounded-full border-8 border-gray-50 mb-4 shadow-inner relative">
                    <span className="text-4xl font-black text-gray-800">
                      {result.score}
                    </span>
                    <span className="absolute bottom-6 right-6 text-sm font-medium text-gray-400">/100</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Overall Status: <span className={getStatusColor(result.status).split(' ')[0]}>{result.status}</span>
                  </h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-xl text-sm leading-relaxed border border-gray-100 shadow-sm">
                    {result.recommendation}
                  </p>
                </div>

                <div className="relative w-full max-w-[240px] mx-auto flex-1 mt-4">
                  <Pie data={chartData} options={{ maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } } }} />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <User className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">No Data Available</h3>
                <p className="text-gray-500 text-sm max-w-sm">
                  Please complete the health assessment form on the left to generate your personalized health insights.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-800">Assessment History</h2>
          </div>
          
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{record.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              record.score >= 80 ? 'bg-emerald-500' : 
                              record.score >= 60 ? 'bg-amber-400' : 'bg-rose-500'
                            }`} 
                            style={{ width: `${record.score}%` }}
                          />
                        </div>
                        <span className="font-semibold">{record.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </main>
    </div>
  );
}
