import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { aiService } from '../../services/aiService';
import Input from '../ui/Input';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const emptyItem = () => ({
  id: Math.random().toString(36).slice(2),
  company: '', position: '', startDate: '', endDate: '',
  current: false, location: '', description: '', achievements: []
});

const Experience = () => {
  const { resumeData, updateSection } = useResume();
  const items = resumeData.experience || [];
  const [expanded, setExpanded] = useState(null);
  const [generating, setGenerating] = useState(null);

  const addItem = () => {
    const newItem = emptyItem();
    updateSection('experience', [...items, newItem]);
    setExpanded(newItem.id);
  };

  const updateItem = (id, field, value) =>
    updateSection('experience', items.map(item => item.id === id ? { ...item, [field]: value } : item));

  const removeItem = (id) => {
    updateSection('experience', items.filter(item => item.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const generateDescription = async (item) => {
    try {
      setGenerating(item.id);
      const data = await aiService.generateExperience({
        company: item.company,
        position: item.position,
        duration: item.startDate && item.endDate ? `${item.startDate} to ${item.endDate}` : undefined
      });
      updateItem(item.id, 'description', data.data);
      toast.success('Description generated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white mb-0.5">Work Experience</h2>
          <p className="text-sm text-slate-400">Your professional work history</p>
        </div>
        <Button variant="primary" size="sm" onClick={addItem} icon={<Plus size={14} />}>Add</Button>
      </div>

      {items.length === 0 && (
        <div className="text-center py-10 glass rounded-xl border border-white/8">
          <p className="text-slate-500 text-sm mb-3">No experience added yet</p>
          <Button variant="secondary" size="sm" onClick={addItem} icon={<Plus size={14} />}>Add Experience</Button>
        </div>
      )}

      {items.map((item) => (
        <div key={item.id} className="glass rounded-xl border border-white/8 overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/4"
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
          >
            <div>
              <p className="text-sm font-medium text-white">{item.position || 'New Position'}</p>
              <p className="text-xs text-slate-500">{item.company || 'Company'} {item.startDate ? `• ${item.startDate}` : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={e => { e.stopPropagation(); removeItem(item.id); }} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
              {expanded === item.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </div>
          </div>
          {expanded === item.id && (
            <div className="px-4 pb-4 space-y-3 border-t border-white/8 pt-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <Input label="Company" placeholder="Google" value={item.company} onChange={e => updateItem(item.id, 'company', e.target.value)} />
                <Input label="Position" placeholder="Software Engineer" value={item.position} onChange={e => updateItem(item.id, 'position', e.target.value)} />
                <Input label="Start Date" type="month" value={item.startDate} onChange={e => updateItem(item.id, 'startDate', e.target.value)} />
                {!item.current && <Input label="End Date" type="month" value={item.endDate} onChange={e => updateItem(item.id, 'endDate', e.target.value)} />}
                <Input label="Location" placeholder="Mountain View, CA" value={item.location} onChange={e => updateItem(item.id, 'location', e.target.value)} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={item.current} onChange={e => updateItem(item.id, 'current', e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-sm text-slate-300">Currently working here</span>
              </label>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">Description & Achievements</label>
                  <button
                    type="button"
                    onClick={() => generateDescription(item)}
                    disabled={generating === item.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all text-xs font-medium disabled:opacity-50"
                  >
                    {generating === item.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Generate with AI
                  </button>
                </div>
                <textarea rows={5} value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)}
                  placeholder="• Led development of...\n• Improved performance by...\n• Implemented..." className="form-input resize-none" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Experience;
