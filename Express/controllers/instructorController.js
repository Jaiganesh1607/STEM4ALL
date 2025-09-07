const workshopController = require('./workshopController');
const quizController = require('./quizController');
const analyticsController = require('./analyticsController');
const certificateController = require('./certificateController');
const instructorMessagingController = require('./instructorMessagingController');

// Dashboard endpoints
exports.getDashboardStats = analyticsController.getDashboardStats;
exports.getUpcomingWorkshops = workshopController.getUpcomingWorkshops;
exports.getStudentAnalytics = analyticsController.getStudentAnalytics;

// Workshop management
exports.createWorkshop = workshopController.createWorkshop;
exports.listMyWorkshops = workshopController.listMyWorkshops;
exports.getWorkshopDetail = workshopController.getWorkshopDetail;
exports.updateWorkshop = workshopController.updateWorkshop;
exports.deleteWorkshop = workshopController.deleteWorkshop;

// Quiz management  
exports.createOrUpdateQuiz = quizController.createOrUpdateQuiz;
exports.getQuiz = quizController.getQuiz;
exports.getAttempts = quizController.getAttempts;

// Student analytics
exports.getStudentsList = analyticsController.getStudentsList;
exports.searchStudents = analyticsController.searchStudents;
exports.getWorkshopStudents = analyticsController.getWorkshopStudents;
exports.getStudentProgress = analyticsController.getStudentProgress;

// NEW: Messaging system
exports.getInstructorMessages = instructorMessagingController.getInstructorMessages;
exports.replyToStudent = instructorMessagingController.replyToStudent;
exports.getConversationWithStudent = instructorMessagingController.getConversationWithStudent;
exports.markMessagesAsRead = instructorMessagingController.markMessagesAsRead;

// Certificate handling
exports.streamCertificate = certificateController.streamCertificate;
exports.getCertificateUrl = certificateController.getCertificateUrl;
