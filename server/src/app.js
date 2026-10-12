const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const createError = require('http-errors');
const errorHandler = require('./middleware/errorHandler');

// IMPORT OUR NEW ROUTES HERE
const routes = require('./routes');

const app = express();

app.use(helmet());
// Explicit allowlist. Requests without an Origin header (mobile apps, curl,
// server-to-server) are permitted; browser origins must match exactly.
const allowedOrigins = [
  'http://localhost:5173',
  'https://sqaud-up-s4at.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // 403 (not a generic Error) so the error handler returns a clean,
      // non-500 response instead of logging a stack trace.
      callback(createError(403, 'Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '100kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests' }
});
app.use('/api', apiLimiter);

// CONNECT THE ROUTES TO THE /api PATH
app.use('/api', routes);

// Base URL friendly response
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to the SqaudUp Backend. Go to /api/health to check status.' });
});

// 404 Handler
app.use((req, res, next) => {
  next(createError(404, `Route ${req.method} ${req.originalUrl} not found`));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;