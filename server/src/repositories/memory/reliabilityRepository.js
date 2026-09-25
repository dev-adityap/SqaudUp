const ReliabilityEvent = require('../../data/models/ReliabilityEvent');

class ReliabilityRepository {
  async getHistory(userId) { return await ReliabilityEvent.find({ userId }).sort({ createdAt: -1 }); }
  async createEvent(data) { return await ReliabilityEvent.create(data); }
}

module.exports = new ReliabilityRepository();