import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import Button from '../ui/Button';

const Interests = () => {
  const { resumeData, updateSection } = useResume();
  const items = resumeData.interests || [];
  const [input, setInput] = useState('');

  const addInterest = () => {
    if (!input.trim()) return;
    if (!items.includes(input.trim())) {
      updateSection('interests', [...items, input.trim()]);
    }
    setInput('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white mb-0.5">Interests & Hobbies</h2>
        <p className="text-sm text-slate-400">Personal interests that show your character</p>
      </div>
      <div className="glass rounded-xl border border-white/8 p-4 space-y-3">
        <div className="flex flex-wrap gap-2 min-h-12">
          {items.map(interest => (
            <span key={interest} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm rounded-full">
              {interest}
              <button onClick={() => updateSection('interests', items.filter(i => i !== interest))} className="hover:text-red-400 transition-colors"><X size={12} /></button>
            </span>
          ))}
          {items.length === 0 && <p className="text-slate-500 text-sm">No interests added yet</p>}
        </div>
        <div className="flex gap-2">
          <input
            className="form-input flex-1 text-sm"
            placeholder="Type an interest and press Enter or Add..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }}
          />
          <Button variant="primary" size="sm" onClick={addInterest} icon={<Plus size={14} />}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/8">
          <p className="w-full text-xs text-slate-500 mb-1">Suggestions:</p>
          {['Photography', 'Hiking', 'Machine Learning', 'Open Source', 'Reading', 'Gaming', 'Travel', 'Music'].map(s => (
            <button key={s} onClick={() => { if (!items.includes(s)) updateSection('interests', [...items, s]); }}
              className="px-2 py-0.5 text-xs rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all">
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Interests;
