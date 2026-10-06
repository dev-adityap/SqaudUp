const inviteService = require('../services/inviteService');
const { requireMongoUser } = require('../services/gameService');

exports.getUserInvitations = async (req, res, next) => {
  try {
    const invites = await inviteService.getUserInvitations(req.params.userId);
    res.json({ success: true, data: invites });
  } catch (err) { next(err); }
};

exports.createInvitation = async (req, res, next) => {
  try {
    // senderId is taken from the token so an invite cannot be forged.
    const sender = await requireMongoUser(req.user.uid);
    const { gameId, playerId } = req.body;
    const invite = await inviteService.createInvitation(gameId, sender._id, playerId);
    res.status(201).json({ success: true, data: invite });
  } catch (err) { next(err); }
};

exports.acceptInvitation = async (req, res, next) => {
  try {
    const user = await requireMongoUser(req.user.uid);
    const invite = await inviteService.acceptInvitation(req.params.id, user);
    res.json({ success: true, data: invite });
  } catch (err) { next(err); }
};

exports.rejectInvitation = async (req, res, next) => {
  try {
    const user = await requireMongoUser(req.user.uid);
    const invite = await inviteService.rejectInvitation(req.params.id, user);
    res.json({ success: true, data: invite });
  } catch (err) { next(err); }
};
