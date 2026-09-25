const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sport: { type: String, required: true },
  title: { type: String, required: true },
  venue: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  skillLevel: { type: String, enum: ['Casual', 'Intermediate', 'Competitive'], required: true },
  maxPlayers: { type: Number, required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  openSlots: { type: Number, required: true },
  status: { type: String, enum: ['OPEN', 'FULL', 'CANCELLED', 'COMPLETED'], default: 'OPEN' }
}, { timestamps: true });

gameSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Game', gameSchema);