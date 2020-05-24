const ApiError = require('./ApiError');

class PasswordError extends ApiError {
  constructor(message) {
    super('Password validation error', 400, message, '/auth');
  }
};

module.exports = PasswordError;