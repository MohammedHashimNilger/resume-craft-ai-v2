import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Protects routes that require authentication. Reads the JWT from the
 * httpOnly cookie set at login, verifies it, and attaches the user
 * (without password) to req.user for downstream handlers.
 */
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};
