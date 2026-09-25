const Game = require('../../data/models/Game');

class GameRepository {
  async findById(id) {
    return await Game.findById(id);
  }

  async findMany(filters = {}) {
    const query = {};
    if (filters.sport) query.sport = new RegExp(`^${filters.sport}$`, 'i');
    if (filters.status) query.status = filters.status;
    if (filters.openSlots === 'true') query.openSlots = { $gt: 0 };
    
    return await Game.find(query);
  }

  async create(gameData) {
    const game = new Game({
      ...gameData,
      players: [gameData.hostId],
      openSlots: gameData.maxPlayers - 1,
      status: 'OPEN'
    });
    return await game.save(); // This tells Mongoose to save it to Atlas!
  }

  async update(id, updateData) {
    return await Game.findByIdAndUpdate(id, updateData, { new: true });
  }
}

module.exports = new GameRepository();