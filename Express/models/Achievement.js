const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['workshop_completion', 'quiz_mastery', 'streak', 'field_expert', 'certificate_earned'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  field: {
    type: String, // robotics, coding, AI, etc.
    required: false
  },
  metadata: {
    workshopCount: Number,
    averageScore: Number,
    streakDays: Number,
    specificWorkshop: String
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  icon: {
    type: String,
    default: '🏆'
  }
}, { timestamps: true });

// Compound index for efficient queries
AchievementSchema.index({ studentId: 1, type: 1 });

module.exports = mongoose.model('Achievement', AchievementSchema);
