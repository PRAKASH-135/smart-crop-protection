const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization header

    if (!authHeader) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    // Expected format:
    // Authorization: Bearer TOKEN

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Invalid authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Authentication token missing",
      });
    }

    // Verify JWT

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Make user information available
    // to the route

    req.user = decoded;

    next();

  } catch (error) {

    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;