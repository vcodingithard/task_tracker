import React, { useState } from 'react';
import API from "../api/axios";

export default function HealthForm({ onSuccess }) {
  const [form, setForm] = useState({ sleep: 3, appetite: 3, stress: 3, activity: 3 });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/health", form);
      if (onSuccess) onSuccess(res.data); 
    } catch (err) {
      alert("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold mb-6 text-slate-800">Daily Health Log</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.keys(form).map((key) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold capitalize text-slate-600">
                {key}
              </label>
              {/* This span shows the current number */}
              <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-indigo-100">
                {form[key]} / 5
              </span>
            </div>
            
            <div className="relative flex items-center">
              <input 
                type="range" 
                min="1" 
                max="5" 
                step="1"
                value={form[key]} 
                onChange={(e) => setForm({...form, [key]: Number(e.target.value)})}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:bg-slate-200 transition-colors"
              />
            </div>
            
            {/* Optional: Add low/high markers */}
            <div className="flex justify-between px-1">
              <span className="text-[10px] text-slate-400 font-medium">Low</span>
              <span className="text-[10px] text-slate-400 font-medium">High</span>
            </div>
          </div>
        ))}

        <button 
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:bg-indigo-300 disabled:shadow-none mt-4 flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            "Generate Insights"
          )}
        </button>
      </form>
    </div>
  );
}