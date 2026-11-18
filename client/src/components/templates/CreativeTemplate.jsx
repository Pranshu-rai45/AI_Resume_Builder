import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Linkedin, Github } from '../ui/BrandIcons';

const CreativeTemplate = ({ resumeData = {} }) => {
  const pd = resumeData.personalDetails || {};
  const primaryColor = resumeData.colorScheme || '#7C3AED';

  return (
    <div className="bg-white min-h-[1123px]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Hero header */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative p-8">
          <h1 className="text-3xl font-bold text-white mb-1">{pd.firstName} {pd.lastName}</h1>
          <p className="text-white/70 text-lg mb-4">{pd.jobTitle}</p>
          <div className="flex flex-wrap gap-4">
            {pd.email && <span className="flex items-center gap-1.5 text-white/70 text-xs"><Mail size={11} />{pd.email}</span>}
            {pd.phone && <span className="flex items-center gap-1.5 text-white/70 text-xs"><Phone size={11} />{pd.phone}</span>}
            {(pd.city || pd.location) && <span className="flex items-center gap-1.5 text-white/70 text-xs"><MapPin size={11} />{pd.city || pd.location}</span>}
            {pd.linkedin && <span className="flex items-center gap-1.5 text-white/70 text-xs"><Linkedin size={11} />LinkedIn</span>}
            {pd.github && <span className="flex items-center gap-1.5 text-white/70 text-xs"><Github size={11} />GitHub</span>}
          </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-3 gap-6">
        {/* Left */}
        <div className="col-span-1 space-y-5">
          {(resumeData.skills || []).length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>Skills</h2>
              {resumeData.skills.map(cat => (
                <div key={cat.id} className="mb-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">{cat.category}</p>
                  <div className="space-y-1">
                    {(cat.skills || []).slice(0, 5).map(skill => (
                      <div key={skill} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: primaryColor }} />
                        <span className="text-xs text-gray-600">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {(resumeData.languages || []).length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>Languages</h2>
              {resumeData.languages.map(l => (
                <div key={l.id} className="flex justify-between mb-1">
                  <span className="text-xs text-gray-700">{l.language}</span>
                  <span className="text-xs text-gray-400">{l.proficiency?.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          )}
          {(resumeData.certifications || []).length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>Certifications</h2>
              {resumeData.certifications.map(c => (
                <div key={c.id} className="mb-2">
                  <p className="text-xs font-semibold text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.issuer} · {c.issueDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="col-span-2 space-y-5">
          {pd.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>About</h2>
              <p className="text-gray-600 text-xs leading-relaxed">{pd.summary}</p>
            </div>
          )}
          {(resumeData.experience || []).length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>Experience</h2>
              {resumeData.experience.map(exp => (
                <div key={exp.id} className="mb-4 pl-3 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                  <h3 className="font-semibold text-gray-900 text-sm">{exp.position}</h3>
                  <p className="text-xs font-medium mb-1" style={{ color: primaryColor }}>{exp.company}</p>
                  <p className="text-xs text-gray-400 mb-1">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</p>
                  {exp.description && <p className="text-gray-600 text-xs leading-relaxed whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
          {(resumeData.education || []).length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>Education</h2>
              {resumeData.education.map(edu => (
                <div key={edu.id} className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</h3>
                  <p className="text-xs text-gray-500">{edu.institution} · {edu.startDate} — {edu.current ? 'Now' : edu.endDate}</p>
                </div>
              ))}
            </div>
          )}
          {(resumeData.projects || []).length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>Projects</h2>
              {resumeData.projects.map(proj => (
                <div key={proj.id} className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{proj.name}</h3>
                  {proj.technologies?.length > 0 && (
                    <p className="text-xs text-gray-400 mb-1">{proj.technologies.join(' · ')}</p>
                  )}
                  {proj.description && <p className="text-gray-600 text-xs leading-relaxed">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
          {(resumeData.achievements || []).length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>Achievements</h2>
              {resumeData.achievements.map(ach => (
                <div key={ach.id || ach.title} className="mb-2">
                  <p className="text-xs font-semibold text-gray-800">{ach.title || (typeof ach === 'string' ? ach : '')}</p>
                  {ach.description && <p className="text-xs text-gray-600">{ach.description}</p>}
                </div>
              ))}
            </div>
          )}
          {(resumeData.interests || []).length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>Interests</h2>
              <p className="text-xs text-gray-600">{resumeData.interests.map(i => typeof i === 'string' ? i : i.name).join(' · ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
