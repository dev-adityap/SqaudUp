const createError = require('http-errors');
const Game = require('../data/models/Game');
const User = require('../data/models/User');
const logger = require('../utils/logger');
const { toPublicUser } = require('../utils/publicUser');

// Resolve the Mongo User behind a verified Firebase uid. 401 if not provisioned.
async function requireMongoUser(uid) {
  const user = await User.findOne({ uid });
  if (!user) {
    throw createError(403, 'Finish setting up your profile before joining a squad', {
      code: 'PROFILE_NOT_READY',
    });
  }
  return user;
}

class GameService {
  async getAllGames(filters) {
    const games = await Game.find(filters).sort({ date: 1, startTime: 1 }).lean();
    return games;
  }

  // Host and roster are reduced to the public projection. Full User documents
  // carry email/uid/location and must never leave the server here.
  async getGameDetails(gameId) {
    const game = await Game.findById(gameId).lean();
    if (!game) throw createError(404, 'Game not found', { code: 'GAME_NOT_FOUND' });

    const [host, players] = await Promise.all([
      User.findById(game.hostId).select('username avatar age reliabilityScore gamesPlayed sports').lean(),
      User.find({ _id: { $in: game.players } })
        .select('username avatar age reliabilityScore gamesPlayed sports')
        .lean(),
    ]);

    // Preserve roster order from game.players.
    const byId = new Map(players.map((p) => [String(p._id), p]));
    const ordered = game.players
      .map((pid) => byId.get(String(pid)))
      .filter(Boolean)
      .map(toPublicUser);

    return { ...game, host: toPublicUser(host), players: ordered };
  }

  async createGame(data, hostDoc) {
    return await Game.create({
      ...data,
      hostId: hostDoc._id,
      players: [hostDoc._id],
      openSlots: Math.max(0, data.maxPlayers - 1),
      status: 'OPEN',
    });
  }

  // userId is always the authenticated user's own Mongo id. Never client-supplied.
  async joinGame(gameId, userDoc) {
    const game = await Game.findById(gameId);
    if (!game) throw createError(404, 'Game not found', { code: 'GAME_NOT_FOUND' });

    const uid = userDoc._id.toString();
    if (game.status === 'CANCELLED') throw createError(400, 'This game has been cancelled');
    if (game.status === 'FULL' || game.openSlots <= 0) {
      throw createError(400, 'This game is already full', { code: 'GAME_FULL' });
    }
    if (game.players.some((p) => p.toString() === uid)) {
      throw createError(409, 'You are already in this game', { code: 'ALREADY_JOINED' });
    }

    game.players.push(userDoc._id);
    game.openSlots = Math.max(0, game.openSlots - 1);
    game.status = game.openSlots === 0 ? 'FULL' : 'OPEN';
    return await game.save();
  }

  async leaveGame(gameId, userDoc) {
    const game = await Game.findById(gameId);
    if (!game) throw createError(404, 'Game not found', { code: 'GAME_NOT_FOUND' });

    const uid = userDoc._id.toString();
    if (game.hostId.toString() === uid) {
      throw createError(400, 'The host cannot leave without transferring ownership', {
        code: 'HOST_CANNOT_LEAVE',
      });
    }
    if (!game.players.some((p) => p.toString() === uid)) {
      throw createError(400, 'You are not in this game', { code: 'NOT_IN_GAME' });
    }

    game.players = game.players.filter((p) => p.toString() !== uid);
    game.openSlots = Math.min(game.maxPlayers, game.openSlots + 1);
    if (game.status === 'FULL') game.status = 'OPEN';
    return await game.save();
  }

  /**
   * Host-only post-game reliability review.
   *
   * @param {string} gameId
   * @param {object} hostDoc - The authenticated host's Mongo document.
   * @param {Array<{userId: string, attended: boolean}>} attendance
   */
  async reviewGame(gameId, hostDoc, attendance) {
    const game = await Game.findById(gameId);
    if (!game) throw createError(404, 'Game not found', { code: 'GAME_NOT_FOUND' });

    // Authorization: only the host may run a post-game review.
    if (game.hostId.toString() !== hostDoc._id.toString()) {
      throw createError(403, 'Only the host can review this match', { code: 'FORBIDDEN' });
    }

    if (game.reviewStatus === 'completed') {
      throw createError(409, 'This match has already been reviewed', { code: 'ALREADY_REVIEWED' });
    }

    // Validate that every supplied userId is actually in the squad.
    const squadIds = new Set(game.players.map((p) => p.toString()));
    for (const entry of attendance) {
      if (!squadIds.has(entry.userId)) {
        throw createError(400, `User ${entry.userId} is not in this squad`, {
          code: 'PLAYER_NOT_IN_SQUAD',
        });
      }
    }

    // Mark the game as reviewed so it can never be double-counted.
    game.reviewStatus = 'completed';
    game.status = 'COMPLETED';
    await game.save();

    const updatedPlayers = [];
    for (const entry of attendance) {
      const player = await User.findById(entry.userId);
      if (!player) continue;

      const previousScore = player.reliabilityScore ?? 100;
      const gamesPlayed = (player.gamesPlayed || 0) + 1;
      const gamesAttended = (player.gamesAttended || 0) + (entry.attended ? 1 : 0);
      const reliabilityScore = Math.round((gamesAttended / gamesPlayed) * 100);

      player.gamesPlayed = gamesPlayed;
      player.gamesAttended = gamesAttended;
      player.reliabilityScore = reliabilityScore;
      await player.save();

      updatedPlayers.push({
        _id: player._id,
        username: player.username,
        reliabilityScore,
        gamesPlayed,
        gamesAttended,
        attended: entry.attended,
        previousScore,
      });
    }

    return { game, players: updatedPlayers };
  }
}

module.exports = new GameService();
module.exports.requireMongoUser = requireMongoUser;
