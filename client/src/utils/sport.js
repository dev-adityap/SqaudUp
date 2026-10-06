/**
 * Sport matching is fragile when compared with `===`: the DB, the seeders and
 * user input can each differ in casing ("Football" vs "football"), and the UI
 * then reports 0 games for a category that clearly has some.
 *
 * Always normalise both sides before comparing.
 */
export const normalizeSport = (value) => String(value ?? '').trim().toLowerCase();

export const matchesSport = (game, sport) => {
  const target = normalizeSport(sport);
  if (!target) return false;
  return normalizeSport(game?.sport) === target;
};

/** Case-insensitive count of games per sport, keyed by the original label. */
export const countBySport = (games, categories) => {
  const counts = {};
  const totals = {};
  for (const g of games || []) {
    const k = normalizeSport(g?.sport);
    if (!k) continue;
    totals[k] = (totals[k] || 0) + 1;
  }
  for (const c of categories || []) {
    counts[c.name] = totals[normalizeSport(c.name)] || 0;
  }
  return counts;
};

/** Friendly label for a sport slug, e.g. "badminton" -> "Badminton". */
export const titleCaseSport = (value) => {
  const s = normalizeSport(value);
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
};