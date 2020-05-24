const ApiError = require('../../app/errors/ApiError');

module.exports = (e, req, res, next) => {
  if (e instanceof ApiError) {
    res.status(e.status).json({
      error: {
        title: e.title,
        status: e.status,
        detail: e.message,
        instance: req.originalUrl
      }
    })
  } else {
    console.log(e.message);
    res.status(500).json({
      error: {
        title: 'Internal Error',
        status: 500,
        detail: 'Internal application error, contact your administrator',
        instance: req.originalUrl
      }
    })
  }
};