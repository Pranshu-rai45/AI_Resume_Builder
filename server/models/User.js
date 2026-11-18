const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  theme: {
    type: String,
    enum: ['dark', 'light'],
    default: 'dark'
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpires: {
    type: Date,
    select: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  aiUsageCount: {
    type: Number,
    default: 0
  },
  aiUsageLimit: {
    type: Number,
    default: 10 // free tier: 10 AI generations/month
  },
  aiUsageResetDate: {
    type: Date,
    default: () => new Date(new Date().setMonth(new Date().getMonth() + 1))
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if AI usage limit is exceeded
userSchema.methods.canUseAI = function() {
  // Reset monthly usage if needed
  if (new Date() > this.aiUsageResetDate) {
    this.aiUsageCount = 0;
    this.aiUsageResetDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
    this.save();
  }
  if (this.plan === 'pro' || this.plan === 'enterprise' || this.role === 'admin') return true;
  return this.aiUsageCount < this.aiUsageLimit;
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.emailVerificationToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
