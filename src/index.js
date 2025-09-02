// const express = require('express');
// const dotenv = require('dotenv');
// require('dotenv').config();
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const errorHandler = require('./middleware/errorHandler');
// const authRoutes = require('./routes/auth.routes');
// const challengeRoutes = require('./routes/challenge.routes');
// const commentRoutes = require('./routes/comment.routes');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(helmet()); // Security headers
// app.use(cors({ origin: 'http://localhost:4200' })); // Allow Angular frontend
// app.use(morgan('dev')); // Logging
// app.use(express.json()); // JSON parsing

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/challenges', challengeRoutes);
// app.use('/api/comments', commentRoutes);

// // Error handling
// app.use(errorHandler);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






// const express = require('express');
// const dotenv = require('dotenv');
// require('dotenv').config();
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');

// const errorHandler = require('./middleware/errorHandler');
// const authMiddleware = require('./middleware/authMiddleware');
// const validationMiddleware = require('./middleware/validation.middleware'); // New

// // Routes
// const authRoutes = require('./routes/auth.routes');
// const challengeRoutes = require('./routes/challenge.routes');
// const commentRoutes = require('./routes/comment.routes');
// const likesRoutes = require('./routes/likes.routes');           // New
// const bookmarksRoutes = require('./routes/bookmarks.routes');   // New
// const notificationsRoutes = require('./routes/notifications.routes'); // New
// const reportsRoutes = require('./routes/reports.routes');       // New

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(helmet()); // Security headers
// app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' })); // Allow Angular frontend
// app.use(morgan('dev')); // Logging
// app.use(express.json()); // JSON parsing

// // Rate limiting (global, can also be applied per-route)
// const limiter = rateLimit({
//   windowMs: process.env.RATE_LIMIT_WINDOW_MS
//     ? parseInt(process.env.RATE_LIMIT_WINDOW_MS)
//     : 15 * 60 * 1000, // default 15 min
//   max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : 100, // default 100 reqs
//   message: 'Too many requests, please try again later.'
// });
// app.use(limiter);

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/challenges', challengeRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/likes', likesRoutes);
// app.use('/api/bookmarks', bookmarksRoutes);
// app.use('/api/notifications', notificationsRoutes);
// app.use('/api/reports', reportsRoutes);

// // Error handling
// app.use(errorHandler);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






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
const userRoutes= require('./routes/user.routes')

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

// CORS
// - In dev: allow localhost:4200 by default
// - In prod: read from CORS_ORIGIN (single origin) or CORS_ORIGINS (comma-separated)
const devDefaultOrigin = 'http://localhost:5173';
const envOrigins =
  (process.env.CORS_ORIGINS && process.env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)) ||
  (process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []);

const allowedOrigins = NODE_ENV === 'production' ? envOrigins : [devDefaultOrigin, ...envOrigins];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients with no Origin header (e.g., curl/Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) return callback(null, true); // fallback (not recommended for prod)
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: false, // set to true only if you move JWT to cookies
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 86400,
  })
);

// Rate limiting
// Global limiter
app.use(
  rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) : 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  })
);

// Tighter auth limiter for login/signup endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.AUTH_RATE_LIMIT_MAX ? parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) : 20, // e.g., 20 tries / 15m
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
app.use('/api/users',userRoutes );

// 404 handler (after routes)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Central error handler (make sure it doesn’t leak stack traces in prod)
app.use((err, req, res, next) => {
  if (NODE_ENV !== 'production') {
    // delegate to your existing errorHandler in dev so you can debug
    return errorHandler(err, req, res, next);
  }
  // minimal error in prod
  const status = err.status || 500;
  return res.status(status).json({ error: err.message || 'Internal Server Error' });
});

// ───────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
