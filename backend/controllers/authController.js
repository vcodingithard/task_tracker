import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// Signup
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("Signup request:", req.body);

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = generateToken(user._id);

    console.log("Generated Token:", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        
      sameSite: "None"     
    });

    console.log("Cookie sent (Signup)");

    res.status(201).json({
      message: "User registered",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Signup error" });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login request:", req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    console.log("Generated Token:", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        
      sameSite: "None"     
    });

    console.log("Cookie sent (Login)");

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login error" });
  }
};

// Logout
export const logout = (req, res) => {
  console.log("Logout called");

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });

  res.json({ message: "Logged out" });
};