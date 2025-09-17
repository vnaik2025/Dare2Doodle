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



// src/index.js
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');

// IMPORTANT: require routes individually in try/catch so we can identify a bad route during startup.
const routesToLoad = [
  { mount: '/api/auth', path: './routes/auth.routes', authLimiter: true },
  { mount: '/api/challenges', path: './routes/challenge.routes' },
  { mount: '/api/comments', path: './routes/comment.routes' },
  { mount: '/api/likes', path: './routes/likes.routes' },
  { mount: '/api/bookmarks', path: './routes/bookmarks.routes' },
  { mount: '/api/notifications', path: './routes/notifications.routes' },
  { mount: '/api/reports', path: './routes/reports.routes' },
  { mount: '/api/users', path: './routes/user.routes' },
];

const app = express();

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

// ───────────────────────────────────────────────────────────────────────────────
// app configuration
if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS config: in dev allow localhost:5173
const devDefaultOrigin = 'http://localhost:5173';
const envOrigins =
  (process.env.CORS_ORIGINS && process.env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)) ||
  (process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []);
const allowedOrigins = NODE_ENV === 'production' ? envOrigins : [devDefaultOrigin, ...envOrigins];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser clients
      if (allowedOrigins.length === 0) return callback(null, true); // fallback (not recommended for prod)
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 86400,
  })
);

// Rate limiting
app.use(
  rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) : 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  })
);

// Tighter auth limiter (we'll apply it when mounting auth route)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.AUTH_RATE_LIMIT_MAX ? parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth requests, please try again later.' },
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', env: NODE_ENV, time: new Date().toISOString() });
});

// ───────────────────────────────────────────────────────────────────────────────
// Load and mount routes safely so we can detect malformed route patterns
routesToLoad.forEach(routeInfo => {
  try {
    // require the route module
    const router = require(routeInfo.path);
    if (!router || typeof router !== 'function') {
      console.warn(`[WARN] Route file ${routeInfo.path} did not export an Express router function/object.`);
    }

    // mount with optional auth limiter
    if (routeInfo.authLimiter) {
      app.use(routeInfo.mount, authLimiter, router);
    } else {
      app.use(routeInfo.mount, router);
    }
    console.log(`[OK] Mounted ${routeInfo.path} -> ${routeInfo.mount}`);
  } catch (err) {
    // If path-to-regexp throws, it will be caught here — make error message explicit and rethrow
    console.error(`\n[ERROR] Failed to load route file ${routeInfo.path} while mounting ${routeInfo.mount}`);
    console.error('Error message:', err && err.message);
    console.error('Full error (stack):', err && err.stack);
    // Re-throw so the serverless build fails (so you fix the route). Vercel shows this in build logs.
    throw err;
  }
});

// 404 handler (after routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Central error handler
app.use((err, req, res, next) => {
  if (NODE_ENV !== 'production') {
    return errorHandler(err, req, res, next); // your dev handler
  }
  const status = err.status || 500;
  return res.status(status).json({ error: err.message || 'Internal Server Error' });
});

// IMPORTANT for Vercel: do NOT call app.listen() here.
// Export the Express app as the module export so @vercel/node can use it.
module.exports = app;
