const { v4: uuidv4 } = require('uuid');
const Resume = require('../models/Resume');
const Analytics = require('../models/Analytics');

// @desc    Get all resumes for user
// @route   GET /api/resumes
// @access  Private
const getResumes = async (req, res, next) => {
  try {
    const { search, sort = '-updatedAt', page = 1, limit = 20 } = req.query;
    const query = { user: req.user._id };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'personalDetails.jobTitle': { $regex: search, $options: 'i' } }
      ];
    }

    const resumes = await Resume.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Resume.countDocuments(query);

    res.json({
      success: true,
      data: resumes,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }
    res.json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shared resume (public)
// @route   GET /api/resumes/share/:token
// @access  Public
const getSharedResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ shareToken: req.params.token, isPublic: true });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found or not public.' });
    }
    res.json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Create resume
// @route   POST /api/resumes
// @access  Private
const createResume = async (req, res, next) => {
  try {
    const { title, template } = req.body;

    // Check free plan limit
    if (req.user.plan === 'free') {
      const count = await Resume.countDocuments({ user: req.user._id });
      if (count >= 3) {
        return res.status(403).json({
          success: false,
          message: 'Free plan allows maximum 3 resumes. Upgrade to Pro for unlimited resumes.'
        });
      }
    }

    const resume = await Resume.create({
      user: req.user._id,
      title: title || 'My Resume',
      template: template || 'modern'
    });

    await Analytics.create({ user: req.user._id, event: 'resume_created', metadata: { resumeId: resume._id, title } });

    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    const allowedFields = [
      'title', 'template', 'colorScheme', 'fontFamily', 'personalDetails',
      'education', 'experience', 'projects', 'skills', 'achievements',
      'certifications', 'languages', 'interests', 'customSections',
      'sectionOrder', 'isDraft', 'isPublic'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        resume[field] = req.body[field];
      }
    });

    resume.lastModified = new Date();
    await resume.save();

    await Analytics.create({ user: req.user._id, event: 'resume_updated', metadata: { resumeId: resume._id } });

    res.json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    await Analytics.create({ user: req.user._id, event: 'resume_deleted', metadata: { resumeId: req.params.id } });

    res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
const duplicateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    const duplicateData = resume.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    delete duplicateData.shareToken;
    duplicateData.title = `${resume.title} (Copy)`;
    duplicateData.isPublic = false;
    duplicateData.downloadCount = 0;

    const duplicate = await Resume.create(duplicateData);

    res.status(201).json({ success: true, data: duplicate, message: 'Resume duplicated successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate share link
// @route   POST /api/resumes/:id/share
// @access  Private
const shareResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    if (!resume.shareToken) {
      resume.shareToken = uuidv4();
    }
    resume.isPublic = true;
    await resume.save();

    const shareUrl = `${process.env.CLIENT_URL}/resume/share/${resume.shareToken}`;

    await Analytics.create({ user: req.user._id, event: 'resume_shared', metadata: { resumeId: resume._id } });

    res.json({ success: true, shareUrl, shareToken: resume.shareToken });
  } catch (error) {
    next(error);
  }
};

// @desc    Track download
// @route   POST /api/resumes/:id/download
// @access  Private
const trackDownload = async (req, res, next) => {
  try {
    await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $inc: { downloadCount: 1 } }
    );

    await Analytics.create({ user: req.user._id, event: 'resume_downloaded', metadata: { resumeId: req.params.id } });

    res.json({ success: true, message: 'Download tracked.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get resume stats for dashboard
// @route   GET /api/resumes/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const [totalResumes, downloads, lastResume] = await Promise.all([
      Resume.countDocuments({ user: req.user._id }),
      Resume.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: null, total: { $sum: '$downloadCount' } } }
      ]),
      Resume.findOne({ user: req.user._id }).sort('-updatedAt').select('title updatedAt atsScore')
    ]);

    const avgATS = await Resume.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, avg: { $avg: '$atsScore' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalResumes,
        totalDownloads: downloads[0]?.total || 0,
        avgAtsScore: Math.round(avgATS[0]?.avg || 0),
        lastUpdated: lastResume?.updatedAt || null,
        lastResumeTitle: lastResume?.title || null
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getResumes, getResume, getSharedResume, createResume, updateResume, deleteResume, duplicateResume, shareResume, trackDownload, getStats };
