const Experience = require('../Models/experience.js');

// Public endpoint to list available experiences (keeps compatibility with old /user/cars route)
const getUserCars = async (req, res) => {
  try {
    const experiences = await Experience.find({ isAvailable: true });
    return res.status(200).json({ success: true, cars: experiences });
  } catch (error) {
    console.error('Error getting experiences:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

module.exports = { getUserCars };
