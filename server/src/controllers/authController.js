const createError = require('http-errors');
const User = require('../data/models/User');
const logger = require('../utils/logger');
const { toPublicUser } = require('../utils/publicUser');

const DEFAULT_LOCATION = {
  type: 'Point',
  coordinates: [0, 0], // [Longitude, Latitude] — safe default; user can update later
};

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
 *
 * Uses a single atomic findOneAndUpdate with upsert:true so both brand-new
 * signups and returning users are handled without race conditions or
 * duplicate-key crashes.
 */
exports.syncUser = async (req, res, next) => {
  try {
    const { uid, email, name, picture } = req.user;
    if (!uid) throw createError(401, 'Authentication required');

    const username = deriveUsername({ uid, email, name }, null);

    // Atomic upsert: create on first login, merge fields on every subsequent
    // sync. Never touches existing user documents that were seeded without a
    // Firebase identity (sparse uid index).
// Atomic upsert: create on first login, merge fields on every subsequent sync.
    const user = await User.findOneAndUpdate(
      { uid },
      {
        // FIX: $set and $setOnInsert must be siblings, not nested
        $set: {
          uid,
          email: email || undefined,
          name: name || undefined,
          avatar: picture || undefined,
          username,
        },
        $setOnInsert: { 
          location: DEFAULT_LOCATION 
        },
      },
      // FIX: Updated to 'returnDocument: after' to remove the Mongoose warning
      { upsert: true, returnDocument: 'after', runValidators: true }
    );

    res.json({ success: true, data: toPublicUser(user) });
  } catch (err) {
    // Explicit DB log so the terminal prints exactly what went wrong.
    console.error('SYNC DB ERROR:', err.message, '| code:', err.code, '| name:', err.name);

    // A unique-index collision means another account already owns this username.
    if (err.code === 11000) {
      return next(createError(409, 'That username is already taken', { code: 'CONFLICT' }));
    }
    return next(err);
  }
};