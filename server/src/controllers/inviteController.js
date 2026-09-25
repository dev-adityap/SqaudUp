const inviteService = require('../services/inviteService');

exports.getUserInvitations = async (req, res, next) => {
  try {
    const invites = await inviteService.getUserInvitations(req.params.userId);
    res.json({ success: true, data: invites });
  } catch (err) { next(err); }
};

exports.createInvitation = async (req, res, next) => {
  try {
    const { gameId, senderId, playerId } = req.body;
    const invite = await inviteService.createInvitation(gameId, senderId, playerId);
    res.status(201).json({ success: true, data: invite });
  } catch (err) { next(err); }
};

exports.acceptInvitation = async (req, res, next) => {
  try {
    const invite = await inviteService.acceptInvitation(req.params.id, req.body.userId);
    res.json({ success: true, data: invite });
  } catch (err) { next(err); }
};

exports.rejectInvitation = async (req, res, next) => {
  try {
    const invite = await inviteService.rejectInvitation(req.params.id, req.body.userId);
    res.json({ success: true, data: invite });
  } catch (err) { next(err); }
};