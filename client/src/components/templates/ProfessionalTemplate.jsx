import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Linkedin, Github } from '../ui/BrandIcons';

const ProfessionalTemplate = ({ resumeData = {} }) => {
  const pd = resumeData.personalDetails || {};
  const primaryColor = resumeData.colorScheme || '#1E3A8A';

  return (
    <div className="bg-white p-8 min-h-[1123px]" style={{ fontFamily: resumeData.fontFamily || 'Georgia, serif' }}>
      {/* Header */}
      <div className="text-center border-b-2 pb-4 mb-5" style={{ borderColor: primaryColor }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{pd.firstName} {pd.lastName}</h1>
        <p className="text-gray-600 font-medium mb-3">{pd.jobTitle}</p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
          {pd.email && <span className="flex items-center gap-1"><Mail size={10} />{pd.email}</span>}
          {pd.phone && <span className="flex items-center gap-1"><Phone size={10} />{pd.phone}</span>}
          {(pd.city || pd.location) && <span className="flex items-center gap-1"><MapPin size={10} />{pd.city || pd.location}</span>}
          {pd.linkedin && <span className="flex items-center gap-1"><Linkedin size={10} />LinkedIn</span>}
          {pd.github && <span className="flex items-center gap-1"><Github size={10} />GitHub</span>}
        </div>
      </div>

      {/* Summary */}
      {pd.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>Professional Summary</h2>
          <p className="text-gray-600 text-xs leading-relaxed">{pd.summary}</p>
        </div>
      )}

      {/* Experience */}
      {(resumeData.experience || []).length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Professional Experience</h2>
          {resumeData.experience.map(exp => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                <span className="text-gray-400 text-xs">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <p className="text-xs font-medium mb-1.5" style={{ color: primaryColor }}>{exp.company} {exp.location ? `| ${exp.location}` : ''}</p>
              {exp.description && <p className="text-gray-600 text-xs leading-relaxed whitespace-pre-line">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {(resumeData.education || []).length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Education</h2>
          {resumeData.education.map(edu => (
            <div key={edu.id} className="mb-3 flex justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</h3>
                <p className="text-xs text-gray-600">{edu.institution} {edu.location ? `| ${edu.location}` : ''}</p>
                {edu.gpa && <p className="text-xs text-gray-400">GPA: {edu.gpa}</p>}
              </div>
              <span className="text-gray-400 text-xs flex-shrink-0">{edu.startDate} — {edu.current ? 'Present' : edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(resumeData.skills || []).length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Skills</h2>
          <div className="grid grid-cols-2 gap-2">
            {resumeData.skills.map(cat => (
              <div key={cat.id}>
                <span className="text-xs font-semibold text-gray-700">{cat.category}: </span>
                <span className="text-xs text-gray-600">{(cat.skills || []).join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {(resumeData.projects || []).length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Key Projects</h2>
          {resumeData.projects.map(proj => (
            <div key={proj.id} className="mb-3">
              <h3 className="font-semibold text-gray-900 text-sm">{proj.name}</h3>
              {proj.technologies?.length > 0 && (
                <p className="text-xs text-gray-500 mb-1">Technologies: {proj.technologies.join(', ')}</p>
              )}
              {proj.description && <p className="text-gray-600 text-xs leading-relaxed">{proj.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {(resumeData.achievements || []).length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Achievements</h2>
          {resumeData.achievements.map(ach => (
            <div key={ach.id || ach.title} className="mb-2">
              <h3 className="font-semibold text-gray-800 text-xs">{ach.title || (typeof ach === 'string' ? ach : '')}</h3>
              {ach.description && <p className="text-gray-600 text-xs leading-relaxed">{ach.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {(resumeData.certifications || []).length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Certifications</h2>
          {resumeData.certifications.map(cert => (
            <div key={cert.id} className="flex justify-between mb-1">
              <span className="text-xs font-medium text-gray-800">{cert.name} — <span className="font-normal text-gray-600">{cert.issuer}</span></span>
              <span className="text-xs text-gray-400">{cert.issueDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {(resumeData.languages || []).length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Languages</h2>
          <div className="flex flex-wrap gap-4 text-xs text-gray-700">
            {resumeData.languages.map(lang => (
              <span key={lang.id}><strong>{lang.language}</strong> ({lang.proficiency})</span>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {(resumeData.interests || []).length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Interests</h2>
          <p className="text-xs text-gray-600">
            {resumeData.interests.map(i => typeof i === 'string' ? i : i.name).join(' • ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfessionalTemplate;
