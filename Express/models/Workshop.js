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
    // NEW: File upload support
    resourceFiles: [{
      filename: String,
      originalName: String,
      filepath: String,
      filesize: Number,
      mimetype: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // NEW: Workshop status
    status: {
      type: String,
      enum: ['draft', 'published', 'completed', 'cancelled'],
      default: 'published',
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workshop', WorkshopSchema);
