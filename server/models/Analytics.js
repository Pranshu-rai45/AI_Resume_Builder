const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: String,
    required: true,
    enum: [
      'resume_created', 'resume_updated', 'resume_deleted', 'resume_downloaded',
      'ai_used', 'template_changed', 'ats_checked', 'resume_shared',
      'login', 'register', 'profile_updated'
    ]
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

analyticsSchema.index({ user: 1, event: 1, createdAt: -1 });
analyticsSchema.index({ event: 1, createdAt: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
