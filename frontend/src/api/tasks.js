import axios from "./axios";

export const getTasks = () => axios.get("/tasks");
export const createTask = (taskData) => axios.post("/tasks", taskData);
export const updateTask = (id, taskData) => axios.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => axios.delete(`/tasks/${id}`);
export const updateTaskStatus = (id, payload) => axios.post(`/tasks/${id}/status`, payload);
export const getHistory = () => axios.get("/tasks/history");
export const getHistoryPerTask = () => axios.get("/tasks/history-per-task");
export const getStreak = () => axios.get("/tasks/streak");
export const getTaskHistory = (id) => axios.get(`/tasks/${id}/history`);
export const getRecentMissedTasks = () => axios.get("/tasks/missed/recent");
