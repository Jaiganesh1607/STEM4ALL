// models/StudentProgress.js
const mongoose = require('mongoose');

const StudentProgressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  workshopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
    required: true,
    index: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['enrolled', 'in_progress', 'completed', 'dropped'],
    default: 'enrolled',
    index: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  completedSections: [{
    sectionId: String,
    completedAt: Date
  }],
  timeSpent: {
    type: Number, // in minutes
    default: 0
  }
}, { timestamps: true });

// Compound index for unique student-workshop pairs
StudentProgressSchema.index({ studentId: 1, workshopId: 1 }, { unique: true });

module.exports = mongoose.model('StudentProgress', StudentProgressSchema);
