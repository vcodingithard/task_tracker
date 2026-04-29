import React, { useState, useMemo, useRef } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

// ✅ FIXED COLORS (clear visibility)
const getIntensityClass = (count) => {
  if (count === 0) return "bg-gray-800";
  if (count < 2) return "bg-green-500/40";
  if (count < 4) return "bg-green-500/60";
  if (count < 6) return "bg-green-500/80";
  return "bg-green-500";
};

const YearlyHeatmap = ({ history }) => {
  const containerRef = useRef(null);
  const [year, setYear] = useState(new Date().getFullYear());

  // ✅ Available years
  const availableYears = useMemo(() => {
    if (!history || history.length === 0) return [new Date().getFullYear()];
    const years = Array.from(
      new Set(history.map((item) => new Date(item.date).getFullYear()))
    );
    return years.sort((a, b) => b - a);
  }, [history]);

  // ✅ Filter by year
  const filteredHistory = useMemo(() => {
    return history?.filter(
      (item) => new Date(item.date).getFullYear() === year
    ) || [];
  }, [history, year]);

  // ✅ Map for fast lookup
  const historyMap = useMemo(() => {
    const map = {};
    filteredHistory.forEach((item) => {
      map[item.date] = item;
    });
    return map;
  }, [filteredHistory]);

  // ✅ Generate all days of year
  const days = useMemo(() => {
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31`);
    const d = [];
    while (start <= end) {
      d.push(start.toISOString().split("T")[0]);
      start.setDate(start.getDate() + 1);
    }
    return d;
  }, [year]);

  // ✅ Convert into weeks (GitHub style)
  const weeks = useMemo(() => {
    const w = [];
    let currentWeek = [];

    const firstDayOffset = new Date(days[0]).getDay();
    for (let i = 0; i < firstDayOffset; i++) currentWeek.push(null);

    days.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        w.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      w.push(currentWeek);
    }

    return w;
  }, [days]);

  // ✅ Drag scroll
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const onMouseLeave = () => (isDragging.current = false);
  const onMouseUp = () => (isDragging.current = false);

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // ✅ Total count
  const totalCompletions = useMemo(() => {
    return filteredHistory.reduce((sum, h) => sum + (h.count || 0), 0);
  }, [filteredHistory]);

  return (
    <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">
            Activity Overview
          </h2>

          {/* ✅ FIXED TEXT */}
          <p className="text-sm text-gray-400 mt-1">
            {totalCompletions === 0
              ? "No tasks completed this year"
              : `${totalCompletions} tasks completed in ${year}`}
          </p>
        </div>

        {/* YEAR SELECT */}
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg border border-gray-700 outline-none hover:border-blue-500 transition"
        >
          {availableYears.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* HEATMAP */}
      <div
        ref={containerRef}
        className="overflow-x-auto cursor-grab active:cursor-grabbing pb-4"
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <div className="flex gap-1 w-max pt-4">
          {weeks.map((week, wIdx) => (
            <motion.div
              key={wIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: wIdx * 0.01 }}
              className="flex flex-col gap-1"
            >
              {week.map((day, dIdx) => {
                if (!day)
                  return <div key={dIdx} className="w-[14px] h-[14px]" />;

                const record = historyMap[day];
                const count = record?.count || 0;

                return (
                  <div key={day} className="relative group">
                    <div
                      className={clsx(
                        "w-[14px] h-[14px] rounded-[3px] transition-all",
                        getIntensityClass(count),
                        "hover:ring-2 ring-white/30"
                      )}
                    />

                    {/* ✅ FIXED TOOLTIP */}
                    <div className="absolute z-50 hidden group-hover:block bg-gray-800 text-xs text-white px-3 py-2 rounded-md shadow-lg -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      
                      {count === 0 ? (
                        <span className="text-gray-300">
                          No tasks completed
                        </span>
                      ) : (
                        <span className="font-semibold">
                          {count} task{count > 1 ? "s" : ""} completed
                        </span>
                      )}

                      <div className="text-[10px] text-gray-400 mt-1">
                        {new Date(day).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-400">
        <span>Less</span>
        <div className="w-[14px] h-[14px] bg-gray-800 rounded-sm" />
        <div className="w-[14px] h-[14px] bg-green-500/40 rounded-sm" />
        <div className="w-[14px] h-[14px] bg-green-500/60 rounded-sm" />
        <div className="w-[14px] h-[14px] bg-green-500/80 rounded-sm" />
        <div className="w-[14px] h-[14px] bg-green-500 rounded-sm" />
        <span>More</span>
      </div>

    </div>
  );
};

export default YearlyHeatmap;