const reliabilityService = require('../services/reliabilityService');

exports.getReliabilityStats = async (req, res, next) => {
  try {
    const stats = await reliabilityService.getStats(req.params.userId);
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};

exports.logAttendance = async (req, res, next) => {
  try {
    const { gameId, userId, event } = req.body;
    const log = await reliabilityService.logAttendance(gameId, userId, event);
    res.json({ success: true, data: log });
  } catch (err) { next(err); }
};