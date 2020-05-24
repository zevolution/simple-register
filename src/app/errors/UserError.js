const ApiError = require('./ApiError');

class UserError extends ApiError {
  constructor(message) {
    super('User validation error', 400, message, '/auth');
  }
};

module.exports = UserError;