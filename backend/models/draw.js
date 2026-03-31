const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  winningNumbers: [{ type: Number }],
  drawType: { type: String, enum: ['random', 'algorithmic'], default: 'random' },
  status: { type: String, enum: ['pending', 'simulated', 'published'], default: 'pending' },
  prizePool: {
    total: { type: Number, default: 0 },
    fiveMatch: { type: Number, default: 0 },
    fourMatch: { type: Number, default: 0 },
    threeMatch: { type: Number, default: 0 },
    jackpotRollover: { type: Number, default: 0 },
  },
  winners: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      matchType: { type: String, enum: ['5-match', '4-match', '3-match'] },
      matchedNumbers: [Number],
      prizeAmount: { type: Number, default: 0 },
      paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
      proofSubmitted: { type: Boolean, default: false },
      proofImage: { type: String, default: '' },
      verified: { type: Boolean, default: false },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Draw', drawSchema);