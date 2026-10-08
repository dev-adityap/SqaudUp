const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  // Firebase Authentication UID. Sparse + unique so the seeded test accounts
  // (which have no Firebase identity) keep working alongside real sign-ins.
  uid: { type: String, unique: true, sparse: true, index: true },
  email: { type: String },
  avatar: { type: String },
  age: { type: Number },
  sports: [{ type: String }],
  skillLevels: {
    type: Map,
    of: String // e.g., { "Football": "Advanced", "Badminton": "Intermediate" }
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [Longitude, Latitude]
  },
  reliabilityScore: { type: Number, default: 100, min: 0, max: 100 },
  gamesPlayed: { type: Number, default: 0 },
  gamesAttended: { type: Number, default: 0 }
}, { timestamps: true });

// Geo-spatial index for faster radius querying later!
userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);