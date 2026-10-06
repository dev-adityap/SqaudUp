const isProd = () => process.env.NODE_ENV === 'production';

// info/debug are suppressed in production to keep stdout free for real signals.
// warn/error always emit: the global error handler depends on error reaching the log.
const write = (level, args) => {
  if ((level === 'info' || level === 'debug') && isProd()) return;
  // eslint-disable-next-line no-console
  console[level](`[${new Date().toISOString()}]`, ...args);
};

module.exports = {
  info: (...args) => write('info', args),
  debug: (...args) => write('debug', args),
  warn: (...args) => write('warn', args),
  error: (...args) => write('error', args),
};
