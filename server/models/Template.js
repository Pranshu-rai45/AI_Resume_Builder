const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['modern', 'professional', 'minimal', 'creative', 'corporate'],
    required: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  colors: {
    primary: { type: String, default: '#2563EB' },
    secondary: { type: String, default: '#7C3AED' },
    text: { type: String, default: '#1F2937' },
    background: { type: String, default: '#FFFFFF' }
  },
  features: [{ type: String }],
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Template', templateSchema);
