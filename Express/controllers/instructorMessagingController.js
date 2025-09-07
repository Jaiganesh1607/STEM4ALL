const Message = require('../models/Message');
const Workshop = require('../models/Workshop');
const User = require('../models/User');
const mongoose = require('mongoose');
const { Types, isValidObjectId } = mongoose;

// Get instructor's messages from students
exports.getInstructorMessages = async (req, res) => {
  try {
    const { workshopId } = req.query;

    // Validate and normalize IDs up front
    const meId = req.user.id;
    if (!isValidObjectId(meId)) {
      return res.status(400).json({ message: 'Invalid instructor id' });
    }
    if (workshopId && !isValidObjectId(workshopId)) {
      return res.status(400).json({ message: 'Invalid workshopId' });
    }

    // Build aggregation match (aggregation does NOT auto-cast)
    const matchQuery = { receiverId: new Types.ObjectId(meId) };
    if (workshopId) matchQuery.workshopId = new Types.ObjectId(workshopId);

    const conversations = await Message.aggregate([
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            workshopId: '$workshopId',
            studentId: '$senderId'
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
          totalMessages: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'workshops',
          localField: '_id.workshopId',
          foreignField: '_id',
          as: 'workshop'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$workshop' },
      { $unwind: '$student' },
      {
        // Ensure instructor owns the workshop (cast for aggregation)
        $match: { 'workshop.createdBy': new Types.ObjectId(meId) }
      }
    ]);

    const formattedConversations = conversations.map(conv => {
      const msgText = (conv?.lastMessage?.message || '');
      return {
        workshopId: conv._id.workshopId,
        studentId: conv._id.studentId,
        workshop: {
          title: conv.workshop.title,
          date: conv.workshop.date
        },
        student: {
          id: conv.student._id,
          name: conv.student.name,
          email: conv.student.email
        },
        lastMessage: {
          subject: conv.lastMessage.subject,
          preview: msgText.substring(0, 100) + (msgText.length > 100 ? '...' : ''),
          sentAt: conv.lastMessage.createdAt
        },
        unreadCount: conv.unreadCount,
        totalMessages: conv.totalMessages
      };
    });

    res.json({
      conversations: formattedConversations,
      totalConversations: formattedConversations.length,
      totalUnreadMessages: formattedConversations.reduce((sum, c) => sum + c.unreadCount, 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reply to student message
exports.replyToStudent = async (req, res) => {
  try {
    const { workshopId, studentId } = req.params;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }
    if (!isValidObjectId(workshopId) || !isValidObjectId(studentId)) {
      return res.status(400).json({ message: 'Invalid workshopId or studentId' });
    }

    // Verify instructor owns this workshop
    const workshop = await Workshop.findById(workshopId);
    if (!workshop || workshop.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied - you do not own this workshop' });
    }

    // Verify student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const newMessage = await Message.create({
      workshopId, // let Mongoose cast from string
      senderId: req.user.id,
      receiverId: studentId,
      subject: subject.trim(),
      message: message.trim()
    });

    await newMessage.populate('senderId', 'name email role');

    res.status(201).json({
      message: 'Reply sent successfully',
      messageData: {
        id: newMessage._id,
        subject: newMessage.subject,
        message: newMessage.message,
        sentAt: newMessage.createdAt,
        sender: {
          id: newMessage.senderId._id,
          name: newMessage.senderId.name,
          role: newMessage.senderId.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get conversation between instructor and specific student
exports.getConversationWithStudent = async (req, res) => {
  try {
    const { workshopId, studentId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (!isValidObjectId(workshopId) || !isValidObjectId(studentId)) {
      return res.status(400).json({ message: 'Invalid workshopId or studentId' });
    }

    // Verify instructor owns this workshop
    const workshop = await Workshop.findById(workshopId);
    if (!workshop || workshop.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied - you do not own this workshop' });
    }

    // Get student info
    const student = await User.findById(studentId).select('name email');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const messages = await Message.find({
      workshopId, // Mongoose casts string to ObjectId on find()
      $or: [
        { senderId: req.user.id, receiverId: studentId },
        { senderId: studentId, receiverId: req.user.id }
      ]
    })
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Mark messages as read where instructor is receiver
    await Message.updateMany(
      { workshopId, senderId: studentId, receiverId: req.user.id, isRead: false },
      { isRead: true }
    );

    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      subject: msg.subject,
      message: msg.message,
      sentAt: msg.createdAt,
      isRead: msg.isRead,
      sender: { id: msg.senderId._id, name: msg.senderId.name, role: msg.senderId.role },
      receiver: { id: msg.receiverId._id, name: msg.receiverId.name, role: msg.receiverId.role },
      isFromMe: msg.senderId._id.toString() === req.user.id
    }));

    res.json({
      conversation: {
        workshop: { id: workshop._id, title: workshop.title, date: workshop.date },
        student: { id: student._id, name: student.name, email: student.email }
      },
      messages: formattedMessages.reverse(), // oldest first
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: messages.length === parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark messages as read (bulk)
exports.markMessagesAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;
    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({ message: 'messageIds array is required' });
    }

    // Filter and cast to ObjectId safely
    const ids = messageIds.filter(isValidObjectId).map(id => new Types.ObjectId(id));
    if (ids.length === 0) {
      return res.status(400).json({ message: 'No valid messageIds provided' });
    }

    const result = await Message.updateMany(
      { _id: { $in: ids }, receiverId: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json({
      message: 'Messages marked as read',
      updatedCount: result.modifiedCount || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
