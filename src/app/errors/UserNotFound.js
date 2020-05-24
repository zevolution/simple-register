const UserError = require('./UserError');

class UserNotFound extends UserError {
  constructor(property) {
    const message = property ? `User ${property} not found` : 'User not found';
    super(message);
  }
};

module.exports = UserNotFound;