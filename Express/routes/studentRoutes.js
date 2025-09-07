const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');

// Public routes (no authentication required)
router.get('/workshops', studentController.getPublicWorkshops);
router.get('/workshops/:id', studentController.getWorkshopDetail);

// Protected routes (student authentication required)
router.use(auth);

// Workshop enrollment and access
router.post('/workshops/:id/enroll', studentController.enrollInWorkshop);
router.get('/my-workshops', studentController.getMyWorkshops);

// Workshop session (video player page)
router.get('/workshops/:workshopId/session', studentController.getWorkshopSession);

// Messaging system
router.post('/workshops/:workshopId/message', studentController.sendMessageToInstructor);
router.get('/workshops/:workshopId/messages', studentController.getMessages);
router.get('/conversations', studentController.getConversations);

// Quiz system
router.get('/workshops/:workshopId/quiz', studentController.getWorkshopQuiz);
router.post('/workshops/:workshopId/quiz/submit', studentController.submitQuiz);
router.get('/workshops/:workshopId/quiz/result', studentController.getQuizResult);

// Student profile management
router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.post('/change-password', studentController.changePassword);

// Certificates - using existing certificate system
router.get('/certificates', studentController.getCertificates);
router.get('/certificates/:resultId/download', studentController.downloadCertificate);

// Dashboard
router.get('/dashboard/stats', studentController.getDashboardStats);

// File downloads
router.get('/workshops/:workshopId/files/:fileId/download', studentController.downloadWorkshopFile);


router.get('/debug-profile', studentController.debugProfile);

module.exports = router;
