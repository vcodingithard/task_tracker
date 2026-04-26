import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('one-time');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, description, type });
    setTitle('');
    setDescription('');
    setType('one-time');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[var(--bg-primary)] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold">Add New Task</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 opacity-70">Task Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--bg-secondary)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="What needs to be done?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 opacity-70">Description (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[var(--bg-secondary)] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                  placeholder="Add some details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 opacity-70">Task Type</label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setType('one-time')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${type === 'one-time' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-[var(--bg-secondary)] opacity-60'}`}
                  >
                    One-time
                  </button>
                  <button 
                    type="button"
                    onClick={() => setType('daily')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${type === 'daily' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-[var(--bg-secondary)] opacity-60'}`}
                  >
                    Daily
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-6 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Create Task
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddTaskModal;
