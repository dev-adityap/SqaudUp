const createError = require('http-errors');
const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    // Strip unknown keys and trim strings before the controller ever sees them.
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const message = err.issues
        .map((e) => `${e.path.join('.') || 'body'}: ${e.message}`)
        .join(', ');
      return next(createError(400, message, { code: 'VALIDATION_ERROR' }));
    }
    return next(err);
  }
};

module.exports = validate;
