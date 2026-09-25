const createError = require('http-errors');
const gameRepo = require('../repositories/memory/gameRepository');
const userRepo = require('../repositories/memory/userRepository');
const { calculateDistance } = require('../utils/distance');

class MatchService {
  async findCandidates(gameId) {
    const game = await gameRepo.findById(gameId);
    if (!game) throw createError(404, 'Game not found');
    if (game.status !== 'OPEN') throw createError(400, 'Game is not accepting players');

    const allUsers = await userRepo.findAll();
    const candidates = [];
    const [gLon, gLat] = game.location.coordinates;

    for (const user of allUsers) {
      // Hard Constraint 1: Already in the game
      if (game.players.includes(user.id)) continue;
      // Hard Constraint 2: Doesn't play the required sport
      if (!user.sports.includes(game.sport)) continue;

      // Distance calculation
      const [uLon, uLat] = user.location.coordinates;
      const distanceKm = calculateDistance(gLat, gLon, uLat, uLon);
      
      // Hard Constraint 3: Beyond 15km
      if (distanceKm > 15) continue;

      // --- Weighted Scoring Math ---
      
      // 1. Skill (35%)
      const userSkill = user.skillLevels[game.sport];
      let skillScore = 0;
      if (userSkill === game.skillLevel) skillScore = 100;
      else if (userSkill) skillScore = 50; 
      
      // 2. Reliability (25%)
      const reliabilityScore = user.reliabilityScore;

      // 3. Distance (20%) - Closer is better
      const distanceScore = Math.max(0, 100 - (distanceKm / 15) * 100);

      // 4. Availability & Community (20% total)
      const availabilityScore = 100; // Mocked for phase 2
      const communityScore = Math.min(100, (user.gamesPlayed / 50) * 100);

      const matchScore = Math.round(
        (skillScore * 0.35) +
        (reliabilityScore * 0.25) +
        (distanceScore * 0.20) +
        (availabilityScore * 0.10) +
        (communityScore * 0.10)
      );

      candidates.push({
        candidateId: user.id,
        player: { name: user.name, username: user.username, reliabilityScore },
        matchScore,
        distanceKm: Number(distanceKm.toFixed(1)),
        breakdown: { skill: skillScore, reliability: reliabilityScore, distance: Math.round(distanceScore) }
      });
    }

    // Return highest scores first
    return candidates.sort((a, b) => b.matchScore - a.matchScore);
  }
}

module.exports = new MatchService();