// ATS Score calculation service

const ATS_KEYWORDS = {
  technical: ['javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker', 'git', 'api', 'typescript', 'mongodb', 'postgresql', 'redis', 'kubernetes', 'ci/cd', 'agile', 'scrum'],
  action_verbs: ['led', 'developed', 'implemented', 'managed', 'created', 'designed', 'built', 'improved', 'increased', 'reduced', 'optimized', 'delivered', 'achieved', 'launched', 'coordinated'],
  metrics: ['%', '$', 'million', 'thousand', 'users', 'clients', 'revenue', 'performance', 'efficiency', 'growth'],
  soft_skills: ['communication', 'leadership', 'teamwork', 'problem-solving', 'collaboration', 'analytical', 'strategic', 'innovative']
};

const calculateATSScore = (resumeData) => {
  let score = 0;
  const issues = [];
  const strengths = [];
  const suggestions = [];
  const foundKeywords = [];
  const missingKeywords = [];

  const resumeText = JSON.stringify(resumeData).toLowerCase();

  // 1. Contact Information (15 points)
  const personal = resumeData.personalDetails || {};
  let contactScore = 0;
  if (personal.email) { contactScore += 5; strengths.push('Email address included'); }
  else { issues.push('Missing email address'); suggestions.push('Add your email address'); }
  if (personal.phone) { contactScore += 5; }
  else { issues.push('Missing phone number'); suggestions.push('Add your phone number'); }
  if (personal.location || personal.city) { contactScore += 3; }
  if (personal.linkedin) { contactScore += 2; strengths.push('LinkedIn profile included'); }
  score += contactScore;

  // 2. Professional Summary (10 points)
  if (personal.summary && personal.summary.length > 50) {
    score += 10;
    strengths.push('Professional summary present');
  } else {
    issues.push('Missing or too short professional summary');
    suggestions.push('Add a compelling professional summary (3-4 sentences)');
  }

  // 3. Work Experience (25 points)
  const experience = resumeData.experience || [];
  if (experience.length > 0) {
    score += 10;
    strengths.push('Work experience section present');
    
    let descScore = 0;
    experience.forEach(exp => {
      if (exp.description && exp.description.length > 100) descScore += 5;
      if (exp.company && exp.position) descScore += 2;
    });
    score += Math.min(descScore, 15);

    // Check for action verbs
    const actionVerbsFound = ATS_KEYWORDS.action_verbs.filter(verb => resumeText.includes(verb));
    if (actionVerbsFound.length >= 5) {
      score += 5;
      strengths.push(`Strong action verbs used: ${actionVerbsFound.slice(0, 3).join(', ')}`);
    } else {
      suggestions.push('Use more action verbs (e.g., Led, Developed, Implemented)');
    }
  } else {
    issues.push('No work experience listed');
    suggestions.push('Add your work experience with detailed descriptions');
  }

  // 4. Education (10 points)
  const education = resumeData.education || [];
  if (education.length > 0) {
    score += 10;
    strengths.push('Education section present');
  } else {
    issues.push('No education listed');
    suggestions.push('Add your educational background');
  }

  // 5. Skills (15 points)
  const skills = resumeData.skills || [];
  if (skills.length > 0) {
    score += 10;
    strengths.push('Skills section present');
    
    const techKeywordsFound = ATS_KEYWORDS.technical.filter(kw => resumeText.includes(kw));
    foundKeywords.push(...techKeywordsFound);
    
    if (techKeywordsFound.length >= 5) {
      score += 5;
      strengths.push('Good technical skills coverage');
    } else {
      ATS_KEYWORDS.technical.filter(kw => !resumeText.includes(kw)).slice(0, 5).forEach(kw => missingKeywords.push(kw));
      suggestions.push('Add more relevant technical skills');
    }
  } else {
    issues.push('No skills section');
    suggestions.push('Add a comprehensive skills section');
  }

  // 6. Quantifiable Achievements (10 points)
  const metricsFound = ATS_KEYWORDS.metrics.filter(metric => resumeText.includes(metric));
  if (metricsFound.length >= 3) {
    score += 10;
    strengths.push('Good use of quantifiable metrics');
  } else if (metricsFound.length > 0) {
    score += 5;
    suggestions.push('Add more quantifiable achievements (numbers, percentages, dollar amounts)');
  } else {
    issues.push('No quantifiable achievements found');
    suggestions.push('Quantify your achievements (e.g., "Increased sales by 30%")');
  }

  // 7. Projects (5 points)
  const projects = resumeData.projects || [];
  if (projects.length > 0) {
    score += 5;
    strengths.push('Projects section adds value');
  }

  // 8. Certifications (5 points)
  const certs = resumeData.certifications || [];
  if (certs.length > 0) {
    score += 5;
    strengths.push('Certifications add credibility');
  }

  // 9. Length check
  const totalWords = resumeText.split(/\s+/).length;
  if (totalWords < 200) {
    issues.push('Resume appears too short');
    suggestions.push('Expand your resume content for better ATS performance');
    score = Math.max(score - 5, 0);
  } else if (totalWords > 1000) {
    suggestions.push('Consider condensing your resume to 1-2 pages');
  }

  // Ensure score is 0-100
  score = Math.min(Math.max(Math.round(score), 0), 100);

  return {
    score,
    strengths: strengths.slice(0, 5),
    formattingIssues: issues.slice(0, 5),
    suggestions: suggestions.slice(0, 6),
    missingKeywords: missingKeywords.slice(0, 8),
    foundKeywords: foundKeywords.slice(0, 10),
    lastChecked: new Date()
  };
};

module.exports = { calculateATSScore };
