const notifService = require('../services/notifService');

exports.getUserNotifications = async (req, res, next) => {
  try {
    const notifs = await notifService.getUserNotifications(req.params.userId);
    res.json({ success: true, data: notifs });
  } catch (err) { next(err); }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notif = await notifService.markAsRead(req.params.id);
    res.json({ success: true, data: notif });
  } catch (err) { next(err); }
};