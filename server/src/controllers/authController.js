const createError = require('http-errors');
const User = require('../data/models/User');
const logger = require('../utils/logger');
const { toPublicUser } = require('../utils/publicUser');

const deriveUsername = (decoded, existing) => {
  if (existing?.username) return existing.username;
  const base =
    decoded.email?.split('@')[0] ||
    decoded.name?.replace(/\s+/g, '').toLowerCase() ||
    `player_${decoded.uid.slice(0, 8)}`;
  return base.slice(0, 30);
};

/**
 * Links a Firebase identity to a Mongo User document.
 * Idempotent: safe to call on every page load.
 */
exports.syncUser = async (req, res, next) => {
  try {
    const { uid, email, name, picture } = req.user;
    if (!uid) throw createError(401, 'Authentication required');

    const existing = await User.findOne({ uid });

    // Claim a pre-seeded account if the username matches, so demo users keep
    // their history instead of being shadowed by a duplicate record.
    let user = existing;
    if (!user && email) {
      user = await User.findOne({ username: deriveUsername({ uid, email, name }) });
    }

    if (user) {
      user.uid = uid;
      if (email && !user.email) user.email = email;
      if (picture && !user.avatar) user.avatar = picture;
      if (name && !user.name) user.name = name;
      await user.save();
    } else {
      user = await User.create({
        name: name || 'SquadUp Athlete',
        username: deriveUsername({ uid, email, name }),
        uid,
        email,
        avatar: picture,
      });
      logger.info(`[authSync] Provisioned new user ${user._id} for uid ${uid.slice(0, 8)}`);
    }

    res.json({ success: true, data: toPublicUser(user) });
  } catch (err) {
    // A unique-index collision means another account already owns this username.
    if (err.code === 11000) {
      return next(createError(409, 'That username is already taken', { code: 'CONFLICT' }));
    }
    return next(err);
  }
};
