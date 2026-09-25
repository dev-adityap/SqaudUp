const createError = require('http-errors');
const gameRepo = require('../repositories/memory/gameRepository');
const userRepo = require('../repositories/memory/userRepository');

class GameService {
  async getAllGames(filters) {
    return await gameRepo.findMany(filters);
  }

  async getGameDetails(gameId) {
    const game = await gameRepo.findById(gameId);
    if (!game) throw createError(404, 'Game not found', { code: 'GAME_NOT_FOUND' });
    
    // Simulate populating relational data
    const host = await userRepo.findById(game.hostId);
    const players = await Promise.all(game.players.map(id => userRepo.findById(id)));
    
    return { ...game, host, players };
  }

  async createGame(data) {
    const host = await userRepo.findById(data.hostId);
    if (!host) throw createError(404, 'Host user not found');
    return await gameRepo.create(data);
  }

  async joinGame(gameId, userId) {
    const game = await gameRepo.findById(gameId);
    if (!game) throw createError(404, 'Game not found');
    
    if (game.status !== 'OPEN') throw createError(400, 'Game is not open for joining');
    if (game.openSlots <= 0) throw createError(400, 'Game is already full');
    if (game.players.includes(userId)) throw createError(400, 'User is already in this game');

    const updatedPlayers = [...game.players, userId];
    const updatedSlots = game.openSlots - 1;
    const status = updatedSlots === 0 ? 'FULL' : 'OPEN';

    return await gameRepo.update(gameId, { players: updatedPlayers, openSlots: updatedSlots, status });
  }

  async leaveGame(gameId, userId) {
    const game = await gameRepo.findById(gameId);
    if (!game) throw createError(404, 'Game not found');
    
    if (game.hostId === userId) throw createError(400, 'Host cannot leave without transferring ownership');
    if (!game.players.includes(userId)) throw createError(400, 'User is not in this game');

    const updatedPlayers = game.players.filter(id => id !== userId);
    const updatedSlots = game.openSlots + 1;

    return await gameRepo.update(gameId, { players: updatedPlayers, openSlots: updatedSlots, status: 'OPEN' });
  }
}

module.exports = new GameService();