const createError = require('http-errors');
const userRepo = require('../repositories/memory/userRepository');
const relRepo = require('../repositories/memory/reliabilityRepository');

// Event Weights Configuration
const WEIGHTS = {
  ATTENDED: 2,
  EARLY_CANCEL: -2,
  LATE_CANCEL: -5,
  NO_SHOW: -12
};

class ReliabilityService {
  async logAttendance(gameId, userId, event) {
    const user = await userRepo.findById(userId);
    if (!user) throw createError(404, 'User not found');
    
    const weight = WEIGHTS[event];
    if (weight === undefined) throw createError(400, 'Invalid attendance event type');

    const previousScore = user.reliabilityScore;
    let newScore = previousScore + weight;
    
    // Clamp score between 0 and 100
    if (newScore > 100) newScore = 100;
    if (newScore < 0) newScore = 0;

    // Persist the score change. Without this the document is mutated in memory
    // and silently discarded when the request ends.
    user.reliabilityScore = newScore;
    await user.save();

    return await relRepo.createEvent({
      userId, gameId, event, previousScore, scoreChange: weight, newScore
    });
  }
  
  async getStats(userId) {
    const user = await userRepo.findById(userId);
    if (!user) throw createError(404, 'User not found');
    
    const history = await relRepo.getHistory(userId);
    return { score: user.reliabilityScore, gamesPlayed: user.gamesPlayed, history };
  }
}

module.exports = new ReliabilityService();