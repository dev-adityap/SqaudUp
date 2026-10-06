/**
 * Fields safe to send to any client. Never expose `email`, `uid`, `location`,
 * `skillLevels` or any other internal field through a general-purpose endpoint.
 */
const PUBLIC_USER_FIELDS = 'username avatar age reliabilityScore gamesPlayed sports';

/**
 * Reduces a User document (or lean object) to the public projection.
 * Returns null for missing input so callers can render a placeholder.
 */
const toPublicUser = (user) => {
  if (!user) return null;
  const obj = typeof user.toObject === 'function' ? user.toObject() : user;
  return {
    _id: obj._id,
    username: obj.username,
    avatar: obj.avatar || null,
    age: obj.age ?? null,
    reliabilityScore: obj.reliabilityScore ?? 100,
    gamesPlayed: obj.gamesPlayed ?? 0,
    sports: obj.sports || [],
  };
};

const publicUserSelect = () => PUBLIC_USER_FIELDS;

module.exports = { PUBLIC_USER_FIELDS, toPublicUser, publicUserSelect };
