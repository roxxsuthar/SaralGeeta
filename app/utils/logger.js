// Simple logger that no-ops in production builds
// In React Native, prefer __DEV__
const isProduction = typeof __DEV__ !== 'undefined' ? !__DEV__ : false;

const createLoggerMethod = (methodName) => {
  if (isProduction) {
    return () => {};
  }
  // Bind to console to preserve stack traces and formatting
  return console[methodName] ? console[methodName].bind(console) : () => {};
};

const logger = {
  log: createLoggerMethod('log'),
  info: createLoggerMethod('info'),
  warn: createLoggerMethod('warn'),
  error: createLoggerMethod('error'),
  debug: createLoggerMethod('debug'),
  trace: createLoggerMethod('trace'),
};

export default logger;
