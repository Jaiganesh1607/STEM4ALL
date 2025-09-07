const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const requireApprovedInstructor = require('../middleware/roleMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

// Import the main instructor controller (delegation layer)
const instructorController = require('../controllers/instructorController');
const fileController = require('../controllers/fileController');

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

// File upload routes for workshops
router.post('/workshops/:workshopId/upload', uploadSingle, fileController.uploadWorkshopResource);
router.get('/workshops/:workshopId/files', fileController.listWorkshopFiles);
router.get('/workshops/:workshopId/files/:fileId/download', fileController.downloadWorkshopResource);
router.delete('/workshops/:workshopId/files/:fileId', fileController.deleteWorkshopResource);

// Quiz management
router.post('/workshops/:workshopId/quiz', instructorController.createOrUpdateQuiz);
router.get('/workshops/:workshopId/quiz', instructorController.getQuiz);

// Student management and analytics
router.get('/students', instructorController.getStudentsList);
router.get('/students/search', instructorController.searchStudents);
router.get('/workshops/:workshopId/students', instructorController.getWorkshopStudents);
router.get('/workshops/:workshopId/attempts', instructorController.getAttempts);
router.get('/students/:studentId/progress', instructorController.getStudentProgress);

// NEW: Messaging system routes
router.get('/messages', instructorController.getInstructorMessages);
router.post('/workshops/:workshopId/students/:studentId/reply', instructorController.replyToStudent);
router.get('/workshops/:workshopId/students/:studentId/messages', instructorController.getConversationWithStudent);
router.put('/messages/mark-read', instructorController.markMessagesAsRead);

// Certificate routes
router.get('/certificates/:resultId', instructorController.streamCertificate);
router.get('/certificates/:resultId/url', instructorController.getCertificateUrl);

module.exports = router;
