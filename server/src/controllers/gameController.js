const createError = require('http-errors');
const gameService = require('../services/gameService');
const attendanceService = require('../services/attendanceService');
const { requireMongoUser } = gameService;
const { toPublicUser } = require('../utils/publicUser');

exports.getGames = async (req, res, next) => {
  try {
    const games = await gameService.getAllGames(req.query);
    res.json({ success: true, data: games });
  } catch (err) { next(err); }
};

exports.getGameById = async (req, res, next) => {
  try {
    const game = await gameService.getGameDetails(req.params.id);
    res.json({ success: true, data: game });
  } catch (err) { next(err); }
};

exports.createGame = async (req, res, next) => {
  try {
    const host = await requireMongoUser(req.user.uid);
    const newGame = await gameService.createGame(req.body, host);
    res.status(201).json({ success: true, data: newGame });
  } catch (err) { next(err); }
};

// The acting user comes from the verified token, so a caller can no longer
// join or eject a game on someone else's behalf.
exports.joinGame = async (req, res, next) => {
  try {
    const user = await requireMongoUser(req.user.uid);
    const updatedGame = await gameService.joinGame(req.params.id, user);
    res.json({ success: true, data: { ...updatedGame.toObject(), currentUserId: user._id.toString() } });
  } catch (err) { next(err); }
};

exports.leaveGame = async (req, res, next) => {
  try {
    const user = await requireMongoUser(req.user.uid);
    const updatedGame = await gameService.leaveGame(req.params.id, user);
    res.json({ success: true, data: { ...updatedGame.toObject(), currentUserId: user._id.toString() } });
  } catch (err) { next(err); }
};

exports.markAttendance = async (req, res, next) => {
  try {
    const { playerId, status } = req.body;
    const marker = await requireMongoUser(req.user.uid);
    const result = await attendanceService.markAttendance({
      gameId: req.params.id,
      playerId,
      status,
      markedBy: marker._id.toString(),
    });

    res.json({
      success: true,
      data: {
        game: result.game,
        player: toPublicUser(result.player),
        // Surfaced so the UI can explain the reliability change it just caused.
        scoreChange: result.player.scoreChange,
        previousScore: result.player.previousScore,
      },
    });
  } catch (err) { next(err); }
};
