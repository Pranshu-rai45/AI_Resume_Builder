import { useState } from 'react';
import { v4 as uuidv4 } from 'https://esm.sh/uuid';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const emptyItem = () => ({
  id: Math.random().toString(36).slice(2),
  institution: '', degree: '', fieldOfStudy: '', startDate: '',
  endDate: '', current: false, gpa: '', description: '', location: ''
});

const Education = () => {
  const { resumeData, updateSection } = useResume();
  const items = resumeData.education || [];
  const [expanded, setExpanded] = useState(null);

  const addItem = () => {
    const newItem = emptyItem();
    updateSection('education', [...items, newItem]);
    setExpanded(newItem.id);
  };

  const updateItem = (id, field, value) => {
    updateSection('education', items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id) => {
    updateSection('education', items.filter(item => item.id !== id));
    if (expanded === id) setExpanded(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white mb-0.5">Education</h2>
          <p className="text-sm text-slate-400">Your academic background and qualifications</p>
        </div>
        <Button variant="primary" size="sm" onClick={addItem} icon={<Plus size={14} />}>Add</Button>
      </div>

      {items.length === 0 && (
        <div className="text-center py-10 glass rounded-xl border border-white/8">
          <p className="text-slate-500 text-sm mb-3">No education added yet</p>
          <Button variant="secondary" size="sm" onClick={addItem} icon={<Plus size={14} />}>Add Education</Button>
        </div>
      )}

      {items.map((item) => (
        <div key={item.id} className="glass rounded-xl border border-white/8 overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/4"
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
          >
            <div>
              <p className="text-sm font-medium text-white">{item.institution || 'New Education'}</p>
              <p className="text-xs text-slate-500">{[item.degree, item.fieldOfStudy].filter(Boolean).join(' in ') || 'Degree not specified'}</p>
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
                <Input label="Institution" placeholder="University Name" value={item.institution} onChange={e => updateItem(item.id, 'institution', e.target.value)} />
                <Input label="Degree" placeholder="Bachelor of Science" value={item.degree} onChange={e => updateItem(item.id, 'degree', e.target.value)} />
                <Input label="Field of Study" placeholder="Computer Science" value={item.fieldOfStudy} onChange={e => updateItem(item.id, 'fieldOfStudy', e.target.value)} />
                <Input label="GPA" placeholder="3.8 / 4.0" value={item.gpa} onChange={e => updateItem(item.id, 'gpa', e.target.value)} />
                <Input label="Start Date" type="month" value={item.startDate} onChange={e => updateItem(item.id, 'startDate', e.target.value)} />
                {!item.current && <Input label="End Date" type="month" value={item.endDate} onChange={e => updateItem(item.id, 'endDate', e.target.value)} />}
                <Input label="Location" placeholder="City, Country" value={item.location} onChange={e => updateItem(item.id, 'location', e.target.value)} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={item.current} onChange={e => updateItem(item.id, 'current', e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-sm text-slate-300">Currently studying here</span>
              </label>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Description (Optional)</label>
                <textarea rows={2} value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Relevant courses, honors, activities..." className="form-input resize-none" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Education;
