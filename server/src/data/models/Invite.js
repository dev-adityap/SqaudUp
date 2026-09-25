const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('Invite', inviteSchema);