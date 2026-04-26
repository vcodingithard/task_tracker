import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ["daily", "one-time"],
    default: "one-time"
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    totalCompletions: { type: Number, default: 0 },
    lastCompletedDate: { type: String, default: null }
  }
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
