const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware'); // must set req.user
const mongoose = require('mongoose');

// Simple admin-only guard
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// All admin routes are protected
router.use(auth, requireAdmin);

// Dashboard & analytics
router.get('/dashboard/stats', adminController.getDashboardStats);

// Users
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUserDetail);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/approve', adminController.approveInstructor);
router.put('/users/:id/deactivate', adminController.deactivateUser);

// Workshops
router.get('/workshops', adminController.listWorkshops);
router.get('/workshops/:id', adminController.getWorkshopDetail);
router.put('/workshops/:id/status', adminController.updateWorkshopStatus); // publish/unpublish
router.delete('/workshops/:id', adminController.deleteWorkshop);

// Quizzes
router.get('/quizzes', adminController.listQuizzes);
router.get('/workshops/:id/quiz', adminController.getWorkshopQuizAdmin);
router.delete('/workshops/:id/quiz', adminController.deleteWorkshopQuiz);

// Results & certificates (read-only moderation)
router.get('/results', adminController.listResults);

// Messages moderation
router.get('/messages', adminController.listMessages);
router.delete('/messages/:id', adminController.deleteMessage);

module.exports = router;
