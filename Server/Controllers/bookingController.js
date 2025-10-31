const mongoose = require('mongoose');
const ExperienceBooking = require('../Models/experienceBooking.js');
const Experience = require('../Models/experience.js');


// API to Create an experience booking (lightweight) - no car required
const createExperienceBooking = async (req, res) => {
    try {
        const {
            experienceId,
            experienceName,
            date,
            time,
            qty = 1,
            pricePerUnit,
            subtotal,
            taxes,
            total,
            customerName,
            customerEmail,
        } = req.body;

        if (!experienceName || !date || !pricePerUnit || !subtotal || !total) {
            return res.status(400).json({ success: false, message: 'Missing required fields for experience booking' });
        }

        // Simplified behavior: accept bookings without heavy capacity checks.
        // If an experienceId looks like a Mongo ObjectId, attempt to confirm it exists and use it.
        // For demo/non-ObjectId ids (e.g. 'exp_003') we won't attempt lookups to avoid CastErrors.
        let experienceRef = null;
        if (experienceId) {
            if (mongoose.Types.ObjectId.isValid(experienceId)) {
                const found = await Experience.findById(experienceId).select('_id');
                if (found) experienceRef = found._id;
                // if not found, we still allow the booking (demo/soft mode)
            } else {
                // demo id or external id: don't try to cast or lookup
                experienceRef = null;
            }
        }

        // create a unique reference
        const bookingRef = 'EXP' + Date.now() + Math.floor(Math.random() * 900 + 100);

        const doc = await ExperienceBooking.create({
            experience: experienceRef,
            experienceName,
            date,
            time,
            qty,
            pricePerUnit,
            subtotal,
            taxes,
            total,
            customerName,
            customerEmail,
            bookingRef
        });

        return res.status(201).json({ success: true, bookingRef: doc.bookingRef, booking: doc });
    } catch (error) {
        console.error('createExperienceBooking error', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createExperienceBooking,
};