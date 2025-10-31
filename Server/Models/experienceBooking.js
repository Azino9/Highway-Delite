const mongoose = require('mongoose');

const experienceBookingSchema = new mongoose.Schema({
  experienceName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String },
  qty: { type: Number, default: 1 },
  pricePerUnit: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  taxes: { type: Number, default: 0 },
  total: { type: Number, required: true },
  customerName: { type: String },
  customerEmail: { type: String },
  bookingRef: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('ExperienceBooking', experienceBookingSchema);
