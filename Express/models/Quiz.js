const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    options: {
      type: [String],
      validate: [(arr) => Array.isArray(arr) && arr.length >= 2, 'At least two options required'],
      required: true,
    },
    answerIndex: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const QuizSchema = new mongoose.Schema(
  {
    workshopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workshop',
      required: true,
      unique: true, // one quiz per workshop (MVP)
      index: true,
    },
    questions: {
      type: [QuestionSchema],
      required: true,
      validate: [(arr) => Array.isArray(arr) && arr.length > 0, 'At least one question required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', QuizSchema);
