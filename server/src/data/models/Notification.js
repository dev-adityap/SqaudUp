const mongoose = require('mongoose');

const notifSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedGameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notifSchema);