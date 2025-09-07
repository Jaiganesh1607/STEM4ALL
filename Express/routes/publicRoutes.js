const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Landing page featured workshops (limited number)
router.get('/featured-workshops', studentController.getPublicWorkshops);

// Full workshops browsing page (with pagination and filters)
router.get('/workshops', studentController.getPublicWorkshops);

// Workshop detail page
router.get('/workshops/:id', studentController.getWorkshopDetail);

module.exports = router;
