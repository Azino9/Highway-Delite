const Experience = require('../Models/experience.js');

// GET /api/experiences
const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, experiences });
  } catch (error) {
    console.error('getExperiences error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/experiences/:id
const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findById(id);
    if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });
    res.status(200).json({ success: true, experience });
  } catch (error) {
    console.error('getExperienceById error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dev helper: seed sample experiences if none exist
const seedExperiences = async (req, res) => {
  try {
    const count = await Experience.countDocuments();
    if (count > 0) return res.status(200).json({ success: true, message: 'Already seeded' });

    const samples = [
      {
        name: 'Sunrise Hike & Breakfast',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80&auto=format&fit=crop',
        description: 'A guided sunrise hike with breakfast at the summit.',
        about: 'Join a small-group guided hike and enjoy local breakfast with panoramic views.',
        pricePerPerson: 25,
        category: 'Hiking',
        location: 'San Francisco',
        times: [ { time: '06:00 am', capacity: 12 }, { time: '07:30 am', capacity: 8 } ]
      },
      {
        name: 'City Food Walk',
        image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&q=80&auto=format&fit=crop',
        description: 'Taste the best street food with a local guide.',
        about: 'Explore iconic neighbourhoods and enjoy curated tastings.',
        pricePerPerson: 45,
        category: 'Food',
        location: 'New York',
        times: [ { time: '11:00 am', capacity: 10 }, { time: '02:00 pm', capacity: 10 } ]
      }
    ];

    const created = await Experience.create(samples);
    res.status(201).json({ success: true, created });
  } catch (error) {
    console.error('seedExperiences error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getExperiences, getExperienceById, seedExperiences };
