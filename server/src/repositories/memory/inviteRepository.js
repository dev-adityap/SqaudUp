const Invite = require('../../data/models/Invite');

class InviteRepository {
  async findById(id) { return await Invite.findById(id); }
  async findByUser(userId) { return await Invite.find({ playerId: userId }); }
  async findPending(gameId, playerId) { return await Invite.findOne({ gameId, playerId, status: 'PENDING' }); }
  async create(data) { return await Invite.create(data); }
  async updateStatus(id, status) { return await Invite.findByIdAndUpdate(id, { status }, { new: true }); }
}

module.exports = new InviteRepository();