import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { aiService } from '../../services/aiService';
import Input from '../ui/Input';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const AIButton = ({ onClick, loading, label = 'Generate with AI' }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:text-purple-300 hover:bg-purple-500/30 transition-all text-xs font-medium disabled:opacity-50"
  >
    {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
    {label}
  </button>
);

const PersonalDetails = () => {
  const { resumeData, updateSection, updatePersonalDetails } = useResume();
  const pd = resumeData.personalDetails;
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const handleChange = (field, value) => updatePersonalDetails(field, value);

  const generateSummary = async () => {
    try {
      setGeneratingSummary(true);
      const data = await aiService.generateSummary({
        name: `${pd.firstName} ${pd.lastName}`,
        jobTitle: pd.jobTitle,
        experience: resumeData.experience?.length || 0,
        skills: resumeData.skills?.flatMap(s => s.skills || []).join(', ')
      });
      handleChange('summary', data.data);
      toast.success('Summary generated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGeneratingSummary(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white mb-1">Personal Details</h2>
        <p className="text-sm text-slate-400">Your basic contact and professional information</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="First Name" placeholder="John" value={pd.firstName || ''} onChange={e => handleChange('firstName', e.target.value)} required />
        <Input label="Last Name" placeholder="Doe" value={pd.lastName || ''} onChange={e => handleChange('lastName', e.target.value)} required />
        <Input label="Email" type="email" placeholder="john@example.com" value={pd.email || ''} onChange={e => handleChange('email', e.target.value)} />
        <Input label="Phone" placeholder="+1 (555) 000-0000" value={pd.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
        <Input label="Job Title" placeholder="Software Engineer" value={pd.jobTitle || ''} onChange={e => handleChange('jobTitle', e.target.value)} />
        <Input label="Location" placeholder="New York, NY" value={pd.location || ''} onChange={e => handleChange('location', e.target.value)} />
        <Input label="City" placeholder="New York" value={pd.city || ''} onChange={e => handleChange('city', e.target.value)} />
        <Input label="Country" placeholder="United States" value={pd.country || ''} onChange={e => handleChange('country', e.target.value)} />
        <Input label="Website" placeholder="https://yourwebsite.com" value={pd.website || ''} onChange={e => handleChange('website', e.target.value)} />
      </div>

      {/* Professional Summary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-300">Professional Summary</label>
          <AIButton onClick={generateSummary} loading={generatingSummary} />
        </div>
        <textarea
          rows={4}
          placeholder="Write a compelling professional summary or click 'Generate with AI' to create one automatically..."
          value={pd.summary || ''}
          onChange={e => handleChange('summary', e.target.value)}
          className="form-input resize-none"
        />
      </div>
    </div>
  );
};

export default PersonalDetails;
