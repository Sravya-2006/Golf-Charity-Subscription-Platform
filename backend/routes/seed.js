const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Charity = require('../models/Charity');
const bcrypt = require('bcryptjs');

router.get('/run', async (req, res) => {
  try {
    // Create admin
    const hash = await bcrypt.hash('admin123', 10);
    await User.findOneAndUpdate(
      { email: 'admin@golfgive.com' },
      { name: 'Admin', email: 'admin@golfgive.com', password: hash, role: 'admin' },
      { upsert: true, new: true }
    );

    // Create charities
    const charities = [
      { name: 'Childrens Education Fund', description: 'Providing quality education to underprivileged children across the globe. Every contribution helps build schools, train teachers, and supply learning materials.', featured: true, website: 'https://example.com' },
      { name: 'Mental Health Alliance', description: 'Breaking down barriers to mental health support. We fund counselling services, awareness campaigns, and crisis helplines for those in need.', featured: true, website: 'https://example.com' },
      { name: 'Ocean Conservation Trust', description: 'Protecting our oceans and marine life through clean-up initiatives, research, and education. Every round of golf helps keep our seas clean.', featured: false, website: 'https://example.com' },
      { name: 'Local Food Banks Network', description: 'Ensuring no family goes hungry. We support a network of food banks providing nutritious meals to those facing food poverty.', featured: false, website: 'https://example.com' },
      { name: 'Veterans Support Foundation', description: 'Supporting military veterans with housing, employment, and mental health services as they transition back to civilian life.', featured: true, website: 'https://example.com' },
      { name: 'Reforestation Project', description: 'Planting trees and restoring natural habitats worldwide. Your golf scores help us plant thousands of trees every month.', featured: false, website: 'https://example.com' },
    ];

    await Charity.deleteMany({});
    await Charity.insertMany(charities);

    res.json({ 
      message: '✅ Seed complete!',
      admin: 'admin@golfgive.com / admin123',
      charities: '6 charities created'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;