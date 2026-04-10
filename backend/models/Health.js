import mongoose from "mongoose";

const healthSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  sleep: Number,      
  appetite: Number,   
  stress: Number,     
  activity: Number,   
  score: Number,
  recommendation: String
}, { timestamps: true });

export default mongoose.model("Health", healthSchema);