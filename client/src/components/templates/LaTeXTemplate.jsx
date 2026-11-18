import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Linkedin, Github } from '../ui/BrandIcons';

const LaTeXTemplate = ({ resumeData = {} }) => {
  const pd = resumeData.personalDetails || {};
  const fontFamily = resumeData.fontFamily || "'Times New Roman', Times, Georgia, serif";

  const SectionHeader = ({ title }) => (
    <div className="mt-3 mb-1.5">
      <h2 className="text-sm font-bold text-black uppercase tracking-wide">
        {title}
      </h2>
      <div className="w-full border-b border-black mt-0.5" />
    </div>
  );

  return (
    <div
      className="bg-white text-black p-8 min-h-[1123px] text-xs leading-relaxed"
      style={{ fontFamily }}
    >
      {/* 1. HEADER */}
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-black mb-1">
          {pd.firstName || 'PRANSHU'} {pd.lastName || 'RAI'}
        </h1>
        {(pd.city || pd.location || pd.country) && (
          <p className="text-xs text-gray-800 mb-1 font-medium">
            {[pd.city, pd.location, pd.country].filter(Boolean).join(', ')}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-900">
          {pd.phone && (
            <span className="flex items-center gap-1">
              <Phone size={10} />
              {pd.phone}
            </span>
          )}
          {pd.email && (
            <span className="flex items-center gap-1">
              <Mail size={10} />
              <a href={`mailto:${pd.email}`} className="underline">{pd.email}</a>
            </span>
          )}
          {pd.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin size={10} />
              <a href={pd.linkedin.startsWith('http') ? pd.linkedin : `https://${pd.linkedin}`} target="_blank" rel="noreferrer" className="underline">
                {pd.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </span>
          )}
          {pd.github && (
            <span className="flex items-center gap-1">
              <Github size={10} />
              <a href={pd.github.startsWith('http') ? pd.github : `https://${pd.github}`} target="_blank" rel="noreferrer" className="underline">
                {pd.github.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </span>
          )}
          {pd.website && (
            <span className="flex items-center gap-1">
              <Globe size={10} />
              <a href={pd.website} target="_blank" rel="noreferrer" className="underline">
                {pd.website.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </span>
          )}
        </div>
      </div>

      {/* 2. SUMMARY (IF PRESENT) */}
      {pd.summary && (
        <div>
          <SectionHeader title="Professional Summary" />
          <p className="text-gray-900 text-xs leading-normal">{pd.summary}</p>
        </div>
      )}

      {/* 3. EDUCATION */}
      {(resumeData.education || []).length > 0 && (
        <div>
          <SectionHeader title="Education" />
          <div className="space-y-2">
            {resumeData.education.map(edu => (
              <div key={edu.id || edu.institution}>
                <div className="flex justify-between items-baseline font-bold text-gray-900">
                  <span className="text-sm">{edu.institution}</span>
                  <span className="font-bold text-xs">{edu.startDate} – {edu.current ? 'Present' : edu.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline italic text-gray-800 text-xs">
                  <span>
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    {edu.gpa ? ` ( CGPA : ${edu.gpa} )` : ''}
                  </span>
                  <span>{edu.location || pd.city || ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. RELEVANT COURSEWORK (IF PRESENT) */}
      {(resumeData.coursework || []).length > 0 && (
        <div>
          <SectionHeader title="Relevant Coursework" />
          <div className="grid grid-cols-4 gap-x-2 gap-y-1 text-xs">
            {resumeData.coursework.map((course, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span>•</span>
                <span>{course}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TECHNICAL SKILLS */}
      {(resumeData.skills || []).length > 0 && (
        <div>
          <SectionHeader title="Technical Skills" />
          <div className="space-y-1 text-xs">
            {resumeData.skills.map(cat => (
              <div key={cat.id || cat.category} className="flex">
                <span className="font-bold text-gray-900 min-w-[150px]">
                  {cat.category}:
                </span>
                <span className="text-gray-900">
                  {Array.isArray(cat.skills) ? cat.skills.join(', ') : cat.skills}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. EXPERIENCE (IF PRESENT) */}
      {(resumeData.experience || []).length > 0 && (
        <div>
          <SectionHeader title="Experience" />
          <div className="space-y-2.5">
            {resumeData.experience.map(exp => (
              <div key={exp.id || exp.company}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-xs">
                    {exp.position} <span className="font-normal italic">| {exp.company}</span>
                  </span>
                  <span className="font-bold text-gray-900 text-xs">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.description && (
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-gray-900 text-xs pl-1">
                    {exp.description.split('\n').filter(Boolean).map((line, i) => (
                      <li key={i} className="leading-normal">
                        {line.replace(/^[-•*]\s*/, '')}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. PROJECTS */}
      {(resumeData.projects || []).length > 0 && (
        <div>
          <SectionHeader title="Projects" />
          <div className="space-y-2.5">
            {resumeData.projects.map(proj => (
              <div key={proj.id || proj.name}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-xs">
                    {proj.name}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <span className="font-normal italic">
                        {' '}| {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-gray-900 text-xs">{proj.startDate || proj.endDate || ''}</span>
                </div>
                {proj.description && (
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-gray-900 text-xs pl-1">
                    {proj.description.split('\n').filter(Boolean).map((line, i) => (
                      <li key={i} className="leading-normal">
                        {line.replace(/^[-•*]\s*/, '')}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. ACHIEVEMENTS & ACTIVITIES */}
      {((resumeData.achievements || []).length > 0 || (resumeData.certifications || []).length > 0) && (
        <div>
          <SectionHeader title="Achievement Activities" />
          <ul className="list-disc list-inside space-y-1 text-gray-900 text-xs pl-1">
            {(resumeData.achievements || []).map(ach => (
              <li key={ach.id || ach.title} className="leading-normal">
                <span className="font-semibold">{ach.title || (typeof ach === 'string' ? ach : '')}</span>
                {ach.description ? `: ${ach.description}` : ''}
              </li>
            ))}
            {(resumeData.certifications || []).map(cert => (
              <li key={cert.id || cert.name} className="leading-normal">
                <span className="font-semibold">{cert.name}</span> — {cert.issuer} ({cert.issueDate})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LaTeXTemplate;
