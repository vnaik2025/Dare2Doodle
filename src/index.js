// index.js
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Middlewares / routes you already have
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');
const challengeRoutes = require('./routes/challenge.routes');
const commentRoutes = require('./routes/comment.routes');
const likesRoutes = require('./routes/likes.routes');
const bookmarksRoutes = require('./routes/bookmarks.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const reportsRoutes = require('./routes/reports.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ───────────────────────────────────────────────────────────────────────────────
// Trust proxy (needed behind load balancers / reverse proxies in prod)
if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Hide X-Powered-By
app.disable('x-powered-by');

// Security headers
app.use(helmet());

// Body parser with size limit
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));

// Logging
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS setup
const devDefaultOrigins = [
  'http://localhost:5173',
  'http://192.168.1.8:5173',
  'http://localhost:4200',
];

const envOrigins =
  (process.env.CORS_ORIGINS &&
    process.env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)) ||
  (process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []);

const allowedOrigins =
  NODE_ENV === 'production' ? envOrigins : [...devDefaultOrigins, ...envOrigins];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients with no Origin header (e.g., curl/Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true, // allow cookies if you ever switch JWT to cookies
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 86400,
  })
);

// Rate limiting
app.use(
  rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS
      ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10)
      : 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX
      ? parseInt(process.env.RATE_LIMIT_MAX, 10)
      : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  })
);

// Tighter auth limiter for login/signup endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.AUTH_RATE_LIMIT_MAX
    ? parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10)
    : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth requests, please try again later.' },
});

// Health check (for uptime monitors / load balancers)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', env: NODE_ENV, time: new Date().toISOString() });
});

// ───────────────────────────────────────────────────────────────────────────────
// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/users', userRoutes);

// 404 handler (after routes)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Central error handler
app.use((err, req, res, next) => {
  if (NODE_ENV !== 'production') {
    return errorHandler(err, req, res, next);
  }
  const status = err.status || 500;
  return res.status(status).json({ error: err.message || 'Internal Server Error' });
});

// ───────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
