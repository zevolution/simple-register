const ApiError = require('./ApiError');

class TokenError extends ApiError {
  constructor(message) {
    super('Token validation error', 401, message, '/auth');
  }
}

module.exports = TokenError;