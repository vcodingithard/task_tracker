import React from 'react';
import { CheckCircle2, Circle, XCircle, Trash2, Calendar, Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const TaskItem = ({ task, history, onComplete, onMiss, onDelete }) => {
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const record = history.find(h => h.date === dateStr);
    return {
      date: dateStr,
      status: record ? (record.completed ? 'completed' : 'missed') : 'none'
    };
  }).reverse();

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={clsx(
        "flex items-center justify-between p-4 mb-3 rounded-xl border transition-all group",
        task.completed 
          ? "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30" 
          : task.missed
          ? "bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30"
          : "bg-[var(--bg-secondary)] border-gray-200 dark:border-gray-800"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        {!task.completed && !task.missed && (
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => onComplete(task._id)}
              title="Mark as Completed"
              className="text-gray-400 hover:text-green-500 transition-colors"
            >
              <CheckCircle2 size={24} />
            </button>
            <button 
              onClick={() => onMiss(task._id)}
              title="Mark as Missed"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>
        )}
        
        {(task.completed || task.missed) && (
          <div className={task.completed ? "text-green-500" : "text-red-500"}>
            {task.completed ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className={clsx(
                "font-semibold text-lg transition-all",
                (task.completed || task.missed) && "line-through text-[var(--text-secondary)] opacity-60"
              )}>
                {task.title}
              </h3>
              {task.missed && task.reason && (
                <span className="text-xs text-red-500 font-medium mt-1">Failed: {task.reason}</span>
              )}
            </div>
            
            {/* Mini Consistency Graph */}
            <div className="flex gap-1 ml-4">
              {last7Days.map((day, i) => (
                <div 
                  key={i}
                  className={clsx(
                    "w-2 h-2 rounded-[2px] transition-all",
                    day.status === 'completed'
                      ? "bg-green-500 shadow-sm shadow-green-500/20" 
                      : day.status === 'missed'
                      ? "bg-red-500 shadow-sm shadow-red-500/20"
                      : "bg-gray-200 dark:bg-gray-800"
                  )}
                  title={`${day.date} - ${day.status}`}
                />
              ))}
            </div>
          </div>
          {task.description && (
            <p className="text-sm text-[var(--text-secondary)] mt-0.5 line-clamp-1">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3">
            <span className={clsx(
              "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
              task.type === 'daily' 
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            )}>
              {task.type}
            </span>
            {task.streak && (
              <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1 font-medium" title="Current Streak"><Flame size={14} className="text-orange-500"/> {task.streak.current}</span>
                <span className="flex items-center gap-1 font-medium" title="Longest Streak"><Trophy size={14} className="text-yellow-500"/> {task.streak.longest}</span>
                <span className="flex items-center gap-1 font-medium" title="Total Completions"><CheckCircle2 size={14} className="text-blue-500"/> {task.streak.totalCompletions || 0}</span>
              </div>
            )}
            <span className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1 ml-auto">
              <Calendar size={10} /> {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => onDelete(task._id)}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 md:opacity-100 ml-2"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
};

export default TaskItem;
