import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Copy, CheckCircle2, Loader2, FileText,
  Briefcase, Code, Star, Target, Award, Mail, Wand2
} from 'lucide-react';
import { Linkedin } from '../components/ui/BrandIcons';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { aiService } from '../services/aiService';
import toast from 'react-hot-toast';

const AI_TOOLS = [
  { id: 'summary', label: 'Professional Summary', icon: FileText, color: 'from-blue-500 to-blue-600', desc: 'Generate a compelling professional summary' },
  { id: 'experience', label: 'Experience Description', icon: Briefcase, color: 'from-purple-500 to-purple-600', desc: 'Create achievement-focused work experience bullets' },
  { id: 'project', label: 'Project Description', icon: Code, color: 'from-emerald-500 to-emerald-600', desc: 'Describe your projects professionally' },
  { id: 'skills', label: 'Skill Suggestions', icon: Star, color: 'from-amber-500 to-amber-600', desc: 'Get ATS-relevant skill recommendations' },
  { id: 'objective', label: 'Career Objective', icon: Target, color: 'from-cyan-500 to-cyan-600', desc: 'Define your professional goals clearly' },
  { id: 'achievements', label: 'Achievements', icon: Award, color: 'from-rose-500 to-rose-600', desc: 'Quantify your professional accomplishments' },
  { id: 'cover-letter', label: 'Cover Letter', icon: Mail, color: 'from-indigo-500 to-indigo-600', desc: 'Write a personalized cover letter' },
  { id: 'linkedin', label: 'LinkedIn About', icon: Linkedin, color: 'from-sky-500 to-sky-600', desc: 'Craft your LinkedIn profile summary' },
  { id: 'improve-grammar', label: 'Improve Grammar', icon: Wand2, color: 'from-violet-500 to-violet-600', desc: 'Polish and refine your existing content' },
];

const AIAssistant = () => {
  const [activeTool, setActiveTool] = useState('summary');
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');
    try {
      let data;
      switch (activeTool) {
        case 'summary': data = await aiService.generateSummary(inputs); break;
        case 'experience': data = await aiService.generateExperience(inputs); break;
        case 'project': data = await aiService.generateProject(inputs); break;
        case 'skills': data = await aiService.suggestSkills(inputs); break;
        case 'objective': data = await aiService.generateObjective(inputs); break;
        case 'achievements': data = await aiService.generateAchievements(inputs); break;
        case 'cover-letter': data = await aiService.generateCoverLetter(inputs); break;
        case 'linkedin': data = await aiService.generateLinkedIn(inputs); break;
        case 'improve-grammar': data = await aiService.improveGrammar(inputs.text); break;
        default: return;
      }
      const resultText = Array.isArray(data.data) ? data.data.join('\n') : data.data;
      setResult(resultText || 'No content generated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied!');
  };

  const tool = AI_TOOLS.find(t => t.id === activeTool);

  const renderInputs = () => {
    const InputField = ({ label, field, placeholder }) => (
      <Input label={label} placeholder={placeholder} value={inputs[field] || ''}
        onChange={e => setInputs(p => ({ ...p, [field]: e.target.value }))} />
    );
    switch (activeTool) {
      case 'summary': return (<div className="space-y-3"><InputField label="Full Name" field="name" placeholder="John Doe" /><InputField label="Job Title" field="jobTitle" placeholder="Software Engineer" /><InputField label="Years of Experience" field="experience" placeholder="5" /><InputField label="Key Skills" field="skills" placeholder="React, Node.js, Python" /></div>);
      case 'experience': return (<div className="space-y-3"><InputField label="Company" field="company" placeholder="Google" /><InputField label="Position" field="position" placeholder="Senior Engineer" /><InputField label="Duration" field="duration" placeholder="2020 - 2023" /></div>);
      case 'project': return (<div className="space-y-3"><InputField label="Project Name" field="projectName" placeholder="E-Commerce Platform" /><InputField label="Technologies" field="technologies" placeholder="React, Node.js, MongoDB" /></div>);
      case 'skills': return (<div className="space-y-3"><InputField label="Job Title" field="jobTitle" placeholder="Data Scientist" /><InputField label="Existing Skills" field="existingSkills" placeholder="Python, SQL" /></div>);
      case 'objective': return (<div className="space-y-3"><InputField label="Job Title / Target Role" field="jobTitle" placeholder="Product Manager" /><InputField label="Experience Level" field="experience" placeholder="3 years" /></div>);
      case 'achievements': return (<div className="space-y-3"><InputField label="Job Title" field="jobTitle" placeholder="Sales Manager" /><InputField label="Industry" field="industry" placeholder="SaaS" /></div>);
      case 'cover-letter': return (<div className="space-y-3"><InputField label="Your Name" field="name" placeholder="John Doe" /><InputField label="Applying For" field="jobTitle" placeholder="Software Engineer" /><InputField label="Company" field="company" placeholder="Google" /><InputField label="Key Skills" field="skills" placeholder="React, Python" /></div>);
      case 'linkedin': return (<div className="space-y-3"><InputField label="Name" field="name" placeholder="John Doe" /><InputField label="Job Title" field="jobTitle" placeholder="Full Stack Developer" /><InputField label="Key Achievements" field="achievements" placeholder="Led team of 10, increased revenue..." /></div>);
      case 'improve-grammar': return (<div className="space-y-2"><label className="text-sm font-medium text-slate-300">Text to Improve</label><textarea rows={4} value={inputs.text || ''} onChange={e => setInputs(p => ({ ...p, text: e.target.value }))} className="form-input resize-none" placeholder="Paste your resume content here to improve the grammar and style..." /></div>);
      default: return null;
    }
  };

  return (
    <DashboardLayout title="AI Assistant" subtitle="Powered by Google Gemini AI">
      <div className="flex h-full overflow-hidden">
        {/* Tool selector */}
        <div className="w-56 flex-shrink-0 border-r border-white/8 overflow-y-auto py-4 px-2 space-y-1">
          {AI_TOOLS.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => { setActiveTool(id); setResult(''); setInputs({}); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all text-xs ${
                activeTool === id ? 'bg-white/10 text-white border border-white/15' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon size={14} className="text-white" />
              </div>
              {label}
            </button>
          ))}
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 lg:p-6">
          <div className="grid lg:grid-cols-2 gap-5 h-full">
            {/* Input */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool?.color} flex items-center justify-center`}>
                  {tool && <tool.icon size={18} className="text-white" />}
                </div>
                <div>
                  <h2 className="font-bold text-white text-sm">{tool?.label}</h2>
                  <p className="text-xs text-slate-400">{tool?.desc}</p>
                </div>
              </div>
              <div className="glass rounded-xl border border-white/8 p-4 space-y-3">
                {renderInputs()}
              </div>
              <Button variant="primary" className="w-full" onClick={handleGenerate} loading={loading} icon={<Sparkles size={16} />}>
                Generate with AI
              </Button>
            </div>

            {/* Output */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-sm">AI Generated Result</h3>
                {result && (
                  <Button variant="ghost" size="sm" onClick={handleCopy} icon={copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}>
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                )}
              </div>
              <div className="flex-1 glass rounded-xl border border-white/8 p-4 min-h-48 overflow-y-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <Loader2 size={28} className="animate-spin text-blue-400" />
                    <p className="text-slate-400 text-sm">Generating with Gemini AI...</p>
                  </div>
                ) : result ? (
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-600">
                    <Sparkles size={28} />
                    <p className="text-sm">Fill in the details and click Generate</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
