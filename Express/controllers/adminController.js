const mongoose = require('mongoose');
const { Types, isValidObjectId } = mongoose;
const User = require('../models/User');
const Workshop = require('../models/Workshop');
const StudentProgress = require('../models/StudentProgress');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const Message = require('../models/Message');

// Helpers
const toInt = (v, d) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? d : n;
};
const oid = (id) => new Types.ObjectId(id);

// Dashboard: totals and derived metrics
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalStudents, totalInstructors, totalAdmins] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'instructor' }),
      User.countDocuments({ role: 'admin' })
    ]);
    const [totalWorkshops, publishedWorkshops, upcomingWorkshops] = await Promise.all([
      Workshop.countDocuments({}),
      Workshop.countDocuments({ status: 'published' }),
      Workshop.countDocuments({ date: { $gte: new Date() }, status: 'published' })
    ]);
    const [totalEnrollments, completedEnrollments, inProgressEnrollments] = await Promise.all([
      StudentProgress.countDocuments({}),
      StudentProgress.countDocuments({ status: 'completed' }),
      StudentProgress.countDocuments({ status: 'in_progress' })
    ]);
    const [totalResults, passedResults] = await Promise.all([
      Result.countDocuments({}),
      Result.countDocuments({ passed: true })
    ]);
    const passRate = totalResults > 0 ? Math.round((passedResults / totalResults) * 100) : 0;

    res.json({
      users: { total: totalUsers, students: totalStudents, instructors: totalInstructors, admins: totalAdmins },
      workshops: { total: totalWorkshops, published: publishedWorkshops, upcoming: upcomingWorkshops },
      enrollments: { total: totalEnrollments, completed: completedEnrollments, inProgress: inProgressEnrollments },
      quizzes: { totalResults, passedResults, passRate }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Users
exports.listUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const pg = toInt(page, 1);
    const lim = Math.min(toInt(limit, 20), 100);

    const q = {};
    if (role) q.role = role;
    if (search) {
      q.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      User.find(q).select('-passwordHash').sort({ createdAt: -1 }).limit(lim).skip((pg - 1) * lim),
      User.countDocuments(q)
    ]);

    res.json({ users: items, pagination: { total, page: pg, pages: Math.ceil(total / lim), limit: lim } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user id' });

    const user = await User.findById(id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const enrollments = await StudentProgress.countDocuments({ studentId: id });
    const results = await Result.find({ studentId: id }).sort({ createdAt: -1 }).limit(10);

    res.json({ user, stats: { enrollments, recentResults: results } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user id' });
    const allowed = ['student', 'instructor', 'admin'];
    if (!allowed.includes(role)) return res.status(400).json({ message: 'Invalid role' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = role;
    await user.save();

    res.json({ message: 'Role updated', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user id' });

    const user = await User.findById(id);
    if (!user || user.role !== 'instructor') return res.status(404).json({ message: 'Instructor not found' });
    user.approved = true;
    await user.save();

    res.json({ message: 'Instructor approved', user: { id: user._id, name: user.name, approved: user.approved } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { deactivate = true } = req.body;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user id' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Example soft-deactivation: set approved=false for instructors, or set a disabled flag if you have one
    if (user.role === 'instructor') user.approved = !deactivate ? true : false;
    // If you have a 'disabled' flag in schema, set it here

    await user.save();
    res.json({ message: deactivate ? 'User deactivated' : 'User reactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Workshops
exports.listWorkshops = async (req, res) => {
  try {
    const { status, instructor, search, page = 1, limit = 20 } = req.query;
    const pg = toInt(page, 1);
    const lim = Math.min(toInt(limit, 20), 100);

    const q = {};
    if (status) q.status = status;
    if (instructor && isValidObjectId(instructor)) q.createdBy = instructor;
    if (search) {
      q.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      Workshop.find(q).populate('createdBy', 'name email').sort({ createdAt: -1 }).limit(lim).skip((pg - 1) * lim),
      Workshop.countDocuments(q)
    ]);

    res.json({ workshops: items, pagination: { total, page: pg, pages: Math.ceil(total / lim), limit: lim } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWorkshopDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid workshop id' });

    const w = await Workshop.findById(id).populate('createdBy', 'name email');
    if (!w) return res.status(404).json({ message: 'Workshop not found' });

    const [enrollments, hasQuiz] = await Promise.all([
      StudentProgress.countDocuments({ workshopId: id }),
      Quiz.exists({ workshopId: id })
    ]);

    res.json({
      workshop: w,
      stats: { enrollments, hasQuiz: !!hasQuiz }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateWorkshopStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'published' | 'draft' | 'archived'
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid workshop id' });
    const allowed = ['published', 'draft', 'archived'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const w = await Workshop.findById(id);
    if (!w) return res.status(404).json({ message: 'Workshop not found' });
    w.status = status;
    await w.save();

    res.json({ message: 'Workshop status updated', status: w.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid workshop id' });

    // Consider cascade: remove quiz, results, progress optionally
    await Promise.all([
      Quiz.deleteOne({ workshopId: id }),
      Message.deleteMany({ workshopId: id })
    ]);
    await Workshop.deleteOne({ _id: id });

    res.json({ message: 'Workshop deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Quizzes
exports.listQuizzes = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pg = toInt(page, 1);
    const lim = Math.min(toInt(limit, 20), 100);

    const [items, total] = await Promise.all([
      Quiz.find({}).sort({ createdAt: -1 }).limit(lim).skip((pg - 1) * lim),
      Quiz.countDocuments({})
    ]);

    res.json({ quizzes: items, pagination: { total, page: pg, pages: Math.ceil(total / lim), limit: lim } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWorkshopQuizAdmin = async (req, res) => {
  try {
    const { id } = req.params; // workshopId
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid workshop id' });

    const quiz = await Quiz.findOne({ workshopId: id });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteWorkshopQuiz = async (req, res) => {
  try {
    const { id } = req.params; // workshopId
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid workshop id' });

    const del = await Quiz.deleteOne({ workshopId: id });
    if (del.deletedCount === 0) return res.status(404).json({ message: 'Quiz not found' });

    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Results
exports.listResults = async (req, res) => {
  try {
    const { student, workshop, passed, page = 1, limit = 20 } = req.query;
    const pg = toInt(page, 1);
    const lim = Math.min(toInt(limit, 20), 100);

    const q = {};
    if (student && isValidObjectId(student)) q.studentId = student;
    if (workshop && isValidObjectId(workshop)) q.workshopId = workshop;
    if (passed === 'true') q.passed = true;
    if (passed === 'false') q.passed = false;

    const [items, total] = await Promise.all([
      Result.find(q).populate('workshopId', 'title').populate('studentId', 'name email').sort({ createdAt: -1 }).limit(lim).skip((pg - 1) * lim),
      Result.countDocuments(q)
    ]);

    res.json({ results: items, pagination: { total, page: pg, pages: Math.ceil(total / lim), limit: lim } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Messages moderation
exports.listMessages = async (req, res) => {
  try {
    const { workshop, student, instructor, page = 1, limit = 20 } = req.query;
    const pg = toInt(page, 1);
    const lim = Math.min(toInt(limit, 20), 100);

    const q = {};
    if (workshop && isValidObjectId(workshop)) q.workshopId = workshop;
    if (student && isValidObjectId(student)) q.$or = [{ senderId: student }, { receiverId: student }];
    if (instructor && isValidObjectId(instructor)) {
      const clause = [{ senderId: instructor }, { receiverId: instructor }];
      q.$or = q.$or ? q.$or.concat(clause) : clause;
    }

    const [items, total] = await Promise.all([
      Message.find(q)
        .populate('senderId', 'name email role')
        .populate('receiverId', 'name email role')
        .populate('workshopId', 'title')
        .sort({ createdAt: -1 })
        .limit(lim)
        .skip((pg - 1) * lim),
      Message.countDocuments(q)
    ]);

    res.json({ messages: items, pagination: { total, page: pg, pages: Math.ceil(total / lim), limit: lim } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid message id' });

    const del = await Message.deleteOne({ _id: id });
    if (del.deletedCount === 0) return res.status(404).json({ message: 'Message not found' });

    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
