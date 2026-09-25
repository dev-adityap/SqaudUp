const mongoose = require('mongoose');

const relSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  event: { type: String, required: true },
  previousScore: { type: Number },
  scoreChange: { type: Number },
  newScore: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('ReliabilityEvent', relSchema);