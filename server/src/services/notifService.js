const notifRepo = require('../repositories/memory/notifRepository');

class NotifService {
  async getUserNotifications(userId) { 
    return await notifRepo.findByUser(userId); 
  }
  
  async createNotification(userId, type, title, message, relatedGameId = null) {
    return await notifRepo.create({ userId, type, title, message, relatedGameId });
  }
  
  async markAsRead(notifId) { 
    return await notifRepo.markRead(notifId); 
  }
}

module.exports = new NotifService();