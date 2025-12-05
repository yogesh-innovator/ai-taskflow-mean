const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

// Role enum (you can import/use this elsewhere later)

const ROLES = ['admin', 'manager', 'user'];
const STATUSES = ['active', 'inactive'];

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    // We'll never store raw password; we store only the hast.
    passwordHash: {
      type: String,
      required: false, // we enforce via hook
      select: false, // don't return by default
    },

    // Temporary field for setting password (not stored in DB)
    password: {
      type: String,
      required: false,
      select: false,
    },
    role: {
      type: String,
      enum: ROLES,
      default: 'user',
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'active',
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password if modified
userSchema.pre('save', async function userPreSave() {
  // 'this' is the document
  if (!this.isModified('password')) {
    return;
  }
  if (!this.password) {
    return new Error('Password is required');
  }

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(this.password, salt);

  this.passwordHash = hash;

  // Do not store raw password in DB
  this.password = undefined;
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  ROLES,
  STATUSES,
};
