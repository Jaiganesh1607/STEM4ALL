const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    workshopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workshop',
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    certificateUrl: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate stored attempts per student per workshop if desired later
// ResultSchema.index({ studentId: 1, workshopId: 1 }, { unique: false });

module.exports = mongoose.model('Result', ResultSchema);
