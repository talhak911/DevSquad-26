const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      data: null,
      message: "Not authorized. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Not authorized. User no longer exists.",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: null,
      message: "Not authorized. Token is invalid or expired.",
    });
  }
};

module.exports = { protect };
