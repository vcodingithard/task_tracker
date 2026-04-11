import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Activity, Loader2 } from 'lucide-react';
import API from "../api/axios";
import HealthForm from './HealthForm';
import ResultSection from './ResultSection';
import HistoryTable from './HistoryTable';

export default function Dashboard({ setIsAuth }) {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [fetching, setFetching] = useState(true);

  const getStatus = (score) => {
    if (score >= 16) return "Excellent";
    if (score >= 12) return "Good";
    if (score >= 8) return "Moderate";
    return "Poor";
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/health");
        // Extra Safety: Ensure we are dealing with an array
        const rawData = Array.isArray(res.data) ? res.data : [];

        const formatted = rawData.map((item) => ({
          id: item._id,
          date: item.createdAt,
          score: item.score,
          status: getStatus(item.score),
        }));

        setHistory(formatted);
      } catch (err) {
        console.error("Error fetching history:", err);
        setHistory([]); // Fallback to empty array
      } finally {
        setFetching(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSuccess = (newResult) => {
    setResult(newResult);
    setHistory((prev) => [
      {
        id: newResult._id || Date.now(),
        date: newResult.createdAt || new Date().toISOString(),
        score: newResult.score,
        status: getStatus(newResult.score),
      },
      ...prev,
    ]);
  };

  const handleSelect = async (id) => {
    try {
      const res = await API.get(`/health/${id}`);
      setResult(res.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Error fetching single result", err);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (e) {
      console.error("Logout error", e);
    }

    setIsAuth(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <nav className="bg-white sticky top-0 z-50 border-b shadow-sm h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <Activity className="text-indigo-600" />
          <span className="font-bold">Health AI</span>
        </div>
        <button onClick={handleLogout} className="text-rose-500 text-sm font-bold flex items-center gap-1">
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {fetching ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>
        ) : (
          <>
            <div className="grid lg:grid-cols-2 gap-8">
              <HealthForm onSuccess={handleSuccess} />
              <ResultSection result={result} />
            </div>
            <HistoryTable history={history} onSelect={handleSelect} />
          </>
        )}
      </main>
    </div>
  );
}