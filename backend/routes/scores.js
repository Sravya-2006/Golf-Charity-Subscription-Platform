// @ts-nocheck
const express = require('express');
const router = express.Router();
const User = require('../models/User');
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

// Add a score
router.post('/', auth, async (req, res) => {
  try {
    const { score, date } = req.body;

    if (score < 1 || score > 45) {
      return res.status(400).json({ message: 'Score must be between 1 and 45' });
    }

    const user = await User.findById(req.userId);

    user.scores.unshift({ score, date: date || new Date() });

    // Keep only latest 5 scores
    if (user.scores.length > 5) {
      user.scores = user.scores.slice(0, 5);
    }

    await user.save();
    res.json({ message: 'Score added successfully', scores: user.scores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all scores for user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit a score
router.put('/:scoreId', auth, async (req, res) => {
  try {
    const { score, date } = req.body;

    if (score < 1 || score > 45) {
      return res.status(400).json({ message: 'Score must be between 1 and 45' });
    }

    const user = await User.findById(req.userId);
    const scoreIndex = user.scores.findIndex(s => s._id.toString() === req.params.scoreId);

    if (scoreIndex === -1) return res.status(404).json({ message: 'Score not found' });

    user.scores[scoreIndex].score = score;
    user.scores[scoreIndex].date = date || user.scores[scoreIndex].date;

    await user.save();
    res.json({ message: 'Score updated', scores: user.scores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a score
router.delete('/:scoreId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.scores = user.scores.filter(s => s._id.toString() !== req.params.scoreId);
    await user.save();
    res.json({ message: 'Score deleted', scores: user.scores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;