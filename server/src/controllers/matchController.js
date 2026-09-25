const matchService = require('../services/matchService');

exports.getMatchCandidates = async (req, res, next) => {
  try {
    const candidates = await matchService.findCandidates(req.params.gameId);
    res.json({ success: true, data: candidates });
  } catch (err) {
    next(err);
  }
};