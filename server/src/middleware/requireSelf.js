const createError = require('http-errors');
const { requireMongoUser } = require('../services/gameService');

/**
 * Blocks a caller from reading another user's private records by guessing their
 * id in the URL. Admins are not modelled, so this is a hard equality check.
 */
const requireSelf = (paramName = 'userId') => async (req, res, next) => {
  try {
    const caller = await requireMongoUser(req.user.uid);
    const requested = req.params[paramName];
    if (String(requested) !== String(caller._id)) {
      return next(createError(403, 'You can only access your own data', { code: 'FORBIDDEN' }));
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = { requireSelf };
