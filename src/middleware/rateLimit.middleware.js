const rateLimit = require('express-rate-limit');

const writeLimiter = rateLimit({
  windowMs: 60000, // 1 min
  max: 60, // General writes
  message: 'Rate limit exceeded'
});

const reportLimiter = rateLimit({
  windowMs: 60000,
  max: 10, // Stricter for reports
  message: 'Rate limit exceeded for reports'
});

module.exports = { writeLimiter, reportLimiter };