import { Mail, Phone, MapPin } from 'lucide-react';

const MinimalTemplate = ({ resumeData = {} }) => {
  const pd = resumeData.personalDetails || {};
  const accent = resumeData.colorScheme || '#374151';

  return (
    <div className="bg-white p-10 min-h-[1123px]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-1">{pd.firstName} <strong>{pd.lastName}</strong></h1>
        <p className="text-gray-500 mb-4">{pd.jobTitle}</p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
          {pd.email && <span>{pd.email}</span>}
          {pd.phone && <span>{pd.phone}</span>}
          {(pd.city || pd.location) && <span>{pd.city || pd.location}</span>}
          {pd.linkedin && <span>linkedin.com</span>}
          {pd.github && <span>github.com</span>}
        </div>
        <div className="mt-4 h-px bg-gray-100" />
      </div>

      {pd.summary && (
        <div className="mb-6"><p className="text-gray-600 text-sm leading-relaxed">{pd.summary}</p><div className="mt-4 h-px bg-gray-100" /></div>
      )}

      {(resumeData.experience || []).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Experience</h2>
          {resumeData.experience.map(exp => (
            <div key={exp.id} className="mb-5 grid grid-cols-4 gap-4">
              <div className="col-span-1 text-right">
                <p className="text-xs text-gray-400 leading-relaxed">{exp.startDate}<br />—<br />{exp.current ? 'Now' : exp.endDate}</p>
              </div>
              <div className="col-span-3">
                <h3 className="font-semibold text-gray-900 text-sm">{exp.position}</h3>
                <p className="text-xs text-gray-500 mb-2">{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
                {exp.description && <p className="text-gray-600 text-xs leading-relaxed whitespace-pre-line">{exp.description}</p>}
              </div>
            </div>
          ))}
          <div className="h-px bg-gray-100" />
        </div>
      )}

      {(resumeData.education || []).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Education</h2>
          {resumeData.education.map(edu => (
            <div key={edu.id} className="mb-4 grid grid-cols-4 gap-4">
              <div className="col-span-1 text-right"><p className="text-xs text-gray-400">{edu.startDate}<br />—<br />{edu.current ? 'Now' : edu.endDate}</p></div>
              <div className="col-span-3">
                <h3 className="font-semibold text-gray-900 text-sm">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</h3>
                <p className="text-xs text-gray-500">{edu.institution}</p>
              </div>
            </div>
          ))}
          <div className="h-px bg-gray-100" />
        </div>
      )}

      {(resumeData.skills || []).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Skills</h2>
          {resumeData.skills.map(cat => (
            <div key={cat.id} className="mb-2 grid grid-cols-4 gap-4">
              <div className="col-span-1 text-right"><p className="text-xs text-gray-400">{cat.category}</p></div>
              <div className="col-span-3"><p className="text-xs text-gray-600">{(cat.skills || []).join(' · ')}</p></div>
            </div>
          ))}
          <div className="h-px bg-gray-100 mt-4" />
        </div>
      )}

      {(resumeData.projects || []).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Projects</h2>
          {resumeData.projects.map(proj => (
            <div key={proj.id} className="mb-4 grid grid-cols-4 gap-4">
              <div className="col-span-1 text-right"><p className="text-xs text-gray-400">{proj.technologies?.join(' · ')}</p></div>
              <div className="col-span-3">
                <h3 className="font-semibold text-gray-900 text-sm">{proj.name}</h3>
                {proj.description && <p className="text-xs text-gray-600 mt-1">{proj.description}</p>}
              </div>
            </div>
          ))}
          <div className="h-px bg-gray-100 mt-4" />
        </div>
      )}

      {(resumeData.achievements || []).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Achievements</h2>
          {resumeData.achievements.map(ach => (
            <div key={ach.id || ach.title} className="mb-2 grid grid-cols-4 gap-4">
              <div className="col-span-1 text-right"></div>
              <div className="col-span-3">
                <p className="text-xs font-semibold text-gray-800">{ach.title || (typeof ach === 'string' ? ach : '')}</p>
                {ach.description && <p className="text-xs text-gray-600">{ach.description}</p>}
              </div>
            </div>
          ))}
          <div className="h-px bg-gray-100 mt-4" />
        </div>
      )}

      {(resumeData.certifications || []).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Certifications</h2>
          {resumeData.certifications.map(c => (
            <div key={c.id} className="mb-2 grid grid-cols-4 gap-4">
              <div className="col-span-1 text-right"><p className="text-xs text-gray-400">{c.issueDate}</p></div>
              <div className="col-span-3"><p className="text-xs font-medium text-gray-800">{c.name} <span className="text-gray-400">· {c.issuer}</span></p></div>
            </div>
          ))}
          <div className="h-px bg-gray-100 mt-4" />
        </div>
      )}

      {(resumeData.languages || []).length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Languages</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 text-right"></div>
            <div className="col-span-3 flex flex-wrap gap-4 text-xs text-gray-600">
              {resumeData.languages.map(l => (
                <span key={l.id}>{l.language} ({l.proficiency})</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
