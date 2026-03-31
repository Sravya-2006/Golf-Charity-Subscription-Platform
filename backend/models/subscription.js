const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['monthly', 'yearly'], required: true },
  status: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'active' },
  amount: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  stripeCustomerId: { type: String, default: '' },
  stripeSubscriptionId: { type: String, default: '' },
  charityContribution: {
    charityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
    percentage: { type: Number, default: 10 },
    amount: { type: Number, default: 0 },
  },
  prizePoolContribution: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);