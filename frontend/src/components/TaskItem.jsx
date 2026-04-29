import React from 'react';
import { CheckCircle2, XCircle, Trash2, Calendar, Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const TaskItem = ({ task, history, onComplete, onMiss, onDelete }) => {

  const last30Days = [...Array(30)].map((_, i) => {
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3 }}
      className={clsx(
        "flex flex-col md:flex-row justify-between p-5 mb-4 rounded-2xl border shadow-lg transition-all",
        task.completed 
          ? "bg-green-900/20 border-green-700"
          : task.missed
          ? "bg-red-900/20 border-red-700"
          : "bg-gray-900 border-gray-700 hover:border-blue-500/50"
      )}
    >

      {/* LEFT */}
      <div className="flex gap-4 flex-1">

        {/* ACTIONS */}
        {!task.completed && !task.missed && (
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => onComplete(task._id)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-green-600 text-gray-300 hover:text-white transition"
            >
              <CheckCircle2 size={20}/>
            </button>

            <button 
              onClick={() => onMiss(task._id)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white transition"
            >
              <XCircle size={20}/>
            </button>
          </div>
        )}

        {(task.completed || task.missed) && (
          <div className={clsx(
            "p-3 rounded-full",
            task.completed ? "bg-green-600 text-white" : "bg-red-600 text-white"
          )}>
            {task.completed ? <CheckCircle2 size={22}/> : <XCircle size={22}/>}
          </div>
        )}

        {/* TEXT */}
        <div className="flex-1">

          {/* TITLE */}
          <h3 className={clsx(
            "text-lg font-semibold",
            task.completed || task.missed
              ? "line-through text-gray-500"
              : "text-white"
          )}>
            {task.title}
          </h3>

          {/* DESCRIPTION (FIXED VISIBILITY 🔥) */}
          {task.description && (
            <p className="text-sm text-gray-300 mt-1 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* MISSED REASON */}
          {task.missed && task.reason && (
            <div className="mt-2 text-xs text-red-300 bg-red-900/30 px-2 py-1 rounded-md inline-block">
              Reason: {task.reason}
            </div>
          )}

          {/* TAG + STATS */}
          <div className="flex flex-wrap items-center gap-3 mt-4">

            <span className={clsx(
              "text-xs px-2 py-1 rounded-md font-semibold",
              task.type === 'daily'
                ? "bg-blue-600 text-white"
                : "bg-purple-600 text-white"
            )}>
              {task.type}
            </span>

            {/* STREAK */}
            {task.streak && (
              <div className="flex items-center gap-4 text-xs bg-gray-800 px-3 py-1 rounded-lg">

                <span className="flex items-center gap-1 text-orange-400">
                  <Flame size={14}/> {task.streak.current}
                </span>

                <span className="flex items-center gap-1 text-yellow-400">
                  <Trophy size={14}/> {task.streak.longest}
                </span>

                <span className="flex items-center gap-1 text-blue-400">
                  <CheckCircle2 size={14}/> {task.streak.totalCompletions || 0}
                </span>

              </div>
            )}

            {/* DATE */}
            <span className="text-xs text-gray-400 ml-auto flex items-center gap-1">
              <Calendar size={12}/>
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* HEATMAP (FIXED VISIBILITY 🔥) */}
      <div className="flex gap-1 mt-4 md:mt-0 md:ml-4 p-2 bg-gray-800 rounded-lg overflow-x-auto">
        {last30Days.map((day, i) => (
          <div key={i} className="relative group">
            <div className={clsx(
              "w-3 h-3 rounded-sm",
              day.status === 'completed'
                ? "bg-green-500"
                : day.status === 'missed'
                ? "bg-red-500"
                : "bg-gray-700"
            )} />
          </div>
        ))}
      </div>

      {/* DELETE */}
      <button 
        onClick={() => onDelete(task._id)}
        className="absolute top-3 right-3 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
      >
        <Trash2 size={18}/>
      </button>

    </motion.div>
  );
};

export default TaskItem;