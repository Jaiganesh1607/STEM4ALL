const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  workshopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  parentMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null // For reply threading
  }
}, { timestamps: true });

// Compound indexes for efficient queries
MessageSchema.index({ senderId: 1, receiverId: 1 });
MessageSchema.index({ workshopId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);
