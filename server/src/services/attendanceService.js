const createError = require('http-errors');
const Game = require('../data/models/Game');
const User = require('../data/models/User');
const ReliabilityEvent = require('../data/models/ReliabilityEvent');

const FLAKE_PENALTY = { min: 5, max: 10 };
const PRESENT_REWARD = 1;
const SCORE_MIN = 0;
const SCORE_MAX = 100;

const clamp = (n) => Math.min(SCORE_MAX, Math.max(SCORE_MIN, n));

class AttendanceService {
  async markAttendance({ gameId, playerId, status, markedBy }) {
    const game = await Game.findById(gameId);
    if (!game) throw createError(404, 'Game not found', { code: 'GAME_NOT_FOUND' });

    // Authorization: only the host or someone already in the squad may mark attendance.
    const isHost = game.hostId.toString() === markedBy;
    const isInSquad = game.players.some((p) => p.toString() === markedBy);
    if (!isHost && !isInSquad) {
      throw createError(403, 'You are not part of this squad', { code: 'FORBIDDEN' });
    }

    // A player cannot mark themselves; that would let anyone inflate their own score.
    if (playerId === markedBy) {
      throw createError(403, 'You cannot mark your own attendance', { code: 'FORBIDDEN' });
    }

    if (!game.players.some((p) => p.toString() === playerId)) {
      throw createError(404, 'Player is not in this game roster', { code: 'PLAYER_NOT_FOUND' });
    }

    const player = await User.findById(playerId);
    if (!player) throw createError(404, 'Player not found', { code: 'PLAYER_NOT_FOUND' });

    const alreadyMarked = game.attendance.some((a) => a.playerId.toString() === playerId);
    if (alreadyMarked) {
      throw createError(409, 'Attendance for this player is already recorded', { code: 'ALREADY_MARKED' });
    }

    // 1. Record attendance on the game.
    game.attendance.push({ playerId, status, markedBy });
    await game.save();

    // 2. Adjust the player's global reliability score.
    const previousScore = player.reliabilityScore;
    const scoreChange = status === 'present'
      ? PRESENT_REWARD
      : -(FLAKE_PENALTY.min + Math.floor(Math.random() * (FLAKE_PENALTY.max - FLAKE_PENALTY.min + 1)));

    player.reliabilityScore = clamp(previousScore + scoreChange);
    await player.save();

    // 3. Append-only audit trail.
    await ReliabilityEvent.create({
      userId: playerId,
      gameId,
      event: status === 'present' ? 'ATTENDED' : 'NO_SHOW',
      previousScore,
      scoreChange,
      newScore: player.reliabilityScore,
    });

    if (status === 'present') {
      player.gamesPlayed = (player.gamesPlayed || 0) + 1;
      await player.save();
    }

    return {
      game,
      player: {
        _id: player._id,
        username: player.username,
        reliabilityScore: player.reliabilityScore,
        scoreChange,
        previousScore,
      },
    };
  }
}

module.exports = new AttendanceService();
