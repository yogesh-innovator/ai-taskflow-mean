const mongoose = require('mongoose');
const { User } = require('../models/user.model');
const { ApiError } = require('../middleware/error.middleware');

const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

// Helper to wrap async controllers

function asyncHandler(fn) {
  return function asyncWrapper(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// POST/api/auth/register

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email and password are required');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Email already in use');
  }

  const user = new User({
    name,
    email,
    role: role || 'user',
  });

  // This will trigger the pre-save hook to hash password

  user.password = password;

  await user.save();

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are requred');
  }

  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  user.lastLogin = new Date();
  await user.save();

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    },
  });
});

// POST /api/auth/refresh

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  if (payload.type !== 'refresh') {
    throw new ApiError(401, 'Invalid token type');
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  const newAccessToken = signAccessToken(user);
  res.json({
    status: 'success',
    data: {
      accessToken: newAccessToken,
    },
  });
});

module.exports = {
  register,
  login,
  refresh,
};
