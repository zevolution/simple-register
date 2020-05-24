const PasswordError = require('./PasswordError');

class PasswordSmallError extends PasswordError {
  constructor(message) {
    super('The password must be at least 8 characters');
  }
};

module.exports = PasswordSmallError;