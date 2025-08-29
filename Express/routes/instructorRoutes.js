const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const requireApprovedInstructor = require('../middleware/roleMiddleware');

// Import the main instructor controller (delegation layer)
const instructorController = require('../controllers/instructorController');

// Apply auth + role check to all instructor routes
router.use(auth);
router.use(requireApprovedInstructor);

// Dashboard Analytics
router.get('/dashboard/stats', instructorController.getDashboardStats);
router.get('/dashboard/upcoming', instructorController.getUpcomingWorkshops);
router.get('/dashboard/analytics', instructorController.getStudentAnalytics);

// Workshop management
router.post('/workshops', instructorController.createWorkshop);
router.get('/workshops', instructorController.listMyWorkshops);
router.get('/workshops/:id', instructorController.getWorkshopDetail);
router.put('/workshops/:id', instructorController.updateWorkshop);
router.delete('/workshops/:id', instructorController.deleteWorkshop);

// Quiz management
router.post('/workshops/:workshopId/quiz', instructorController.createOrUpdateQuiz);
router.get('/workshops/:workshopId/quiz', instructorController.getQuiz);

// Student management and analytics
router.get('/students', instructorController.getStudentsList);
router.get('/students/search', instructorController.searchStudents);
router.get('/workshops/:workshopId/students', instructorController.getWorkshopStudents);
router.get('/workshops/:workshopId/attempts', instructorController.getAttempts);
router.get('/students/:studentId/progress', instructorController.getStudentProgress);

// Certificate routes
router.get('/certificates/:resultId', instructorController.streamCertificate);
router.get('/certificates/:resultId/url', instructorController.getCertificateUrl);

module.exports = router;
