const User = require('../data/models/User');
const Game = require('../data/models/Game');
const createError = require('http-errors');

exports.getProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('username avatar gamesPlayed gamesAttended reliabilityScore')
      .lean();

    if (!user) {
      throw createError(404, 'User not found');
    }

    const games = await Game.find({ players: id })
      .sort({ date: -1, startTime: -1 })
      .select('sport venue date startTime attendance status')
      .lean();

    const sportCounts = {};
    games.forEach((game) => {
      sportCounts[game.sport] = (sportCounts[game.sport] || 0) + 1;
    });

    const sportDistribution = Object.entries(sportCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const recentGames = games.slice(0, 10).map((game) => ({
      id: game._id,
      sport: game.sport,
      venue: game.venue,
      date: game.date,
      startTime: game.startTime,
      status: game.status,
      attended: game.attendance?.some(
        (a) => a.playerId.toString() === id && a.status === 'present'
      ) ?? false,
    }));

    res.json({
      success: true,
      data: {
        user,
        sportDistribution,
        recentGames,
      },
    });
  } catch (err) {
    next(err);
  }
};