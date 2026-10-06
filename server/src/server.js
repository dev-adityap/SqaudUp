const app = require('./app');
const { PORT } = require('./config/env');
const connectDB = require('./config/db'); // Import DB connection
const logger = require('./utils/logger');

// Connect to MongoDB
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    logger.info(`[SqaudUp API] Server running on port ${PORT}`);
    logger.info(`[SqaudUp API] Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  process.on('SIGINT', () => {
    server.close(() => {
      logger.info('[SqaudUp API] Server closed.');
      process.exit(0);
    });
  });
});