const Quiz = require('../models/Quiz');
const Workshop = require('../models/Workshop');
const Result = require('../models/Result');

// Create or update quiz for a workshop
exports.createOrUpdateQuiz = async (req, res) => {
  try {
    const { workshopId } = req.params;
    const { questions } = req.body;
    
    // Check workshop ownership
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    
    const isOwner = workshop.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Questions array is required' });
    }

    // Find existing quiz or create new one
    let quiz = await Quiz.findOne({ workshopId });
    if (quiz) {
      quiz.questions = questions;
      await quiz.save();
    } else {
      quiz = await Quiz.create({ workshopId, questions });
    }
    
    res.json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get quiz for editing (includes answers for instructor)
exports.getQuiz = async (req, res) => {
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

    const quiz = await Quiz.findOne({ workshopId });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student attempts for a workshop
exports.getAttempts = async (req, res) => {
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

    const attempts = await Result.find({ workshopId })
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
