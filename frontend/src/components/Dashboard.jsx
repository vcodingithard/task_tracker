import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Activity, BarChart3, Clock, User, HeartPulse } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import API from "../api/axios";

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
  const [history, setHistory] = useState([]);

  // 🔥 Fetch history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/health");

        const formatted = res.data.map((item) => ({
          id: item._id,
          date: new Date(item.createdAt).toISOString().split("T")[0],
          score: item.score,
          status:
            item.score >= 12
              ? "Good"
              : item.score >= 8
              ? "Moderate"
              : "Poor",
        }));

        setHistory(formatted);
      } catch (err) {
        console.log(err);
      }
    };

    fetchHistory();
  }, []);

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  // 🔥 Backend API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/health", {
        sleep: formData.sleepQuality,
        appetite: formData.appetite,
        stress: formData.stressLevel,
        activity: formData.physicalActivity,
      });

      setResult(res.data);

      // Update history instantly
      setHistory([
        {
          id: res.data._id,
          date: new Date(res.data.createdAt).toISOString().split("T")[0],
          score: res.data.score,
          status:
            res.data.score >= 12
              ? "Good"
              : res.data.score >= 8
              ? "Moderate"
              : "Poor",
        },
        ...history,
      ]);

    } catch (err) {
      alert("Error submitting health data");
    }
  };

  // 🔥 Logout (backend)
  const handleLogout = async () => {
    await API.post("/auth/logout");
    navigate('/');
  };

  // 🔥 Chart data (fixed mapping)
  const chartData = result ? {
    labels: ['Sleep', 'Appetite', 'Stress', 'Activity'],
    datasets: [
      {
        data: [
          result.sleep,
          result.appetite,
          result.stress,
          result.activity,
        ],
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
      <nav className="bg-white shadow-sm border-b">
        <div className="flex justify-between h-16 items-center px-6">
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-xl">Health AI</span>
          </div>

          <button onClick={handleLogout} className="text-red-500">
            Logout
          </button>
        </div>
      </nav>

      <main className="p-6 space-y-8">

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">

          <h2 className="font-bold text-lg">Health Form</h2>

          {[
            { name: 'sleepQuality', label: 'Sleep' },
            { name: 'appetite', label: 'Appetite' },
            { name: 'stressLevel', label: 'Stress' },
            { name: 'physicalActivity', label: 'Activity' },
          ].map((field) => (
            <div key={field.name}>
              <label>{field.label}</label>
              <input
                type="range"
                min="1"
                max="5"
                name={field.name}
                value={formData[field.name]}
                onChange={handleSliderChange}
              />
            </div>
          ))}

          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>

        {/* RESULT */}
        {result && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2>Result</h2>

            <p><b>Score:</b> {result.score}</p>
            <p><b>Recommendation:</b> {result.recommendation}</p>

            <div style={{ width: "300px" }}>
              <Pie data={chartData} />
            </div>
          </div>
        )}

        {/* HISTORY */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2>History</h2>

          {history.map((item) => (
            <div key={item.id}>
              {item.date} - {item.score} ({item.status})
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}