import { Plus, Trash2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const emptyItem = () => ({ id: Math.random().toString(36).slice(2), title: '', description: '', date: '', issuer: '' });

const Achievements = () => {
  const { resumeData, updateSection } = useResume();
  const items = resumeData.achievements || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-white mb-0.5">Achievements</h2><p className="text-sm text-slate-400">Awards, recognitions, and notable accomplishments</p></div>
        <Button variant="primary" size="sm" onClick={() => updateSection('achievements', [...items, emptyItem()])} icon={<Plus size={14} />}>Add</Button>
      </div>
      {items.length === 0 && (
        <div className="text-center py-10 glass rounded-xl border border-white/8">
          <p className="text-slate-500 text-sm mb-3">No achievements added yet</p>
          <Button variant="secondary" size="sm" onClick={() => updateSection('achievements', [...items, emptyItem()])} icon={<Plus size={14} />}>Add Achievement</Button>
        </div>
      )}
      {items.map(item => (
        <div key={item.id} className="glass rounded-xl border border-white/8 p-4 space-y-3">
          <div className="flex justify-between">
            <p className="text-sm font-medium text-white">{item.title || 'New Achievement'}</p>
            <button onClick={() => updateSection('achievements', items.filter(i => i.id !== item.id))} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Title" placeholder="Employee of the Year" value={item.title} onChange={e => updateSection('achievements', items.map(i => i.id === item.id ? { ...i, title: e.target.value } : i))} />
            <Input label="Issuer / Organization" placeholder="Company Name" value={item.issuer} onChange={e => updateSection('achievements', items.map(i => i.id === item.id ? { ...i, issuer: e.target.value } : i))} />
            <Input label="Date" type="month" value={item.date} onChange={e => updateSection('achievements', items.map(i => i.id === item.id ? { ...i, date: e.target.value } : i))} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1">Description</label>
            <textarea rows={2} value={item.description} onChange={e => updateSection('achievements', items.map(i => i.id === item.id ? { ...i, description: e.target.value } : i))} className="form-input resize-none" placeholder="Briefly describe the achievement..." />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Achievements;
