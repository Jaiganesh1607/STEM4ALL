const mongoose = require('mongoose');

const allowedRoles = ['student', 'instructor', 'admin'];

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: allowedRoles,
      default: 'student',
      required: true,
      index: true,
    },
    approved: {
      // Used for instructors; ignored for others
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

UserSchema.virtual('needsApproval').get(function () {
  return this.role === 'instructor';
});

module.exports = mongoose.model('User', UserSchema);
