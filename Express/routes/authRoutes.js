const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Admin only routes
router.patch('/approve/:userId', auth, authController.approveInstructor);

module.exports = router;
