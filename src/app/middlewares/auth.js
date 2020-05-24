const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

const TokenError = require('../errors/TokenError');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    throw new TokenError('No token provided');
  
  const parts = authHeader.split(' ');

  if (!parts.length === 2)
    throw new TokenError('Token error');

  const [ prefix, token ] = parts;
  
  if (!/^Bearer$/i.test(prefix))
    throw new TokenError('Token malformatted');

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) throw new TokenError('Token invalid');

    req.userId = decoded.id;

    return next();
  });
};