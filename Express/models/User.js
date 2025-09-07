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
      type: Boolean,
      default: false,
      index: true,
    },
    profile: {
      phone: { type: String, trim: true },
      school: { type: String, trim: true },
      grade: { type: String, trim: true },
      bio: { type: String, maxlength: 500, trim: true },
      avatar: { type: String, trim: true },
      dateOfBirth: { type: Date },
      location: { type: String, trim: true }, // ✅ Added missing field
      interests: { type: [String], default: [] }, // ✅ Added missing field
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      }
    }
  },
  { timestamps: true }
);

UserSchema.virtual('needsApproval').get(function () {
  return this.role === 'instructor';
});

module.exports = mongoose.model('User', UserSchema);
