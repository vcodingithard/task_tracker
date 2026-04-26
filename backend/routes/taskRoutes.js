import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getHistory,
  getStreak,
  getHistoryPerTask,
  getTaskHistory,
  getRecentMissedTasks
} from "../controllers/taskController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createTask)
  .get(getTasks);

router.route("/:id")
  .put(updateTask)
  .delete(deleteTask);

router.post("/:id/status", updateTaskStatus);
router.get("/history", getHistory);
router.get("/history-per-task", getHistoryPerTask);
router.get("/missed/recent", getRecentMissedTasks);
router.get("/streak", getStreak);
router.get("/:id/history", getTaskHistory);

export default router;
