const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  website: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  totalReceived: { type: Number, default: 0 },
  events: [
    {
      title: String,
      date: Date,
      description: String,
    }
  ],
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Charity', charitySchema);