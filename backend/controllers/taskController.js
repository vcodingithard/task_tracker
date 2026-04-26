import Task from "../models/Task.js";
import TaskCompletion from "../models/TaskCompletion.js";
import User from "../models/User.js";
import mongoose from "mongoose";

import { getTodayDate, getYesterdayDate } from "../utils/dateUtils.js";

// @desc    Create a new task
// @route   POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const task = await Task.create({
      user: req.user,
      title,
      description,
      type
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all tasks for today
// @route   GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const today = getTodayDate();
    const tasks = await Task.find({ user: req.user });
    
    // Find completions for today
    const completions = await TaskCompletion.find({
      user: req.user,
      date: today
    });

    const completionMap = completions.reduce((acc, curr) => {
      acc[curr.task.toString()] = curr;
      return acc;
    }, {});

    const tasksWithStatus = tasks.map(task => {
      const completion = completionMap[task._id.toString()];
      return {
        ...task._doc,
        completed: completion?.completed || false,
        missed: completion && !completion.completed ? true : false,
        reason: completion?.reason || ""
      };
    });

    res.json(tasksWithStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!task) return res.status(404).json({ message: "Task not found" });
    
    // Also delete completions
    await TaskCompletion.deleteMany({ task: req.params.id });
    
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update task status (completed or missed)
// @route   POST /api/tasks/:id/status
export const updateTaskStatus = async (req, res) => {
  try {
    const today = getTodayDate();
    const yesterday = getYesterdayDate();
    const taskId = req.params.id;
    const userId = req.user;
    const { status, reason } = req.body; // status: 'completed' | 'missed'

    const isCompleted = status === 'completed';

    const existingCompletion = await TaskCompletion.findOne({
      task: taskId,
      user: userId,
      date: today
    });

    let previousCompleted = false;

    if (existingCompletion) {
      previousCompleted = existingCompletion.completed;
      existingCompletion.completed = isCompleted;
      existingCompletion.reason = isCompleted ? "" : (reason || "");
      await existingCompletion.save();
    } else {
      await TaskCompletion.create({
        task: taskId,
        user: userId,
        date: today,
        completed: isCompleted,
        reason: isCompleted ? "" : (reason || "")
      });
    }

    // Update Task level streak
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (task) {
      if (isCompleted && !previousCompleted) {
        task.streak.totalCompletions = (task.streak.totalCompletions || 0) + 1;
      } else if (!isCompleted && previousCompleted) {
        task.streak.totalCompletions = Math.max(0, (task.streak.totalCompletions || 0) - 1);
      }

      if (isCompleted) {
        if (task.streak.lastCompletedDate === yesterday) {
          task.streak.current += 1;
        } else if (task.streak.lastCompletedDate !== today) {
          task.streak.current = 1;
        }
        if (task.streak.current > task.streak.longest) {
          task.streak.longest = task.streak.current;
        }
        task.streak.lastCompletedDate = today;
      } else {
        // Explicitly missed, break streak
        if (task.streak.lastCompletedDate === today) {
          // Revert: set current to 0, break streak
          task.streak.current = 0;
          task.streak.lastCompletedDate = null;
        } else {
          task.streak.current = 0;
        }
      }
      await task.save();
    }

    // Update global User Streak Logic
    await updateStreak(userId);

    res.json({ message: "Task status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStreak = async (userId) => {
  const today = getTodayDate();
  const yesterday = getYesterdayDate();
  
  // Get all daily tasks
  const dailyTasks = await Task.find({ user: userId, type: "daily" });
  if (dailyTasks.length === 0) return;

  // Get completions for today
  const todayCompletions = await TaskCompletion.find({
    user: userId,
    date: today,
    completed: true,
    task: { $in: dailyTasks.map(t => t._id) }
  });

  const user = await User.findById(userId);
  const allCompletedToday = todayCompletions.length === dailyTasks.length;

  if (allCompletedToday) {
    if (user.lastCompletedDate === yesterday) {
      user.currentStreak += 1;
    } else if (user.lastCompletedDate !== today) {
      user.currentStreak = 1;
    }
    
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }
    user.lastCompletedDate = today;
  } else {
    // If they unchecked a task today and it was previously completed
    if (user.lastCompletedDate === today) {
      // Revert to yesterday's state
      // We don't know the exact streak yesterday, but we can assume currentStreak - 1
      user.currentStreak = Math.max(0, user.currentStreak - 1);
      user.lastCompletedDate = yesterday; // This is a bit of a guess but works for most cases
    }
  }

  await user.save();
};

// @desc    Get completion history for heatmap
// @route   GET /api/tasks/history
export const getHistory = async (req, res) => {
  try {
    const completions = await TaskCompletion.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user), completed: true } },
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 }
        }
      },
      { $project: { date: "$_id", count: 1, _id: 0 } }
    ]);

    // Also need total daily tasks count to calculate percentage
    const dailyTasksCount = await Task.countDocuments({ user: req.user, type: "daily" });

    res.json({ history: completions, dailyTasksCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get streak info
// @route   GET /api/tasks/streak
export const getStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("currentStreak longestStreak lastCompletedDate");
    const today = getTodayDate();
    const yesterday = getYesterdayDate();

    let displayStreak = user.currentStreak;
    
    // If the last completion was before yesterday, the streak is broken
    if (user.lastCompletedDate !== today && user.lastCompletedDate !== yesterday) {
      displayStreak = 0;
      if (user.currentStreak !== 0) {
        user.currentStreak = 0;
        await user.save();
      }
    }

    res.json({
      currentStreak: displayStreak,
      longestStreak: user.longestStreak,
      lastCompletedDate: user.lastCompletedDate
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get completion history for each task
// @route   GET /api/tasks/history-per-task
export const getHistoryPerTask = async (req, res) => {
  try {
    const history = await TaskCompletion.find({ user: req.user })
      .select("task date completed -_id")
      .lean();

    const historyMap = history.reduce((acc, curr) => {
      const taskId = curr.task.toString();
      if (!acc[taskId]) acc[taskId] = [];
      acc[taskId].push({ date: curr.date, completed: curr.completed });
      return acc;
    }, {});

    res.json(historyMap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get full history for a specific task
// @route   GET /api/tasks/:id/history
export const getTaskHistory = async (req, res) => {
  try {
    const history = await TaskCompletion.find({ 
      user: req.user, 
      task: req.params.id 
    }).sort({ date: 1 }).lean();
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get recent missed tasks with reasons
// @route   GET /api/tasks/missed/recent
export const getRecentMissedTasks = async (req, res) => {
  try {
    const missed = await TaskCompletion.find({
      user: req.user,
      completed: false,
      reason: { $ne: "" }
    })
    .sort({ date: -1 })
    .limit(7)
    .populate('task', 'title')
    .lean();
    
    // Process to return only necessary info
    const formatted = missed.map(m => ({
      _id: m._id,
      date: m.date,
      title: m.task ? m.task.title : 'Deleted Task',
      reason: m.reason
    }));
    
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
