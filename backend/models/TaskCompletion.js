import mongoose from "mongoose";

const taskCompletionSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: String, // Store as YYYY-MM-DD
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  },
  reason: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("TaskCompletion", taskCompletionSchema);
