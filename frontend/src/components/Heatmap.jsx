import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { motion } from 'framer-motion';

const Heatmap = ({ history, dailyTasksCount }) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setMonth(today.getMonth() - 6); // Show last 6 months

  const values = history.map(item => ({
    date: item.date,
    count: item.count
  }));

  const getClass = (value) => {
    if (!value || value.count === 0) return 'color-empty';
    const percentage = (value.count / dailyTasksCount) * 100;
    if (percentage >= 100) return 'color-scale-4';
    if (percentage >= 75) return 'color-scale-3';
    if (percentage >= 50) return 'color-scale-2';
    return 'color-scale-1';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card mt-8"
    >
      <h3 className="text-xl font-bold mb-6">Consistency Graph</h3>
      <div className="heatmap-container">
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={values}
          classForValue={getClass}
          showWeekdayLabels={true}
          tooltipDataAttrs={value => {
            return {
              'data-tip': value.date ? `${value.date}: ${value.count} tasks` : 'No tasks',
            };
          }}
        />
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-[var(--text-secondary)]">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-[#ebedf0] dark:bg-[#161b22] rounded-sm"></div>
          <div className="w-3 h-3 bg-[#9be9a8] rounded-sm"></div>
          <div className="w-3 h-3 bg-[#40c463] rounded-sm"></div>
          <div className="w-3 h-3 bg-[#30a14e] rounded-sm"></div>
          <div className="w-3 h-3 bg-[#216e39] rounded-sm"></div>
        </div>
        <span>More</span>
      </div>
    </motion.div>
  );
};

export default Heatmap;
