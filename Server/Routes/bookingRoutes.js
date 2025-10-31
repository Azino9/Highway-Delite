const express = require('express');
const { createExperienceBooking } = require('../Controllers/bookingController');

const router = express.Router();

// POST /api/bookings/create-experience
router.post('/create-experience', createExperienceBooking);

module.exports = router;
