import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle, Loader2, Plus, LayoutDashboard, Settings } from 'lucide-react';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';

import * as taskApi from '../api/tasks';
import API from "../api/axios";

import StreakCard from './StreakCard';
import TaskItem from './TaskItem';
import YearlyHeatmap from './YearlyHeatmap';
import AddTaskModal from './AddTaskModal';

const QUOTES = [
  "Consistency beats motivation.",
  "Do it even when you don't feel like it.",
  "No excuses. Just results.",
  "Make your parents proud.",
  "Your future is watching you.",
  "Discipline = Freedom.",
  "Small steps daily = big results.",
  "Pain is temporary. Quitting lasts forever.",
  "Don't stop when you're tired. Stop when you're done.",
  "Focus on the process, the results will follow.",
  "The only bad workout is the one that didn't happen.",
  "Embrace the struggle. It's forging your strength."
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
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDateString(`Today: ${new Date().toLocaleDateString('en-US', options)}`);
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
      
      // Update daily count if needed
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
           dateMap[record.date] = { completed: true, reason: [] };
        }
        if (!record.completed) {
           dateMap[record.date].completed = false;
           if(record.reason) dateMap[record.date].reason.push(record.reason);
        }
     });
  });
  Object.keys(dateMap).forEach(date => {
     globalHistory.push({
        date,
        completed: dateMap[date].completed,
        reason: dateMap[date].reason.join(', ')
     });
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] relative">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20 relative overflow-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <CheckCircle size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">TaskFlow</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-8">
        {/* HUGE INSPIRATION BANNER */}
        <div className="w-full bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 border border-orange-200/50 dark:border-orange-900/50 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-lg">
           <div className="flex gap-4 shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white dark:bg-gray-800 p-2 shadow-xl border-4 border-orange-400 flex items-center justify-center">
                <img src="/ganesha.png" alt="Lord Hanuman" className="w-full h-full object-contain rounded-full" />
              </div>
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white dark:bg-gray-800 p-2 shadow-xl border-4 border-orange-400 flex items-center justify-center">
                <img src="/hanuman.png" alt="Lord Ganesha" className="w-full h-full object-contain rounded-full" />
              </div>
           </div>
           <div>
              <h2 className="text-2xl md:text-3xl font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">Strength & Wisdom</h2>
              <p className="text-lg md:text-xl text-[var(--text-primary)] font-medium italic">"{quote}"</p>
              <p className="text-sm md:text-base text-[var(--text-secondary)] mt-2 font-bold">Conquer your day with unbreakable discipline.</p>
           </div>
        </div>

        {/* Regular Welcome Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-blue-500 font-medium mb-1">{currentDateString}</p>
            <h1 className="text-3xl font-black">Welcome back!</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 justify-center"
          >
            <Plus size={20} /> Add New Task
          </button>
        </div>

        {/* Streak Stats */}
        <StreakCard 
          currentStreak={streakInfo.currentStreak} 
          longestStreak={streakInfo.longestStreak} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Tasks */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Today's Tasks <span className="text-sm font-normal text-[var(--text-secondary)]">({completedCount}/{totalCount})</span>
              </h2>
            </div>
            
            {/* Progress Bar */}
            <div className="bg-[var(--bg-secondary)] h-2 w-full rounded-full mb-6 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-blue-600 h-full rounded-full"
              />
            </div>

            <div className="space-y-1">
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center card bg-transparent border-dashed flex flex-col items-center"
                  >
                    <p className="text-[var(--text-secondary)] mb-4">No tasks for today. Add one to get started!</p>
                    <p className="text-sm font-medium text-blue-500 italic">"{quote}"</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar / Heatmap */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div className="card">
              <h3 className="font-bold text-lg mb-2">Yearly Consistency</h3>
              <YearlyHeatmap history={globalHistory} />
            </div>
            
            {/* Failure Reflection */}
            <div className="card bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30">
              <h3 className="font-bold text-lg text-red-600 dark:text-red-400 mb-4">Failure Reflection</h3>
              {recentMissed.length > 0 ? (
                <div className="space-y-3">
                  {recentMissed.map(miss => (
                    <div key={miss._id} className="text-sm border-l-2 border-red-400 pl-3">
                      <p className="font-semibold">{miss.title} <span className="text-xs text-gray-500 font-normal ml-2">{new Date(miss.date).toLocaleDateString()}</span></p>
                      <p className="text-gray-600 dark:text-gray-400 italic">"{miss.reason}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-secondary)]">No recent failures. Keep the streak alive! 🔥</p>
              )}
            </div>

            <div className="card bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-xl shadow-blue-500/20 text-center py-8 relative overflow-hidden">
              <h3 className="font-bold text-xl mb-4 text-blue-100">Daily Discipline</h3>
              <p className="text-lg italic leading-relaxed">
                "{quote}"
              </p>
              <p className="text-sm mt-6 text-blue-200 font-medium uppercase tracking-widest">Strength • Wisdom • Focus</p>
            </div>
          </div>
        </div>
      </main>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTask} 
      />
    </div>
  );
}