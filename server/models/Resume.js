const mongoose = require('mongoose');

const personalDetailsSchema = new mongoose.Schema({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  city: { type: String, default: '' },
  country: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  summary: { type: String, default: '' },
  objective: { type: String, default: '' },
  website: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  twitter: { type: String, default: '' },
  portfolio: { type: String, default: '' }
}, { _id: false });

const educationSchema = new mongoose.Schema({
  id: { type: String },
  institution: { type: String, default: '' },
  degree: { type: String, default: '' },
  fieldOfStudy: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  gpa: { type: String, default: '' },
  description: { type: String, default: '' },
  location: { type: String, default: '' }
});

const experienceSchema = new mongoose.Schema({
  id: { type: String },
  company: { type: String, default: '' },
  position: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  location: { type: String, default: '' },
  description: { type: String, default: '' },
  achievements: [{ type: String }]
});

const projectSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  technologies: [{ type: String }],
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  url: { type: String, default: '' },
  github: { type: String, default: '' },
  highlights: [{ type: String }]
});

const skillSchema = new mongoose.Schema({
  id: { type: String },
  category: { type: String, default: 'Technical Skills' },
  skills: [{ type: String }],
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' }
});

const achievementSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  date: { type: String, default: '' },
  issuer: { type: String, default: '' }
});

const certificationSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  issueDate: { type: String, default: '' },
  expiryDate: { type: String, default: '' },
  credentialId: { type: String, default: '' },
  url: { type: String, default: '' }
});

const languageSchema = new mongoose.Schema({
  id: { type: String },
  language: { type: String, default: '' },
  proficiency: {
    type: String,
    enum: ['Elementary', 'Limited Working', 'Professional Working', 'Full Professional', 'Native/Bilingual'],
    default: 'Professional Working'
  }
});

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Resume title is required'],
    trim: true,
    default: 'My Resume'
  },
  template: {
    type: String,
    enum: ['modern', 'professional', 'minimal', 'creative', 'corporate', 'latex'],
    default: 'latex'
  },
  colorScheme: {
    type: String,
    default: '#2563EB'
  },
  fontFamily: {
    type: String,
    default: 'Inter'
  },
  personalDetails: {
    type: personalDetailsSchema,
    default: {}
  },
  education: [educationSchema],
  experience: [experienceSchema],
  projects: [projectSchema],
  skills: [skillSchema],
  achievements: [achievementSchema],
  certifications: [certificationSchema],
  languages: [languageSchema],
  interests: [{ type: String }],
  customSections: [{
    id: { type: String },
    title: { type: String },
    content: { type: String }
  }],
  sectionOrder: {
    type: [String],
    default: ['personalDetails', 'summary', 'experience', 'education', 'projects', 'skills', 'achievements', 'certifications', 'languages', 'interests']
  },
  atsScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  atsDetails: {
    keywords: [String],
    missingKeywords: [String],
    suggestions: [String],
    formattingIssues: [String],
    strengths: [String],
    lastChecked: Date
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  shareToken: {
    type: String,
    default: null
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  isDraft: {
    type: Boolean,
    default: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastModified on save
resumeSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Index for faster queries
resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ shareToken: 1 });

module.exports = mongoose.model('Resume', resumeSchema);
