const rateLimit = require('express-rate-limit');

const general = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const auth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.'
  },
  skipSuccessfulRequests: true
});

const ai = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: parseInt(process.env.AI_RATE_LIMIT_MAX) || 20,
  message: {
    success: false,
    message: 'Too many AI requests, please slow down.'
  }
});

const passwordReset = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: 'Too many password reset requests, please try again after an hour.'
  }
});

module.exports = { general, auth, ai, passwordReset };
