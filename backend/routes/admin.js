// @ts-nocheck
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Draw = require('../models/Draw');
const Charity = require('../models/Charity');
const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeSubscribers = await User.countDocuments({ 'subscription.status': 'active' });
    const totalCharities = await Charity.countDocuments({ active: true });
    const totalDraws = await Draw.countDocuments({ status: 'published' });

    const subscriptions = await Subscription.find({ status: 'active' });
    const totalPrizePool = subscriptions.reduce((sum, sub) => sum + sub.prizePoolContribution, 0);
    const totalCharityContributions = subscriptions.reduce((sum, sub) => sum + sub.charityContribution.amount, 0);
    const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

    res.json({
      totalUsers,
      activeSubscribers,
      totalCharities,
      totalDraws,
      totalPrizePool,
      totalCharityContributions,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .populate('charity.charityId', 'name');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single user
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('charity.charityId', 'name');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit user
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit user scores
router.put('/users/:id/scores', adminAuth, async (req, res) => {
  try {
    const { scores } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { scores },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Manage subscription
router.put('/users/:id/subscription', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { subscription: req.body },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all winners across draws
router.get('/winners', adminAuth, async (req, res) => {
  try {
    const draws = await Draw.find({ status: 'published' })
      .populate('winners.userId', 'name email');
    
    const winners = [];
    draws.forEach(draw => {
      draw.winners.forEach(winner => {
        winners.push({
          drawId: draw._id,
          month: draw.month,
          year: draw.year,
          winner,
        });
      });
    });

    res.json(winners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify winner
router.put('/winners/:drawId/:winnerId/verify', adminAuth, async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.drawId);
    const winnerIndex = draw.winners.findIndex(
      w => w._id.toString() === req.params.winnerId
    );

    if (winnerIndex === -1) return res.status(404).json({ message: 'Winner not found' });

    draw.winners[winnerIndex].verified = true;
    draw.winners[winnerIndex].paymentStatus = 'paid';
    await draw.save();

    res.json({ message: 'Winner verified and marked as paid' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get analytics
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const monthlySubscriptions = await Subscription.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$amount' },
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const charityStats = await Subscription.aggregate([
      {
        $group: {
          _id: '$charityContribution.charityId',
          totalContributions: { $sum: '$charityContribution.amount' },
          count: { $sum: 1 },
        }
      }
    ]);

    res.json({ monthlySubscriptions, charityStats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;