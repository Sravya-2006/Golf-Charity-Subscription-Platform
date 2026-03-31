// @ts-nocheck
const express = require('express');
const router = express.Router();
const Charity = require('../models/Charity');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all charities (public)
router.get('/', async (req, res) => {
  try {
    const charities = await Charity.find({ active: true });
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get featured charities
router.get('/featured', async (req, res) => {
  try {
    const charities = await Charity.find({ featured: true, active: true });
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single charity
router.get('/:id', async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity) return res.status(404).json({ message: 'Charity not found' });
    res.json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create charity (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const charity = new Charity(req.body);
    await charity.save();
    res.status(201).json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update charity (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete charity (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin only' });
    await Charity.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ message: 'Charity removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;