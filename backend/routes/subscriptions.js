// @ts-nocheck
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Subscribe
router.post('/', auth, async (req, res) => {
  try {
    const { plan, charityId, contributionPercentage } = req.body;

    const amount = plan === 'monthly' ? 999 : 9999;
    const endDate = new Date();
    if (plan === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
    else endDate.setFullYear(endDate.getFullYear() + 1);

    const charityAmount = (amount * (contributionPercentage || 10)) / 100;
    const prizePoolAmount = amount - charityAmount;

    const subscription = new Subscription({
      userId: req.userId,
      plan,
      amount,
      endDate,
      charityContribution: {
        charityId,
        percentage: contributionPercentage || 10,
        amount: charityAmount,
      },
      prizePoolContribution: prizePoolAmount,
    });

    await subscription.save();

    // Update user
    await User.findByIdAndUpdate(req.userId, {
      'subscription.plan': plan,
      'subscription.status': 'active',
      'subscription.startDate': new Date(),
      'subscription.endDate': endDate,
      'charity.charityId': charityId,
      'charity.contributionPercentage': contributionPercentage || 10,
    });

    res.status(201).json({ message: 'Subscription activated!', subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get subscription status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('charity.charityId');
    res.json(user.subscription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel subscription
router.put('/cancel', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      'subscription.status': 'cancelled',
    });

    await Subscription.findOneAndUpdate(
      { userId: req.userId, status: 'active' },
      { status: 'cancelled' }
    );

    res.json({ message: 'Subscription cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all subscriptions (admin)
router.get('/all', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('userId', 'name email')
      .populate('charityContribution.charityId', 'name');
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;