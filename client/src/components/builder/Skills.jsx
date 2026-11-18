import { useState } from 'react';
import { Plus, Trash2, X, Sparkles, Loader2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { aiService } from '../../services/aiService';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

const emptyCategory = () => ({ id: Math.random().toString(36).slice(2), category: 'Technical Skills', skills: [], level: 'Intermediate' });

const Skills = () => {
  const { resumeData, updateSection } = useResume();
  const items = resumeData.skills || [];
  const [skillInput, setSkillInput] = useState({});
  const [suggesting, setSuggesting] = useState(false);

  const addCategory = () => updateSection('skills', [...items, emptyCategory()]);
  const updateCategory = (id, field, value) => updateSection('skills', items.map(i => i.id === id ? { ...i, [field]: value } : i));
  const removeCategory = (id) => updateSection('skills', items.filter(i => i.id !== id));

  const addSkill = (id, skill) => {
    if (!skill.trim()) return;
    const item = items.find(i => i.id === id);
    if (!item.skills.includes(skill.trim())) updateCategory(id, 'skills', [...item.skills, skill.trim()]);
    setSkillInput(p => ({ ...p, [id]: '' }));
  };

  const removeSkill = (id, skill) => {
    const item = items.find(i => i.id === id);
    updateCategory(id, 'skills', item.skills.filter(s => s !== skill));
  };

  const suggestSkills = async () => {
    const pd = resumeData.personalDetails;
    try {
      setSuggesting(true);
      const data = await aiService.suggestSkills({
        jobTitle: pd.jobTitle || 'Software Engineer',
        existingSkills: items.flatMap(i => i.skills).join(', '),
      });
      if (Array.isArray(data.data) && data.data.length > 0) {
        const existing = items[0] || emptyCategory();
        const merged = [...new Set([...existing.skills, ...data.data])].slice(0, 20);
        if (items.length > 0) {
          updateCategory(items[0].id, 'skills', merged);
        } else {
          updateSection('skills', [{ ...existing, skills: merged }]);
        }
        toast.success(`${data.data.length} skills suggested!`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-white mb-0.5">Skills</h2><p className="text-sm text-slate-400">Your technical and professional skills</p></div>
        <div className="flex gap-2">
          <button onClick={suggestSkills} disabled={suggesting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 text-xs font-medium disabled:opacity-50">
            {suggesting ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI Suggest
          </button>
          <Button variant="primary" size="sm" onClick={addCategory} icon={<Plus size={14} />}>Category</Button>
        </div>
      </div>
      {items.length === 0 && (
        <div className="text-center py-10 glass rounded-xl border border-white/8">
          <p className="text-slate-500 text-sm mb-3">No skills added yet</p>
          <div className="flex gap-2 justify-center">
            <Button variant="secondary" size="sm" onClick={addCategory} icon={<Plus size={14} />}>Add Category</Button>
            <Button variant="secondary" size="sm" onClick={suggestSkills} loading={suggesting} icon={<Sparkles size={14} />}>AI Suggest</Button>
          </div>
        </div>
      )}
      {items.map(item => (
        <div key={item.id} className="glass rounded-xl border border-white/8 p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Category" placeholder="Technical Skills" value={item.category} onChange={e => updateCategory(item.id, 'category', e.target.value)} />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Level</label>
              <select value={item.level} onChange={e => updateCategory(item.id, 'level', e.target.value)} className="form-input">
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {item.skills.map(skill => (
                <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs rounded-full">
                  {skill}
                  <button onClick={() => removeSkill(item.id, skill)} className="hover:text-red-400"><X size={10} /></button>
                </span>
              ))}
            </div>
            <input className="form-input text-sm" placeholder="Type a skill and press Enter..."
              value={skillInput[item.id] || ''}
              onChange={e => setSkillInput(p => ({ ...p, [item.id]: e.target.value }))}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(item.id, skillInput[item.id] || ''); } }} />
          </div>
          <div className="flex justify-end">
            <button onClick={() => removeCategory(item.id)} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
              <Trash2 size={12} /> Remove Category
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skills;
