import React from 'react';
import { Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const StreakCard = ({ currentStreak, longestStreak }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex items-center justify-between overflow-hidden relative"
      >
        <div>
          <p className="text-[var(--text-secondary)] text-sm font-medium uppercase tracking-wider">Current Streak</p>
          <h2 className="text-4xl font-bold mt-1 flex items-center gap-2">
            {currentStreak} <span className="text-2xl text-[var(--streak-fire)]">🔥</span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            {currentStreak > 0 ? "You're doing great! Keep it up." : "Start your streak today!"}
          </p>
        </div>
        <div className="opacity-10 absolute -right-4 -bottom-4">
          <Flame size={120} className="text-[var(--streak-fire)]" />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card flex items-center justify-between overflow-hidden relative"
      >
        <div>
          <p className="text-[var(--text-secondary)] text-sm font-medium uppercase tracking-wider">Longest Streak</p>
          <h2 className="text-4xl font-bold mt-1 flex items-center gap-2">
            {longestStreak} <Trophy className="text-yellow-500" size={32} />
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            Your all-time best record!
          </p>
        </div>
        <div className="opacity-10 absolute -right-4 -bottom-4">
          <Trophy size={120} className="text-yellow-500" />
        </div>
      </motion.div>
    </div>
  );
};

export default StreakCard;
