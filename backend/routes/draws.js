// @ts-nocheck
const express = require('express');
const router = express.Router();
const Draw = require('../models/Draw');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
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

// Generate random numbers for draw
const generateRandomNumbers = () => {
  const numbers = [];
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) numbers.push(num);
  }
  return numbers;
};

// Generate algorithmic numbers based on user scores
const generateAlgorithmicNumbers = async () => {
  const users = await User.find({ 'subscription.status': 'active' });
  const scoreFrequency = {};

  users.forEach(user => {
    user.scores.forEach(s => {
      scoreFrequency[s.score] = (scoreFrequency[s.score] || 0) + 1;
    });
  });

  const sorted = Object.entries(scoreFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => parseInt(entry[0]));

  const numbers = sorted.slice(0, 5);
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) numbers.push(num);
  }
  return numbers;
};

// Check matches for a user
const checkMatches = (userScores, winningNumbers) => {
  const scores = userScores.map(s => s.score);
  const matched = scores.filter(s => winningNumbers.includes(s));
  return matched;
};

// Get all published draws (public)
router.get('/', async (req, res) => {
  try {
    const draws = await Draw.find({ status: 'published' })
      .sort({ createdAt: -1 });
    res.json(draws);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single draw
router.get('/:id', async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id)
      .populate('winners.userId', 'name email');
    res.json(draw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new draw (admin)
router.post('/', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin only' });

    const { month, year, drawType } = req.body;

    const existing = await Draw.findOne({ month, year });
    if (existing) return res.status(400).json({ message: 'Draw already exists for this month' });

    // Calculate prize pool from active subscriptions
    const subscriptions = await Subscription.find({ status: 'active' });
    const totalPool = subscriptions.reduce((sum, sub) => sum + sub.prizePoolContribution, 0);

    // Get last draw for jackpot rollover
    const lastDraw = await Draw.findOne({ status: 'published' }).sort({ createdAt: -1 });
    const jackpotRollover = lastDraw?.prizePool?.jackpotRollover || 0;

    const fiveMatchPool = (totalPool * 0.4) + jackpotRollover;
    const fourMatchPool = totalPool * 0.35;
    const threeMatchPool = totalPool * 0.25;

    const draw = new Draw({
      month,
      year,
      drawType: drawType || 'random',
      prizePool: {
        total: totalPool,
        fiveMatch: fiveMatchPool,
        fourMatch: fourMatchPool,
        threeMatch: threeMatchPool,
        jackpotRollover: 0,
      }
    });

    await draw.save();
    res.status(201).json(draw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Simulate draw (admin)
router.post('/:id/simulate', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin only' });

    const draw = await Draw.findById(req.params.id);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });

    const winningNumbers = draw.drawType === 'algorithmic'
      ? await generateAlgorithmicNumbers()
      : generateRandomNumbers();

    // Find all active subscribers and check matches
    const users = await User.find({ 'subscription.status': 'active' });
    const winners = [];
    let hasFiveMatch = false;

    users.forEach(user => {
      const matched = checkMatches(user.scores, winningNumbers);
      if (matched.length >= 3) {
        let matchType;
        if (matched.length >= 5) { matchType = '5-match'; hasFiveMatch = true; }
        else if (matched.length === 4) matchType = '4-match';
        else matchType = '3-match';

        winners.push({
          userId: user._id,
          matchType,
          matchedNumbers: matched,
          paymentStatus: 'pending',
        });
      }
    });

    // Calculate prize per winner per tier
    const fiveWinners = winners.filter(w => w.matchType === '5-match');
    const fourWinners = winners.filter(w => w.matchType === '4-match');
    const threeWinners = winners.filter(w => w.matchType === '3-match');

    winners.forEach(w => {
      if (w.matchType === '5-match') w.prizeAmount = draw.prizePool.fiveMatch / (fiveWinners.length || 1);
      if (w.matchType === '4-match') w.prizeAmount = draw.prizePool.fourMatch / (fourWinners.length || 1);
      if (w.matchType === '3-match') w.prizeAmount = draw.prizePool.threeMatch / (threeWinners.length || 1);
    });

    // Jackpot rollover if no 5-match winner
    if (!hasFiveMatch) {
      draw.prizePool.jackpotRollover = draw.prizePool.fiveMatch;
    }

    draw.winningNumbers = winningNumbers;
    draw.winners = winners;
    draw.status = 'simulated';
    await draw.save();

    res.json(draw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Publish draw (admin)
router.put('/:id/publish', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin only' });

    const draw = await Draw.findByIdAndUpdate(
      req.params.id,
      { status: 'published' },
      { new: true }
    ).populate('winners.userId', 'name email');

    // Update winner total winnings
    for (const winner of draw.winners) {
      await User.findByIdAndUpdate(winner.userId, {
        $inc: { totalWinnings: winner.prizeAmount }
      });
    }

    res.json(draw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit winner proof
router.post('/:drawId/proof', auth, async (req, res) => {
  try {
    const { proofImage } = req.body;
    const draw = await Draw.findById(req.params.drawId);

    const winnerIndex = draw.winners.findIndex(
      w => w.userId.toString() === req.userId
    );

    if (winnerIndex === -1) return res.status(404).json({ message: 'Winner not found' });

    draw.winners[winnerIndex].proofSubmitted = true;
    draw.winners[winnerIndex].proofImage = proofImage;
    await draw.save();

    res.json({ message: 'Proof submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all draws (admin)
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const draws = await Draw.find().sort({ createdAt: -1 }).populate('winners.userId', 'name email');
    res.json(draws);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;