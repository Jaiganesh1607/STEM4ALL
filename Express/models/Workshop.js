const mongoose = require('mongoose');

const WorkshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 140,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    date: {
      type: Date,
      required: true,
    },
    videoLink: {
      type: String,
      required: true,
      trim: true,
    },
    resourceLink: {
      type: String,
      trim: true,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workshop', WorkshopSchema);
