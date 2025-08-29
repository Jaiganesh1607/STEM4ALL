const workshopController = require('./workshopController');
const quizController = require('./quizController');
const analyticsController = require('./analyticsController');
const certificateController = require('./certificateController');

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

// Certificate handling
exports.streamCertificate = certificateController.streamCertificate;
exports.getCertificateUrl = certificateController.getCertificateUrl;
