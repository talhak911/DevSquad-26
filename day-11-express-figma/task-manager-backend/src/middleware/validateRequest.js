const { validationResult } = require("express-validator");

/**
 * Middleware that checks express-validator results.
 * If there are errors it responds immediately with 422 and a list of messages.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      data: null,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { validateRequest };
