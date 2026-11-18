import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Loader2, X } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { aiService } from '../../services/aiService';
import Input from '../ui/Input';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const emptyItem = () => ({
  id: Math.random().toString(36).slice(2),
  name: '', description: '', technologies: [], startDate: '', endDate: '', current: false, url: '', github: ''
});

const Projects = () => {
  const { resumeData, updateSection } = useResume();
  const items = resumeData.projects || [];
  const [expanded, setExpanded] = useState(null);
  const [generating, setGenerating] = useState(null);
  const [techInput, setTechInput] = useState({});

  const addItem = () => { const n = emptyItem(); updateSection('projects', [...items, n]); setExpanded(n.id); };
  const updateItem = (id, field, value) => updateSection('projects', items.map(item => item.id === id ? { ...item, [field]: value } : item));
  const removeItem = (id) => { updateSection('projects', items.filter(item => item.id !== id)); if (expanded === id) setExpanded(null); };

  const addTech = (id, tech) => {
    if (!tech.trim()) return;
    const item = items.find(i => i.id === id);
    if (!item.technologies.includes(tech.trim())) {
      updateItem(id, 'technologies', [...(item.technologies || []), tech.trim()]);
    }
    setTechInput(p => ({ ...p, [id]: '' }));
  };

  const removeTech = (id, tech) => {
    const item = items.find(i => i.id === id);
    updateItem(id, 'technologies', item.technologies.filter(t => t !== tech));
  };

  const generateDescription = async (item) => {
    try {
      setGenerating(item.id);
      const data = await aiService.generateProject({
        projectName: item.name,
        technologies: item.technologies?.join(', '),
        role: 'Developer'
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
        <div><h2 className="text-lg font-bold text-white mb-0.5">Projects</h2><p className="text-sm text-slate-400">Showcase your best work</p></div>
        <Button variant="primary" size="sm" onClick={addItem} icon={<Plus size={14} />}>Add</Button>
      </div>
      {items.length === 0 && (
        <div className="text-center py-10 glass rounded-xl border border-white/8">
          <p className="text-slate-500 text-sm mb-3">No projects added yet</p>
          <Button variant="secondary" size="sm" onClick={addItem} icon={<Plus size={14} />}>Add Project</Button>
        </div>
      )}
      {items.map(item => (
        <div key={item.id} className="glass rounded-xl border border-white/8 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/4" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
            <div>
              <p className="text-sm font-medium text-white">{item.name || 'New Project'}</p>
              <p className="text-xs text-slate-500">{item.technologies?.slice(0, 3).join(', ') || 'No technologies'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={e => { e.stopPropagation(); removeItem(item.id); }} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              {expanded === item.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </div>
          </div>
          {expanded === item.id && (
            <div className="px-4 pb-4 space-y-3 border-t border-white/8 pt-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <Input label="Project Name" placeholder="My Awesome Project" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} />
                <Input label="Project URL" placeholder="https://project.com" value={item.url} onChange={e => updateItem(item.id, 'url', e.target.value)} />
                <Input label="GitHub" placeholder="https://github.com/..." value={item.github} onChange={e => updateItem(item.id, 'github', e.target.value)} />
                <Input label="Start Date" type="month" value={item.startDate} onChange={e => updateItem(item.id, 'startDate', e.target.value)} />
              </div>
              {/* Technologies */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Technologies</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(item.technologies || []).map(tech => (
                    <span key={tech} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs rounded-full">
                      {tech}
                      <button onClick={() => removeTech(item.id, tech)} className="hover:text-red-400"><X size={10} /></button>
                    </span>
                  ))}
                </div>
                <input
                  className="form-input text-sm"
                  placeholder="Type a technology and press Enter..."
                  value={techInput[item.id] || ''}
                  onChange={e => setTechInput(p => ({ ...p, [item.id]: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(item.id, techInput[item.id] || ''); } }}
                />
              </div>
              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-slate-300">Description</label>
                  <button type="button" onClick={() => generateDescription(item)} disabled={generating === item.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 text-xs font-medium disabled:opacity-50">
                    {generating === item.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Generate with AI
                  </button>
                </div>
                <textarea rows={3} value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} className="form-input resize-none" placeholder="Describe the project, your role, and impact..." />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Projects;
