import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.log("❌ No token received");
    return res.status(401).json({ message: "Not authorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    console.log("❌ Token invalid:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default protect;