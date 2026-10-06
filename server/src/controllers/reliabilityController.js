const reliabilityService = require('../services/reliabilityService');
const { requireMongoUser } = require('../services/gameService');

exports.getReliabilityStats = async (req, res, next) => {
  try {
    const stats = await reliabilityService.getStats(req.params.userId);
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};

// userId is derived from the token: a caller may only log their own attendance.
exports.logAttendance = async (req, res, next) => {
  try {
    const user = await requireMongoUser(req.user.uid);
    const { gameId, event } = req.body;
    const log = await reliabilityService.logAttendance(gameId, user._id, event);
    res.json({ success: true, data: log });
  } catch (err) { next(err); }
};
