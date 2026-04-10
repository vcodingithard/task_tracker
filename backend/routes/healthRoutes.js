import express from "express";
import { createHealth, getHealthHistory ,getSingleHealth} from "../controllers/healthController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/", protect, createHealth);
router.get("/", protect, getHealthHistory);
router.get("/:id", protect, getSingleHealth);
export default router;