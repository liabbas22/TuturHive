import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    // ✅ Get token from cookies or Authorization header (for flexibility)
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1] || // supports "Bearer <token>"
      null;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - Token missing" });
    }

    // ✅ Verify token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not found in environment variables!");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const payload = jwt.verify(token, secret);

    // ✅ Attach user info to request
    req.user = {
      id: payload.id,
      role: payload.role,
      email: payload.email,
    };

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
