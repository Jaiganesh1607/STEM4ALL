const Workshop = require('../models/Workshop');
const User = require('../models/User');
const StudentProgress = require('../models/StudentProgress');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const Achievement = require('../models/Achievement'); // fixed
const Message = require('../models/Message');
const { generateCertificate } = require('../utils/certificateGenerator');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const fs = require('fs');

// ---------------------- Public Routes ----------------------

// Browse/landing workshops with filters + pagination
exports.getPublicWorkshops = async (req, res) => {
  try {
    const { search, topic, instructor, date, limit = 12, page = 1 } = req.query;

    const query = {
      status: 'published',
      date: { $gte: new Date() }
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (topic) {
      query.title = { $regex: topic, $options: 'i' };
    }

    if (instructor) {
      const inst = await User.findOne({
        name: { $regex: instructor, $options: 'i' },
        role: 'instructor'
      });
      if (inst) query.createdBy = inst._id;
    }

    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      query.date = { $gte: d, $lt: next };
    }

    const lim = Math.min(parseInt(limit), 50);
    const pg = Math.max(parseInt(page), 1);

    const [workshops, total] = await Promise.all([
      Workshop.find(query)
        .populate('createdBy', 'name email')
        .sort({ date: 1 })
        .limit(lim)
        .skip((pg - 1) * lim),
      Workshop.countDocuments(query)
    ]);

    const formatted = workshops.map(w => ({
      id: w._id,
      title: w.title,
      description: w.description,
      date: w.date,
      instructor: { name: w.createdBy.name, email: w.createdBy.email },
      hasResources: (w.resourceFiles?.length || 0) > 0 || !!w.resourceLink,
      enrollmentCount: 0
    }));

    res.json({
      workshops: formatted,
      pagination: {
        total,
        page: pg,
        pages: Math.ceil(total / lim),
        limit: lim
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Featured workshops (landing hero)
exports.getFeaturedWorkshops = async (_req, res) => {
  try {
    const workshops = await Workshop.find({
      status: 'published',
      date: { $gte: new Date() }
    })
      .populate('createdBy', 'name email')
      .sort({ date: 1 })
      .limit(6);

    const formatted = workshops.map(w => ({
      id: w._id,
      title: w.title,
      description: w.description,
      date: w.date,
      instructor: { name: w.createdBy.name, email: w.createdBy.email },
      hasResources: (w.resourceFiles?.length || 0) > 0 || !!w.resourceLink
    }));

    res.json({ workshops: formatted, total: formatted.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public workshop detail (adds isEnrolled if req.user set by auth)
exports.getWorkshopDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const workshop = await Workshop.findById(id).populate('createdBy', 'name email');
    if (!workshop || workshop.status !== 'published') {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    const enrollmentCount = await StudentProgress.countDocuments({ workshopId: id });

    let isEnrolled = false;
    let userProgress = null;
    if (req.user) {
      const progress = await StudentProgress.findOne({
        studentId: req.user.id,
        workshopId: id
      });
      if (progress) {
        isEnrolled = true;
        userProgress = {
          progress: progress.progress,
          status: progress.status,
          enrollmentDate: progress.enrollmentDate,
          lastActivity: progress.lastActivity
        };
      }
    }

    const hasQuiz = await Quiz.exists({ workshopId: id });

    res.json({
      id: workshop._id,
      title: workshop.title,
      description: workshop.description,
      date: workshop.date,
      videoLink: workshop.videoLink,
      resourceLink: workshop.resourceLink,
      instructor: { name: workshop.createdBy.name, email: workshop.createdBy.email },
      enrollmentCount,
      isEnrolled,
      userProgress,
      hasQuiz: !!hasQuiz,
      resourceFiles: (workshop.resourceFiles || []).map(file => ({
        id: file._id,
        filename: file.originalName,
        size: file.filesize,
        downloadUrl: `/api/student/workshops/${id}/files/${file._id}/download`
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------- Authenticated Student Routes ----------------------

// Enroll in a workshop
exports.enrollInWorkshop = async (req, res) => {
  try {
    const { id } = req.params;

    const w = await Workshop.findById(id);
    if (!w || w.status !== 'published') return res.status(404).json({ message: 'Workshop not found' });

    const exists = await StudentProgress.findOne({ studentId: req.user.id, workshopId: id });
    if (exists) return res.status(400).json({ message: 'Already enrolled in this workshop' });

    const progress = await StudentProgress.create({
      studentId: req.user.id,
      workshopId: id,
      status: 'enrolled'
    });

    res.status(201).json({
      message: 'Successfully enrolled in workshop',
      enrollment: {
        workshopId: id,
        enrollmentDate: progress.enrollmentDate,
        status: progress.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List my workshops
exports.getMyWorkshops = async (req, res) => {
  try {
    const { status } = req.query;
    const q = { studentId: req.user.id };
    if (status) q.status = status;

    const enrollments = await StudentProgress.find(q)
      .populate({
        path: 'workshopId',
        populate: { path: 'createdBy', select: 'name email' }
      })
      .sort({ enrollmentDate: -1 });

    const out = enrollments
      .filter(e => e.workshopId)
      .map(e => ({
        id: e.workshopId._id,
        title: e.workshopId.title,
        description: e.workshopId.description,
        date: e.workshopId.date,
        instructor: { name: e.workshopId.createdBy.name, email: e.workshopId.createdBy.email },
        enrollment: {
          progress: e.progress,
          status: e.status,
          enrollmentDate: e.enrollmentDate,
          lastActivity: e.lastActivity
        }
      }));

    res.json(out);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Session player data (YouTube/Zoom/direct detection)
exports.getWorkshopSession = async (req, res) => {
  try {
    const { workshopId } = req.params;

    const enrollment = await StudentProgress.findOne({ studentId: req.user.id, workshopId });
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this workshop' });

    const w = await Workshop.findById(workshopId).populate('createdBy', 'name email');
    if (!w) return res.status(404).json({ message: 'Workshop not found' });

    const url = w.videoLink || '';
    let type = 'unknown';
    let id = null;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      type = 'youtube';
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const m = url.match(regex);
      id = m ? m[1] : null;
    } else if (url.includes('zoom.us')) {
      type = 'zoom';
      id = url;
    } else if (url) {
      type = 'direct';
      id = url;
    }

    res.json({
      workshop: {
        id: w._id,
        title: w.title,
        description: w.description,
        date: w.date,
        instructor: { id: w.createdBy._id, name: w.createdBy.name, email: w.createdBy.email }
      },
      video: { type, id, originalUrl: url },
      enrollment: {
        progress: enrollment.progress,
        status: enrollment.status,
        enrollmentDate: enrollment.enrollmentDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get quiz (hide answerIndex)
exports.getWorkshopQuiz = async (req, res) => {
  try {
    const { workshopId } = req.params;

    const enrollment = await StudentProgress.findOne({ studentId: req.user.id, workshopId });
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this workshop' });

    const quiz = await Quiz.findOne({ workshopId });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const studentQuiz = {
      id: quiz._id,
      workshopId: quiz.workshopId,
      questions: quiz.questions.map((q, idx) => ({
        number: idx + 1,
        question: q.question,
        options: q.options
        // answerIndex intentionally hidden
      }))
    };

    res.json(studentQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit quiz (each question = 1 point)
exports.submitQuiz = async (req, res) => {
  try {
    const { workshopId } = req.params;
    const { answers } = req.body;

    const enrollment = await StudentProgress.findOne({ studentId: req.user.id, workshopId });
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this workshop' });

    const quiz = await Quiz.findOne({ workshopId });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const existing = await Result.findOne({ studentId: req.user.id, workshopId });
    if (existing) return res.status(400).json({ message: 'Quiz already completed' });

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'answers must be an array of indices' });
    }
    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({
        message: `answers length (${answers.length}) must equal number of questions (${quiz.questions.length})`
      });
    }

    let correct = 0;
    const total = quiz.questions.length;

    quiz.questions.forEach((q, idx) => {
      const picked = Number.isInteger(answers[idx]) ? answers[idx] : -1;
      const correctIdx = Number.isInteger(q.answerIndex) ? q.answerIndex : -999;
      if (picked === correctIdx) correct += 1;
    });

    if (total <= 0) return res.status(400).json({ message: 'Quiz is misconfigured: no questions' });

    const score = Math.round((correct / total) * 100);
    const passingThreshold = 60;
    const passed = score >= passingThreshold;

    const result = await Result.create({
      studentId: req.user.id,
      workshopId,
      score,
      passed
    });

    if (passed) {
      try {
        const w = await Workshop.findById(workshopId);
        const u = await User.findById(req.user.id);
        const certPath = await generateCertificate({
          studentName: u.name,
          workshopTitle: w.title,
          dateCompleted: new Date(),
          resultId: result._id
        });
        result.certificateUrl = certPath;
        await result.save();
      } catch (e) {
        console.error('Certificate generation failed:', e);
      }
    }

    enrollment.progress = 100;
    enrollment.status = passed ? 'completed' : 'in_progress';
    enrollment.lastActivity = new Date();
    await enrollment.save();

    res.json({
      message: 'Quiz submitted successfully',
      result: {
        score,
        passed,
        passingScore: passingThreshold,
        correctAnswers: correct,
        totalQuestions: total,
        certificateAvailable: passed
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Quiz result
exports.getQuizResult = async (req, res) => {
  try {
    const { workshopId } = req.params;

    const result = await Result.findOne({ studentId: req.user.id, workshopId })
      .populate('workshopId', 'title');
    if (!result) return res.status(404).json({ message: 'Quiz result not found' });

    const quiz = await Quiz.findOne({ workshopId });
    const passingThreshold = 60;

    res.json({
      result: {
        score: result.score,
        passed: result.passed,
        workshop: result.workshopId.title,
        completedAt: result.createdAt
      },
      quiz: {
        totalQuestions: quiz ? quiz.questions.length : 0,
        passingScore: passingThreshold
      },
      certificate: result.passed
        ? { available: true, downloadUrl: `/api/student/certificates/${result._id}/download` }
        : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Messaging
exports.sendMessageToInstructor = async (req, res) => {
  try {
    const { workshopId } = req.params;
    const { subject, message } = req.body;

    const enrollment = await StudentProgress.findOne({ studentId: req.user.id, workshopId });
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this workshop' });

    const w = await Workshop.findById(workshopId);
    if (!w) return res.status(404).json({ message: 'Workshop not found' });

    const msg = await Message.create({
      workshopId,
      senderId: req.user.id,
      receiverId: w.createdBy,
      subject: (subject || '').trim(),
      message: (message || '').trim()
    });

    res.status(201).json({
      message: 'Message sent successfully',
      messageData: {
        id: msg._id,
        subject: msg.subject,
        message: msg.message,
        sentAt: msg.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { workshopId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const enrollment = await StudentProgress.findOne({ studentId: req.user.id, workshopId });
    if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this workshop' });

    const w = await Workshop.findById(workshopId);
    if (!w) return res.status(404).json({ message: 'Workshop not found' });

    const lim = Math.min(parseInt(limit), 50);
    const pg = Math.max(parseInt(page), 1);

    const messages = await Message.find({
      workshopId,
      $or: [
        { senderId: req.user.id, receiverId: w.createdBy },
        { senderId: w.createdBy, receiverId: req.user.id }
      ]
    })
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(lim)
      .skip((pg - 1) * lim);

    await Message.updateMany(
      { workshopId, receiverId: req.user.id, senderId: w.createdBy, isRead: false },
      { isRead: true }
    );

    const formatted = messages.map(m => ({
      id: m._id,
      subject: m.subject,
      message: m.message,
      sentAt: m.createdAt,
      isRead: m.isRead,
      sender: { id: m.senderId._id, name: m.senderId.name, role: m.senderId.role },
      isFromMe: m.senderId._id.toString() === req.user.id
    }));

    res.json({
      messages: formatted.reverse(),
      pagination: { page: pg, limit: lim, hasMore: messages.length === lim }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(req.user.id) },
            { receiverId: new mongoose.Types.ObjectId(req.user.id) }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$workshopId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', new mongoose.Types.ObjectId(req.user.id)] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      { $lookup: { from: 'workshops', localField: '_id', foreignField: '_id', as: 'workshop' } },
      { $lookup: { from: 'users', localField: 'workshop.createdBy', foreignField: '_id', as: 'instructor' } },
      { $unwind: '$workshop' },
      { $unwind: '$instructor' }
    ]);

    const formatted = conversations.map(c => ({
      workshopId: c._id,
      workshop: { title: c.workshop.title, date: c.workshop.date },
      instructor: { id: c.instructor._id, name: c.instructor.name, email: c.instructor.email },
      lastMessage: {
        subject: c.lastMessage.subject,
        preview:
          (c.lastMessage.message || '').substring(0, 100) +
          ((c.lastMessage.message || '').length > 100 ? '...' : ''),
        sentAt: c.lastMessage.createdAt,
        isFromMe: c.lastMessage.senderId.toString() === req.user.id
      },
      unreadCount: c.unreadCount
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Profile - Returns complete profile data
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-passwordHash')
      .lean();
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile || {},
      createdAt: user.createdAt
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile - Properly merges nested objects
exports.updateProfile = async (req, res) => {
  try {
    const { name, profile } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update name if provided
    if (name) user.name = name;
    
    // ✅ CRITICAL: Merge existing profile with new data
    if (profile) {
      // Get existing profile as plain object and merge with new data
      const existingProfile = user.profile ? user.profile.toObject() : {};
      user.profile = { ...existingProfile, ...profile };
    }

    await user.save();

    // Return fresh data from database
    const updatedUser = await User.findById(req.user.id)
      .select('-passwordHash')
      .lean();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile: updatedUser.profile
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Certificates listing
exports.getCertificates = async (req, res) => {
  try {
    const certificates = await Result.find({ studentId: req.user.id, passed: true })
      .populate('workshopId', 'title description date')
      .sort({ createdAt: -1 });

    const formatted = certificates.map(cert => ({
      id: cert._id,
      workshop: { title: cert.workshopId.title, date: cert.workshopId.date },
      score: cert.score,
      earnedDate: cert.createdAt,
      downloadUrl: `/api/student/certificates/${cert._id}/download`,
      hasCertificate: !!cert.certificateUrl
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Certificate download (generate if missing)
exports.downloadCertificate = async (req, res) => {
  try {
    const { resultId } = req.params;

    const result = await Result.findById(resultId)
      .populate('workshopId', 'title')
      .populate('studentId', 'name');

    if (!result || result.studentId._id.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    if (!result.passed) {
      return res.status(400).json({ message: 'Certificate not available - workshop not passed' });
    }

    if (!result.certificateUrl || !fs.existsSync(result.certificateUrl)) {
      try {
        const certPath = await generateCertificate({
          studentName: result.studentId.name,
          workshopTitle: result.workshopId.title,
          dateCompleted: result.createdAt,
          resultId: result._id
        });
        result.certificateUrl = certPath;
        await result.save();
      } catch (e) {
        console.error('Certificate generation failed:', e);
        return res.status(500).json({ message: 'Failed to generate certificate' });
      }
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${resultId}.pdf`);
    fs.createReadStream(result.certificateUrl).pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// File download (resources)
exports.downloadWorkshopFile = async (req, res) => {
  try {
    const { workshopId, fileId } = req.params;

    if (req.user) {
      const enrollment = await StudentProgress.findOne({ studentId: req.user.id, workshopId });
      if (!enrollment) return res.status(403).json({ message: 'Not enrolled in this workshop' });
    }

    const w = await Workshop.findById(workshopId);
    if (!w) return res.status(404).json({ message: 'Workshop not found' });

    const f = w.resourceFiles.id(fileId);
    if (!f) return res.status(404).json({ message: 'File not found' });

    if (!fs.existsSync(f.filepath)) return res.status(404).json({ message: 'File not found on server' });

    res.setHeader('Content-Type', f.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${f.originalName}"`);
    fs.createReadStream(f.filepath).pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student dashboard stats
// Get student dashboard stats  
exports.getDashboardStats = async (req, res) => {
  try {
    // Total enrollments
    const totalEnrollments = await StudentProgress.countDocuments({
      studentId: req.user.id
    });

    // Completed workshops
    const completedWorkshops = await StudentProgress.countDocuments({
      studentId: req.user.id,
      status: 'completed'
    });

    // In Progress = enrolled + in_progress (both are "not completed")
    const inProgressWorkshops = await StudentProgress.countDocuments({
      studentId: req.user.id,
      status: { $in: ['enrolled', 'in_progress'] }  // ✅ Include both statuses
    });

    // Quiz stats
    const quizResults = await Result.find({ studentId: req.user.id });
    const averageScore = quizResults.length > 0
      ? Math.round(
          quizResults.reduce((sum, r) => sum + (Number.isFinite(r.score) ? r.score : 0), 0) /
          quizResults.length
        )
      : 0;

    const passedQuizzes = quizResults.filter(r => !!r.passed).length;

    res.json({
      enrollments: {
        total: totalEnrollments,
        completed: completedWorkshops,
        inProgress: inProgressWorkshops  // ✅ Now includes 'enrolled' students
      },
      quizzes: {
        total: quizResults.length,
        passed: passedQuizzes,
        averageScore
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to studentController.js - TEMPORARY DEBUG ENDPOINT
exports.debugProfile = async (req, res) => {
  try {
    // Get raw data from MongoDB (no Mongoose processing)
    const user = await User.findById(req.user.id).lean();
    
    console.log('=== PROFILE DEBUG ===');
    console.log('Full user document:', JSON.stringify(user, null, 2));
    console.log('Profile field:', JSON.stringify(user.profile, null, 2));
    console.log('Profile keys:', user.profile ? Object.keys(user.profile) : 'undefined');
    
    res.json({
      message: 'Debug info logged to console',
      databaseProfile: user.profile,
      profileKeys: user.profile ? Object.keys(user.profile) : [],
      fullDocument: user
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
