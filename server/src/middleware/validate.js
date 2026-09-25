const createError = require('http-errors');

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    const message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    next(createError(400, message, { code: 'VALIDATION_ERROR' }));
  }
};

module.exports = validate;