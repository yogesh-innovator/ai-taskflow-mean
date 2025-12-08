const jwt = require('jsonwebtoken');
const { config } = require('../config/env');

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      type: 'refresh',
    },
    config.jwtRefreshSecret,
    { expiresIn: config.jwtRefreshExpiresIn }
  );
}

function verifyAccessToken(token){
    return jwt.verify(token, config.jwtSecret);
}

function verifyRefreshToken(token){
    return jwt.verify(token, config.jwtRefreshSecret);
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}
