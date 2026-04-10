import Health from "../models/Health.js";
import { healthRecommendations } from "../data/recommendations.js";

// CREATE HEALTH ENTRY
export const createHealth = async (req, res) => {
  try {
    const { sleep, appetite, stress, activity } = req.body;

    // Logic for scoring (remains the same)
    const score = sleep + appetite + activity - stress;

    let category = "";

    // Map score to category keys in our data file
    if (score >= 12) {
      category = "excellent";
    } else if (score >= 8) {
      category = "good";
    } else if (score >= 5) {
      category = "moderate";
    } else {
      category = "poor";
    }

    // Pick the array for that category
    const options = healthRecommendations[category];
    
    // Select one of the 5 paragraphs at random
    const randomIndex = Math.floor(Math.random() * options.length);
    const recommendation = options[randomIndex];

    const health = await Health.create({
      user: req.user, // Assuming req.user comes from your auth middleware
      sleep,
      appetite,
      stress,
      activity,
      score,
      recommendation
    });

    res.status(201).json(health);

  } catch (err) {
    console.error("Error creating health data:", err);
    res.status(500).json({ message: "Error creating health data" });
  }
};


// GET ALL HISTORY
export const getHealthHistory = async (req, res) => {
  try {
    // Find history for the specific logged-in user
    const data = await Health.find({ user: req.user }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

// GET SINGLE HEALTH ENTRY
export const getSingleHealth = async (req, res) => {
  try {
    const { id } = req.params;

    const health = await Health.findById(id);

    // ❌ Not found
    if (!health) {
      return res.status(404).json({ message: "Health record not found" });
    }

    // ❌ Security check (IMPORTANT)
    if (health.user.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(health);

  } catch (err) {
    console.error("Error fetching single health:", err);
    res.status(500).json({ message: "Error fetching health data" });
  }
};