const app = require('./app');
const { PORT } = require('./config/env');
const connectDB = require('./config/db'); // Import DB connection

// Connect to MongoDB
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`[SqaudUp API] Server running on port ${PORT}`);
    console.log(`[SqaudUp API] Environment: Phase 3 (MongoDB Integration)`);
  });

  process.on('SIGINT', () => {
    server.close(() => {
      console.log('[SqaudUp API] Server closed.');
      process.exit(0);
    });
  });
});