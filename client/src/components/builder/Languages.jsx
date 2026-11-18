import { Plus, Trash2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const PROFICIENCY_LEVELS = ['Elementary', 'Limited Working', 'Professional Working', 'Full Professional', 'Native/Bilingual'];
const emptyItem = () => ({ id: Math.random().toString(36).slice(2), language: '', proficiency: 'Professional Working' });

const Languages = () => {
  const { resumeData, updateSection } = useResume();
  const items = resumeData.languages || [];
  const update = (id, field, value) => updateSection('languages', items.map(i => i.id === id ? { ...i, [field]: value } : i));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-white mb-0.5">Languages</h2><p className="text-sm text-slate-400">Languages you speak or are proficient in</p></div>
        <Button variant="primary" size="sm" onClick={() => updateSection('languages', [...items, emptyItem()])} icon={<Plus size={14} />}>Add</Button>
      </div>
      {items.length === 0 && (
        <div className="text-center py-10 glass rounded-xl border border-white/8">
          <p className="text-slate-500 text-sm mb-3">No languages added yet</p>
          <Button variant="secondary" size="sm" onClick={() => updateSection('languages', [...items, emptyItem()])} icon={<Plus size={14} />}>Add Language</Button>
        </div>
      )}
      {items.map(item => (
        <div key={item.id} className="glass rounded-xl border border-white/8 p-4">
          <div className="flex items-end gap-3">
            <Input label="Language" placeholder="English" value={item.language} onChange={e => update(item.id, 'language', e.target.value)} className="flex-1" />
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Proficiency</label>
              <select value={item.proficiency} onChange={e => update(item.id, 'proficiency', e.target.value)} className="form-input">
                {PROFICIENCY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button onClick={() => updateSection('languages', items.filter(i => i.id !== item.id))} className="text-slate-500 hover:text-red-400 transition-colors pb-2"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Languages;
