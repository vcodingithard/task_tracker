import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS (React frontend)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://healthcare-black-iota.vercel.app" 
  ],
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API Running 🚀" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});