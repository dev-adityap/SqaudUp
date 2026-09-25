const Notification = require('../../data/models/Notification');

class NotifRepository {
  async findByUser(userId) { return await Notification.find({ userId }).sort({ createdAt: -1 }); }
  async create(data) { return await Notification.create(data); }
  async markRead(id) { return await Notification.findByIdAndUpdate(id, { read: true }, { new: true }); }
}

module.exports = new NotifRepository();