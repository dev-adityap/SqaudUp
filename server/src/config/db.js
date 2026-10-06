const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`[SqaudUp DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`[SqaudUp DB] Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;