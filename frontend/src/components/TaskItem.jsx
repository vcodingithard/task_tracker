import React, { useState } from 'react';
import { CheckCircle2, XCircle, Trash2, Calendar, Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const TaskItem = ({ task, history, onComplete, onMiss, onDelete }) => {

  const today = new Date().toLocaleDateString("en-CA");
  const [selectedDate, setSelectedDate] = useState(today);

  // ✅ Generate last 30 days
  const last30Days = [...Array(30)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const dateStr = d.toLocaleDateString("en-CA");
    const record = history.find(h => h.date === dateStr);

    return {
      date: dateStr,
      status: record
        ? (record.completed ? 'completed' : 'missed')
        : 'none'
    };
  }).reverse();

  const selectedDay = last30Days.find(d => d.date === selectedDate);

  return (
    <motion.div
      layout
      className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg"
    >

      {/* TOP SECTION */}
      <div className="flex justify-between gap-6 flex-col lg:flex-row">

        {/* LEFT */}
        <div className="flex gap-4 flex-1">

          {/* ACTIONS */}
          {!task.completed && !task.missed && (
            <div className="flex flex-col gap-2">
              <button onClick={() => onComplete(task._id)} className="p-2 rounded-lg bg-gray-800 hover:bg-green-600">
                <CheckCircle2 size={20}/>
              </button>
              <button onClick={() => onMiss(task._id)} className="p-2 rounded-lg bg-gray-800 hover:bg-red-600">
                <XCircle size={20}/>
              </button>
            </div>
          )}

          {/* TEXT */}
          <div className="flex-1">

            <h3 className="text-xl font-bold text-white">{task.title}</h3>

            {task.description && (
              <p className="text-gray-400 mt-1">{task.description}</p>
            )}

            {/* STATS */}
            <div className="flex flex-wrap items-center gap-3 mt-4">

              <span className="text-xs px-2 py-1 rounded-md bg-blue-600 text-white">
                {task.type}
              </span>

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

              <span className="text-xs text-gray-400 ml-auto flex items-center gap-1">
                <Calendar size={12}/>
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* ✅ CENTER INFO PANEL */}
            <div className="mt-4">
              <div className="bg-gray-800 px-4 py-2 rounded-lg text-center w-fit">
                <div className="text-sm text-white font-semibold">
                  {selectedDay?.status === 'completed'
                    ? "Completed ✅"
                    : selectedDay?.status === 'missed'
                    ? "Missed ❌"
                    : "No activity"}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT → FULL HEATMAP */}
        <div className="w-full lg:w-[55%]">

          <div className="grid grid-cols-10 gap-2 bg-gray-800 p-4 rounded-xl">

            {last30Days.map((day, i) => {
              const isToday = day.date === today;
              const isSelected = day.date === selectedDate;

              return (
                <div
                  key={i}
                  onClick={() => setSelectedDate(day.date)}
                  className={clsx(
                    "w-full aspect-square rounded-md cursor-pointer transition-all",
                    day.status === 'completed'
                      ? "bg-green-500"
                      : day.status === 'missed'
                      ? "bg-red-500"
                      : "bg-gray-700",
                    isToday && "ring-2 ring-yellow-400",
                    isSelected && "scale-110 ring-2 ring-white"
                  )}
                />
              );
            })}

          </div>

        </div>

      </div>

      {/* DELETE */}
      <button 
        onClick={() => onDelete(task._id)}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
      >
        <Trash2 size={18}/>
      </button>

    </motion.div>
  );
};

export default TaskItem;