import React from 'react';
import { Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const StreakCard = ({ currentStreak, longestStreak }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex items-center justify-between overflow-hidden relative group hover:border-orange-500/50 transition-colors"
      >
        <div className="relative z-10">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Current Streak</p>
          <h2 className="text-5xl font-black mt-1 flex items-center gap-3 text-white">
            {currentStreak} <span className="text-3xl filter drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">🔥</span>
          </h2>
          <p className="text-sm text-gray-500 mt-3 font-medium">
            {currentStreak > 0 ? "You're doing great! Keep the fire burning." : "Start your streak today!"}
          </p>
        </div>
        <div className="opacity-[0.03] group-hover:opacity-[0.08] transition-opacity absolute -right-4 -bottom-4 z-0">
          <Flame size={160} className="text-orange-500" />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card flex items-center justify-between overflow-hidden relative group hover:border-yellow-500/50 transition-colors"
      >
        <div className="relative z-10">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Longest Streak</p>
          <h2 className="text-5xl font-black mt-1 flex items-center gap-3 text-white">
            {longestStreak} <Trophy className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" size={36} />
          </h2>
          <p className="text-sm text-gray-500 mt-3 font-medium">
            Your all-time best record!
          </p>
        </div>
        <div className="opacity-[0.03] group-hover:opacity-[0.08] transition-opacity absolute -right-4 -bottom-4 z-0">
          <Trophy size={160} className="text-yellow-500" />
        </div>
      </motion.div>
    </div>
  );
};

export default StreakCard;
