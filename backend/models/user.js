const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscription: {
    plan: { type: String, enum: ['none', 'monthly', 'yearly'], default: 'none' },
    status: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'inactive' },
    startDate: Date,
    endDate: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
  },
  charity: {
    charityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
    contributionPercentage: { type: Number, default: 10, min: 10, max: 100 },
  },
  scores: [
    {
      score: { type: Number, min: 1, max: 45 },
      date: { type: Date, default: Date.now },
    }
  ],
  totalWinnings: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);