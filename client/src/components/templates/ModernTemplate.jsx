import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Linkedin, Github } from '../ui/BrandIcons';

const ModernTemplate = ({ resumeData = {} }) => {
  const pd = resumeData.personalDetails || {};
  const primaryColor = resumeData.colorScheme || '#2563EB';

  const Section = ({ title, children }) => (
    <div className="mb-5">
      <h2 style={{ color: primaryColor }} className="text-sm font-bold uppercase tracking-widest mb-2 pb-1 border-b" style={{ borderColor: `${primaryColor}40`, color: primaryColor }}>
        {title}
      </h2>
      {children}
    </div>
  );

  return (
    <div className="flex h-full min-h-[1123px]" style={{ fontFamily: resumeData.fontFamily || 'Inter, sans-serif' }}>
      {/* Left sidebar */}
      <div className="w-64 flex-shrink-0 p-6" style={{ background: primaryColor }}>
        {/* Avatar/Initials */}
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
          {pd.firstName?.charAt(0)}{pd.lastName?.charAt(0)}
        </div>
        <h1 className="text-white text-lg font-bold text-center mb-0.5">{pd.firstName} {pd.lastName}</h1>
        <p className="text-white/70 text-xs text-center mb-6">{pd.jobTitle}</p>

        {/* Contact */}
        <div className="space-y-2 mb-6">
          <p className="text-white text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Contact</p>
          {pd.email && <div className="flex items-center gap-2 text-white/80 text-xs"><Mail size={10} className="flex-shrink-0" /><span className="truncate">{pd.email}</span></div>}
          {pd.phone && <div className="flex items-center gap-2 text-white/80 text-xs"><Phone size={10} className="flex-shrink-0" /><span>{pd.phone}</span></div>}
          {(pd.city || pd.location) && <div className="flex items-center gap-2 text-white/80 text-xs"><MapPin size={10} className="flex-shrink-0" /><span>{pd.city || pd.location}</span></div>}
          {pd.linkedin && <div className="flex items-center gap-2 text-white/80 text-xs"><Linkedin size={10} className="flex-shrink-0" /><span className="truncate">LinkedIn</span></div>}
          {pd.github && <div className="flex items-center gap-2 text-white/80 text-xs"><Github size={10} className="flex-shrink-0" /><span className="truncate">GitHub</span></div>}
          {pd.website && <div className="flex items-center gap-2 text-white/80 text-xs"><Globe size={10} className="flex-shrink-0" /><span className="truncate">Portfolio</span></div>}
        </div>

        {/* Skills */}
        {(resumeData.skills || []).length > 0 && (
          <div className="mb-6">
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Skills</p>
            {resumeData.skills.map(cat => (
              <div key={cat.id} className="mb-3">
                <p className="text-white/60 text-xs mb-1.5">{cat.category}</p>
                <div className="flex flex-wrap gap-1">
                  {(cat.skills || []).slice(0, 6).map(skill => (
                    <span key={skill} className="px-1.5 py-0.5 bg-white/20 text-white text-xs rounded">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {(resumeData.languages || []).length > 0 && (
          <div>
            <p className="text-white text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Languages</p>
            {resumeData.languages.map(lang => (
              <div key={lang.id} className="flex justify-between items-center mb-1">
                <span className="text-white/80 text-xs">{lang.language}</span>
                <span className="text-white/50 text-xs">{lang.proficiency?.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right main */}
      <div className="flex-1 p-6 bg-white overflow-visible">
        {/* Summary */}
        {pd.summary && (
          <Section title="Professional Summary">
            <p className="text-gray-600 text-xs leading-relaxed">{pd.summary}</p>
          </Section>
        )}

        {/* Experience */}
        {(resumeData.experience || []).length > 0 && (
          <Section title="Experience">
            {resumeData.experience.map(exp => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{exp.position}</h3>
                    <p className="text-xs" style={{ color: primaryColor }}>{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
                  </div>
                  <span className="text-gray-400 text-xs flex-shrink-0 ml-2">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.description && <p className="text-gray-600 text-xs mt-1 leading-relaxed whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {(resumeData.education || []).length > 0 && (
          <Section title="Education">
            {resumeData.education.map(edu => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</h3>
                    <p className="text-xs" style={{ color: primaryColor }}>{edu.institution}</p>
                    {edu.gpa && <p className="text-gray-400 text-xs">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-gray-400 text-xs flex-shrink-0 ml-2">{edu.startDate} — {edu.current ? 'Present' : edu.endDate}</span>
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Projects */}
        {(resumeData.projects || []).length > 0 && (
          <Section title="Projects">
            {resumeData.projects.map(proj => (
              <div key={proj.id} className="mb-3">
                <h3 className="font-semibold text-gray-800 text-sm">{proj.name}</h3>
                {proj.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 my-1">
                    {proj.technologies.map(t => <span key={t} className="px-1.5 py-0.5 text-xs rounded" style={{ background: `${primaryColor}15`, color: primaryColor }}>{t}</span>)}
                  </div>
                )}
                {proj.description && <p className="text-gray-600 text-xs leading-relaxed">{proj.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {/* Achievements */}
        {(resumeData.achievements || []).length > 0 && (
          <Section title="Key Achievements">
            {resumeData.achievements.map(ach => (
              <div key={ach.id || ach.title} className="mb-2">
                <h3 className="font-semibold text-gray-800 text-xs">{ach.title || (typeof ach === 'string' ? ach : '')}</h3>
                {ach.description && <p className="text-gray-600 text-xs leading-relaxed">{ach.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {/* Certifications */}
        {(resumeData.certifications || []).length > 0 && (
          <Section title="Certifications">
            {resumeData.certifications.map(cert => (
              <div key={cert.id} className="mb-2 flex justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 text-xs">{cert.name}</h3>
                  <p className="text-gray-500 text-xs">{cert.issuer}</p>
                </div>
                <span className="text-gray-400 text-xs">{cert.issueDate}</span>
              </div>
            ))}
          </Section>
        )}

        {/* Interests */}
        {(resumeData.interests || []).length > 0 && (
          <Section title="Interests">
            <div className="flex flex-wrap gap-1.5">
              {resumeData.interests.map(interest => (
                <span key={typeof interest === 'string' ? interest : interest.id} className="px-2 py-0.5 text-xs rounded-full border" style={{ borderColor: `${primaryColor}40`, color: primaryColor }}>{typeof interest === 'string' ? interest : interest.name}</span>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
