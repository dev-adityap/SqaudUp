const User = require('../data/models/User');

exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaders = await User.find({ gamesPlayed: { $gt: 0 } })
      .sort({ gamesPlayed: -1, reliabilityScore: -1 })
      .limit(50)
      .select('username avatar gamesPlayed gamesAttended reliabilityScore')
      .lean();

    res.json({ success: true, data: leaders });
  } catch (err) {
    next(err);
  }
};