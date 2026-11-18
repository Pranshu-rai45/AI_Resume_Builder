import { Globe } from 'lucide-react';
import { Linkedin, Github, Twitter } from '../ui/BrandIcons';
import { useResume } from '../../context/ResumeContext';
import Input from '../ui/Input';

const SocialLinks = () => {
  const { resumeData, updatePersonalDetails } = useResume();
  const pd = resumeData.personalDetails;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white mb-0.5">Social Links</h2>
        <p className="text-sm text-slate-400">Your online presence and professional profiles</p>
      </div>
      <div className="glass rounded-xl border border-white/8 p-5 space-y-4">
        <Input label="LinkedIn" placeholder="https://linkedin.com/in/yourprofile" icon={<Linkedin size={16} />}
          value={pd.linkedin || ''} onChange={e => updatePersonalDetails('linkedin', e.target.value)} />
        <Input label="GitHub" placeholder="https://github.com/yourusername" icon={<Github size={16} />}
          value={pd.github || ''} onChange={e => updatePersonalDetails('github', e.target.value)} />
        <Input label="Twitter / X" placeholder="https://twitter.com/yourhandle" icon={<Twitter size={16} />}
          value={pd.twitter || ''} onChange={e => updatePersonalDetails('twitter', e.target.value)} />
        <Input label="Portfolio / Website" placeholder="https://yourportfolio.com" icon={<Globe size={16} />}
          value={pd.portfolio || ''} onChange={e => updatePersonalDetails('portfolio', e.target.value)} />
        <Input label="Other Website" placeholder="https://yourwebsite.com" icon={<Globe size={16} />}
          value={pd.website || ''} onChange={e => updatePersonalDetails('website', e.target.value)} />
      </div>
      <div className="glass rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <p className="text-sm text-blue-400 font-medium mb-1">💡 Pro Tip</p>
        <p className="text-xs text-slate-400">Including your LinkedIn and GitHub profile significantly improves your ATS score and gives recruiters more context about your work.</p>
      </div>
    </div>
  );
};

export default SocialLinks;
