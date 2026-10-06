const mongoose = require('mongoose');
const createError = require('http-errors');

/**
 * Rejects malformed ObjectIds before they reach a repository, so a bad URL
 * produces a clean 400 instead of a CastError bubbling out of a query.
 *
 * Usage: app.use('/:id', validateObjectId) or per-route.
 */
const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const value = req.params[paramName];
  if (!value || !mongoose.Types.ObjectId.isValid(value)) {
    return next(createError(400, `Invalid ${paramName}`, { code: 'INVALID_ID' }));
  }
  return next();
};

// Validates every supplied param name that is present on the request.
const validateObjectIds = (...paramNames) => (req, res, next) => {
  for (const name of paramNames) {
    const value = req.params[name];
    if (value !== undefined && !mongoose.Types.ObjectId.isValid(value)) {
      return next(createError(400, `Invalid ${name}`, { code: 'INVALID_ID' }));
    }
  }
  return next();
};

module.exports = { validateObjectId, validateObjectIds };
