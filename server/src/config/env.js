require('dotenv').config();

const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI'];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing env variable : ${key}`);
  }
});

const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};

module.exports = { config };
