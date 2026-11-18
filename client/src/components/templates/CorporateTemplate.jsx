import { Mail, Phone, MapPin } from 'lucide-react';
import { Linkedin } from '../ui/BrandIcons';

const CorporateTemplate = ({ resumeData = {} }) => {
  const pd = resumeData.personalDetails || {};
  const primaryColor = resumeData.colorScheme || '#1F2937';

  return (
    <div className="bg-white min-h-[1123px]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="bg-gray-900 text-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{pd.firstName} {pd.lastName}</h1>
            <p className="text-gray-400 mt-1">{pd.jobTitle}</p>
          </div>
          <div className="text-right space-y-1">
            {pd.email && <p className="text-xs text-gray-400 flex items-center justify-end gap-1"><Mail size={10} />{pd.email}</p>}
            {pd.phone && <p className="text-xs text-gray-400 flex items-center justify-end gap-1"><Phone size={10} />{pd.phone}</p>}
            {(pd.city || pd.location) && <p className="text-xs text-gray-400 flex items-center justify-end gap-1"><MapPin size={10} />{pd.city || pd.location}</p>}
            {pd.linkedin && <p className="text-xs text-gray-400 flex items-center justify-end gap-1"><Linkedin size={10} />LinkedIn</p>}
          </div>
        </div>
      </div>

      {/* Accent bar */}
      <div className="h-1 bg-gradient-to-r" style={{ background: `linear-gradient(to right, ${primaryColor === '#1F2937' ? '#2563EB' : primaryColor}, #7C3AED)` }} />

      <div className="px-8 py-6 space-y-5">
        {pd.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Executive Summary</h2>
            <p className="text-gray-700 text-xs leading-relaxed bg-gray-50 p-3 rounded">{pd.summary}</p>
          </div>
        )}

        {(resumeData.experience || []).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1 border-b border-gray-200">Professional Experience</h2>
            {resumeData.experience.map(exp => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                    <span className="text-gray-500 text-xs">@ {exp.company}</span>
                  </div>
                  <span className="text-gray-400 text-xs bg-gray-100 px-2 py-0.5 rounded">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.description && <p className="text-gray-600 text-xs leading-relaxed pl-2 border-l-2 border-gray-200 whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {(resumeData.skills || []).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1 border-b border-gray-200">Core Competencies</h2>
            <div className="grid grid-cols-2 gap-3">
              {resumeData.skills.map(cat => (
                <div key={cat.id} className="bg-gray-50 rounded p-3">
                  <p className="text-xs font-bold text-gray-700 mb-1.5">{cat.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {(cat.skills || []).map(skill => <span key={skill} className="text-xs bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600">{skill}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(resumeData.education || []).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1 border-b border-gray-200">Education</h2>
            {resumeData.education.map(edu => (
              <div key={edu.id} className="flex justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{edu.degree}{edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ''}</h3>
                  <p className="text-xs text-gray-500">{edu.institution}</p>
                </div>
                <span className="text-gray-400 text-xs">{edu.startDate} — {edu.current ? 'Present' : edu.endDate}</span>
              </div>
            ))}
          </div>
        )}

        {(resumeData.projects || []).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1 border-b border-gray-200">Key Projects</h2>
            {resumeData.projects.map(proj => (
              <div key={proj.id} className="mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">{proj.name}</h3>
                {proj.technologies?.length > 0 && <p className="text-xs text-gray-500 mb-1">{proj.technologies.join(' · ')}</p>}
                {proj.description && <p className="text-gray-600 text-xs leading-relaxed">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}

        {(resumeData.achievements || []).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1 border-b border-gray-200">Achievements</h2>
            {resumeData.achievements.map(ach => (
              <div key={ach.id || ach.title} className="mb-2">
                <p className="text-xs font-semibold text-gray-800">{ach.title || (typeof ach === 'string' ? ach : '')}</p>
                {ach.description && <p className="text-xs text-gray-600">{ach.description}</p>}
              </div>
            ))}
          </div>
        )}

        {(resumeData.certifications || []).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 pb-1 border-b border-gray-200">Certifications</h2>
            <div className="grid grid-cols-2 gap-2">
              {resumeData.certifications.map(cert => (
                <div key={cert.id} className="flex items-center gap-2 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  <span className="font-medium text-gray-800">{cert.name}</span>
                  <span className="text-gray-400">· {cert.issuer}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(resumeData.languages || []).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Languages</h2>
            <div className="flex flex-wrap gap-4 text-xs text-gray-700">
              {resumeData.languages.map(l => (
                <span key={l.id}><strong>{l.language}</strong> ({l.proficiency})</span>
              ))}
            </div>
          </div>
        )}

        {(resumeData.interests || []).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Interests</h2>
            <p className="text-xs text-gray-600">{resumeData.interests.map(i => typeof i === 'string' ? i : i.name).join(' · ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CorporateTemplate;
