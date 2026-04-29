import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle, Loader2, Plus, AlertCircle, Quote } from 'lucide-react';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';

import * as taskApi from '../api/tasks';
import API from "../api/axios";

import StreakCard from './StreakCard';
import TaskItem from './TaskItem';
import YearlyHeatmap from './YearlyHeatmap';
import AddTaskModal from './AddTaskModal';
import ganeshaImage from "../../public/ganesha.png"
import hanumanImage from "../../public/hanuman.png"
const QUOTES = [
  "Consistency beats motivation.",
  "Do it even when you don't feel like it.",
  "No excuses. Just results.",
  "Your future is watching you.",
  "Discipline = Freedom.",
  "Small steps daily = big results.",
  "Pain is temporary. Quitting lasts forever.",
  "Don't stop when you're tired. Stop when you're done.",
  "Focus on the process, the results will follow."
];

export default function Dashboard({ setIsAuth }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [streakInfo, setStreakInfo] = useState({ currentStreak: 0, longestStreak: 0 });
  const [history, setHistory] = useState([]);
  const [historyPerTask, setHistoryPerTask] = useState({});
  const [dailyCount, setDailyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quote, setQuote] = useState("");
  const [currentDateString, setCurrentDateString] = useState("");
  const [recentMissed, setRecentMissed] = useState([]);

  useEffect(() => {
    fetchData();
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    
    const updateDate = () => {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDateString(`${new Date().toLocaleDateString('en-US', options)}`);
    };
    updateDate();
    const interval = setInterval(updateDate, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, streakRes, historyRes, taskHistoryRes, missedRes] = await Promise.all([
        taskApi.getTasks(),
        taskApi.getStreak(),
        taskApi.getHistory(),
        taskApi.getHistoryPerTask(),
        taskApi.getRecentMissedTasks()
      ]);
      
      setTasks(tasksRes.data);
      setStreakInfo(streakRes.data);
      setHistory(historyRes.data.history);
      setHistoryPerTask(taskHistoryRes.data);
      setDailyCount(historyRes.data.dailyTasksCount);
      setRecentMissed(missedRes.data);
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const res = await taskApi.createTask(taskData);
      setTasks(prev => [...prev, { ...res.data, completed: false }]);
      toast.success("Task added successfully");
      
      if (taskData.type === 'daily') {
        setDailyCount(prev => prev + 1);
      }
    } catch (err) {
      toast.error("Failed to add task");
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      setTasks(prev => prev.map(t => t._id === id ? { ...t, completed: true, missed: false } : t));
      await taskApi.updateTaskStatus(id, { status: 'completed' });
      await refreshStats();
    } catch (err) {
      toast.error("Failed to update task");
      fetchData();
    }
  };

  const handleMissTask = async (id) => {
    const reason = window.prompt("Why couldn't you complete this task?");
    if (reason === null) return;
    try {
      setTasks(prev => prev.map(t => t._id === id ? { ...t, completed: false, missed: true, reason } : t));
      await taskApi.updateTaskStatus(id, { status: 'missed', reason });
      await refreshStats();
    } catch (err) {
      toast.error("Failed to update task");
      fetchData();
    }
  };

  const refreshStats = async () => {
    const [streakRes, historyRes, taskHistoryRes, missedRes] = await Promise.all([
      taskApi.getStreak(),
      taskApi.getHistory(),
      taskApi.getHistoryPerTask(),
      taskApi.getRecentMissedTasks()
    ]);
    setStreakInfo(streakRes.data);
    setHistory(historyRes.data.history);
    setHistoryPerTask(taskHistoryRes.data);
    setRecentMissed(missedRes.data);
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskApi.deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      setIsAuth(false);
      navigate('/');
    } catch (e) {
      toast.error("Logout failed");
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const globalHistory = [];
  const dateMap = {};
  Object.values(historyPerTask).forEach(taskHistory => {
     taskHistory.forEach(record => {
        if (!dateMap[record.date]) {
           dateMap[record.date] = { count: 0, completed: true, reason: [] };
        }
        if (record.completed) {
           dateMap[record.date].count += 1;
        } else {
           dateMap[record.date].completed = false;
           if(record.reason) dateMap[record.date].reason.push(record.reason);
        }
     });
  });
  Object.keys(dateMap).forEach(date => {
     globalHistory.push({
        date,
        count: dateMap[date].count,
        completed: dateMap[date].completed,
        reason: dateMap[date].reason.join(', ')
     });
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20 relative overflow-hidden font-sans">
      {/* Dynamic Background Blurs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[var(--bg-primary)]/70 backdrop-blur-xl border-b border-white/5 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <CheckCircle size={20} strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">TaskFlow</span>
          </div>
          
          <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-10">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
              className="text-blue-400 font-semibold mb-1 tracking-wide uppercase text-xs"
            >
              {currentDateString}
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-white tracking-tight"
            >
              Master Your Day.
            </motion.h1>
          </div>
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 justify-center"
          >
            <Plus size={20} strokeWidth={2.5} /> Add Task
          </motion.button>
        </div>

        {/* Global Stats */}
        <div className="mb-10">
          <StreakCard currentStreak={streakInfo.currentStreak} longestStreak={streakInfo.longestStreak} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Tasks Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Daily Focus
                </h2>
                <div className="text-sm font-semibold bg-[var(--bg-primary)] px-3 py-1 rounded-full border border-[var(--border)] text-gray-300">
                  {completedCount} / {totalCount} Done
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="bg-[var(--bg-primary)] h-3 w-full rounded-full mb-8 overflow-hidden shadow-inner border border-[var(--border)]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                />
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {tasks.length > 0 ? (
                    tasks.map(task => (
                      <TaskItem 
                        key={task._id} 
                        task={task} 
                        history={historyPerTask[task._id] || []}
                        onComplete={handleCompleteTask}
                        onMiss={handleMissTask}
                        onDelete={handleDeleteTask}
                      />
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="py-16 text-center bg-[var(--bg-primary)] border border-dashed border-[var(--border)] rounded-2xl flex flex-col items-center"
                    >
                      <CheckCircle className="text-gray-600 mb-4" size={48} strokeWidth={1} />
                      <p className="text-gray-400 font-medium mb-2">You have a clear slate.</p>
                      <button onClick={() => setIsModalOpen(true)} className="text-blue-500 hover:text-blue-400 font-bold transition-colors">
                        Create your first task →
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Global Yearly Heatmap */}
            <YearlyHeatmap history={globalHistory} />

            {/* Motivational Quote */}
            <div className="card bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border-l-4 border-l-blue-500">
              <Quote className="text-blue-500/40 mb-3" size={32} />
              <p className="text-lg text-gray-300 font-medium italic leading-relaxed">
                "{quote}"
              </p>
            </div>
            
            {/* Missed Tasks Reflection */}
            <div className="card border border-red-900/30">
              <div className="flex items-center gap-2 mb-4 text-red-400">
                <AlertCircle size={20} />
                <h3 className="font-bold text-lg tracking-tight">Failure Reflection</h3>
              </div>
              
              {recentMissed.length > 0 ? (
                <div className="space-y-4">
                  {recentMissed.map(miss => (
                    <div key={miss._id} className="text-sm bg-red-950/10 p-3 rounded-xl border border-red-900/20">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-gray-200">{miss.title}</p>
                        <span className="text-xs text-gray-500 font-semibold">{new Date(miss.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</span>
                      </div>
                      <p className="text-gray-400 italic">"{miss.reason}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-green-500/80 font-bold">Perfect record lately! 🚀</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTask} 
      />

    <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
      <img src={ganeshaImage} alt="Ganesha" style={{ width: "200px", height: "auto" }} />
      <img src={hanumanImage} alt="Hanuman" style={{ width: "200px", height: "auto" }} />
    </div>

    </div>
  );
}