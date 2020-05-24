/**
 * Class of error ancestral to internal errors of application
 * 
 * @param {String} message - a message to store in error
 * @constructor
 */
class AppError extends Error {
  constructor(message = 'Internal application error, contact your administrator') {
    console.log(`AppErro ${message}`);
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
};

module.exports = AppError;