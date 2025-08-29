const Result = require('../models/Result');
const Workshop = require('../models/Workshop');
const User = require('../models/User');

// Get dashboard statistics (Total Enrollments, Average Progress)
exports.getDashboardStats = async (req, res) => {
  try {
    // Get instructor's workshops
    const query = req.user.role === 'admin' ? {} : { createdBy: req.user.id };
    const workshops = await Workshop.find(query);
    const workshopIds = workshops.map(w => w._id);

    // Total enrollments (count of all results for instructor's workshops)
    const totalEnrollments = await Result.countDocuments({ 
      workshopId: { $in: workshopIds } 
    });

    // Average student progress (average of all scores)
    const avgResult = await Result.aggregate([
      { $match: { workshopId: { $in: workshopIds } } },
      { $group: { _id: null, averageProgress: { $avg: '$score' } } }
    ]);

    const averageProgress = avgResult.length > 0 ? Math.round(avgResult[0].averageProgress) : 0;

    res.json({
      totalEnrollments,
      averageProgress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student analytics (weekly progress data)
exports.getStudentAnalytics = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { createdBy: req.user.id };
    const workshops = await Workshop.find(query);
    const workshopIds = workshops.map(w => w._id);

    // Get results from last 4 weeks
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const weeklyData = await Result.aggregate([
      { 
        $match: { 
          workshopId: { $in: workshopIds },
          createdAt: { $gte: fourWeeksAgo }
        } 
      },
      {
        $group: {
          _id: {
            week: { $week: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          averageScore: { $avg: '$score' }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } }
    ]);

    // Format data for frontend (Week 1, Week 2, etc.)
    const analytics = weeklyData.map((item, index) => ({
      week: `Week ${index + 1}`,
      progress: Math.round(item.averageScore)
    }));

    res.json({ analytics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get students list with search and filtering
exports.getStudentsList = async (req, res) => {
  try {
    const { search, workshopId, status } = req.query;
    
    // Get instructor's workshops if not admin
    const workshopQuery = req.user.role === 'admin' ? {} : { createdBy: req.user.id };
    const workshops = await Workshop.find(workshopQuery);
    const workshopIds = workshops.map(w => w._id);

    // Build match query for results
    let matchQuery = { workshopId: { $in: workshopIds } };
    if (workshopId) matchQuery.workshopId = workshopId;
    if (status === 'completed') matchQuery.passed = true;
    if (status === 'inprogress') matchQuery.passed = false;

    // Aggregate pipeline to get student data with progress
    const pipeline = [
      { $match: matchQuery },
      {
        $lookup: {
          from: 'users',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $group: {
          _id: '$studentId',
          studentName: { $first: '$student.name' },
          email: { $first: '$student.email' },
          averageScore: { $avg: '$score' },
          totalQuizzes: { $sum: 1 },
          passedQuizzes: {
            $sum: { $cond: [{ $eq: ['$passed', true] }, 1, 0] }
          }
        }
      }
    ];

    let students = await Result.aggregate(pipeline);

    // Apply search filter
    if (search) {
      students = students.filter(student => 
        student.studentName.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Format response
    const formattedStudents = students.map(student => ({
      id: student._id,
      studentName: student.studentName,
      email: student.email,
      progress: Math.round(student.averageScore),
      quizzes: `${student.passedQuizzes}/${student.totalQuizzes}`,
      overallScore: `${Math.round(student.averageScore)}%`
    }));

    res.json(formattedStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get students for a specific workshop
exports.getWorkshopStudents = async (req, res) => {
  try {
    const { workshopId } = req.params;
    
    // Check workshop ownership
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    
    const isOwner = workshop.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const students = await Result.find({ workshopId })
      .populate('studentId', 'name email')
      .sort({ score: -1 });

    const formattedStudents = students.map(result => ({
      id: result.studentId._id,
      studentName: result.studentId.name,
      email: result.studentId.email,
      progress: result.score,
      passed: result.passed,
      completedAt: result.createdAt
    }));

    res.json(formattedStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search students
exports.searchStudents = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      role: 'student',
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).limit(10).select('name email');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get individual student progress
exports.getStudentProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Get instructor's workshops
    const query = req.user.role === 'admin' ? {} : { createdBy: req.user.id };
    const workshops = await Workshop.find(query);
    const workshopIds = workshops.map(w => w._id);

    const progress = await Result.find({ 
      studentId, 
      workshopId: { $in: workshopIds } 
    }).populate('workshopId', 'title');

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
