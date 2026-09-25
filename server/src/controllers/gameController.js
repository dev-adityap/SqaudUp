const gameService = require('../services/gameService');

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
    const newGame = await gameService.createGame(req.body);
    res.status(201).json({ success: true, data: newGame });
  } catch (err) { next(err); }
};

exports.joinGame = async (req, res, next) => {
  try {
    const updatedGame = await gameService.joinGame(req.params.id, req.body.userId);
    res.json({ success: true, data: updatedGame });
  } catch (err) { next(err); }
};

exports.leaveGame = async (req, res, next) => {
  try {
    const updatedGame = await gameService.leaveGame(req.params.id, req.body.userId);
    res.json({ success: true, data: updatedGame });
  } catch (err) { next(err); }
};