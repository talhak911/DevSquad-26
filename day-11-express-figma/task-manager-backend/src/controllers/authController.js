const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper – generate signed JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

// Helper – build consistent auth response
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    },
    message,
  });
};

/**
 * @desc   Register a new user
 * @route  POST /api/users/register
 * @access Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        data: null,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res, "Account created successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Login user and return JWT
 * @route  POST /api/users/login
 * @access Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Need password field which is select:false by default
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Invalid email or password.",
      });
    }

    sendTokenResponse(user, 200, res, "Logged in successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get current logged-in user profile
 * @route  GET /api/users/me
 * @access Private
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          createdAt: req.user.createdAt,
        },
      },
      message: "User profile fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
