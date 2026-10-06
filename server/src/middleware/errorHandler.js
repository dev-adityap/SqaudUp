const logger = require('../utils/logger');

const isProd = () => process.env.NODE_ENV === 'production';

// Errors safe to echo back to the client. Anything not listed here is masked.
const PUBLIC_CODES = new Set(['VALIDATION_ERROR', 'NOT_FOUND', 'UNAUTHORIZED', 'FORBIDDEN', 'CONFLICT']);

module.exports = (err, req, res, next) => {
  let status = 500;
  let code = 'SERVER_ERROR';
  let message = 'Internal Server Error';

  if (err.status && err.status >= 400 && err.status < 500) {
    // http-errors raised deliberately by our own middleware (404, 401, etc).
    status = err.status;
    code = err.code || (status === 401 ? 'UNAUTHORIZED' : 'CLIENT_ERROR');
    message = err.expose ? err.message : 'Request could not be completed';
  } else if (err instanceof SyntaxError && 'body' in err) {
    // Malformed JSON payload from body-parser.
    status = 400;
    code = 'INVALID_JSON';
    message = 'Malformed JSON body';
  } else if (err.name === 'ValidationError' && err.errors) {
    status = 400;
    code = 'VALIDATION_ERROR';
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  } else if (err.name === 'CastError') {
    // Never echo the offending value back to the client.
    status = 400;
    code = 'INVALID_ID';
    message = `Invalid value for field "${err.path}"`;
  } else if (err.code === 11000) {
    status = 409;
    code = 'CONFLICT';
    message = 'Resource already exists';
  }

  if (status >= 500) {
    // Log the real cause server-side only, never to the client.
    logger.error(`${req.method} ${req.originalUrl} - ${err.stack || err.message}`);
  }

  const body = { success: false, error: message, code };

  if (!isProd() && PUBLIC_CODES.has(code) && err.stack) {
    body.stack = err.stack;
  }

  res.status(status).json(body);
};
