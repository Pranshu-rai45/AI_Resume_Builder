import { Plus, Trash2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const emptyItem = () => ({ id: Math.random().toString(36).slice(2), name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', url: '' });

const Certifications = () => {
  const { resumeData, updateSection } = useResume();
  const items = resumeData.certifications || [];
  const update = (id, field, value) => updateSection('certifications', items.map(i => i.id === id ? { ...i, [field]: value } : i));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-white mb-0.5">Certifications</h2><p className="text-sm text-slate-400">Professional certifications and credentials</p></div>
        <Button variant="primary" size="sm" onClick={() => updateSection('certifications', [...items, emptyItem()])} icon={<Plus size={14} />}>Add</Button>
      </div>
      {items.length === 0 && (
        <div className="text-center py-10 glass rounded-xl border border-white/8">
          <p className="text-slate-500 text-sm mb-3">No certifications added yet</p>
          <Button variant="secondary" size="sm" onClick={() => updateSection('certifications', [...items, emptyItem()])} icon={<Plus size={14} />}>Add Certification</Button>
        </div>
      )}
      {items.map(item => (
        <div key={item.id} className="glass rounded-xl border border-white/8 p-4 space-y-3">
          <div className="flex justify-between">
            <p className="text-sm font-medium text-white">{item.name || 'New Certification'}</p>
            <button onClick={() => updateSection('certifications', items.filter(i => i.id !== item.id))} className="text-slate-500 hover:text-red-400"><Trash2 size={14} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Certification Name" placeholder="AWS Solutions Architect" value={item.name} onChange={e => update(item.id, 'name', e.target.value)} />
            <Input label="Issuing Organization" placeholder="Amazon Web Services" value={item.issuer} onChange={e => update(item.id, 'issuer', e.target.value)} />
            <Input label="Issue Date" type="month" value={item.issueDate} onChange={e => update(item.id, 'issueDate', e.target.value)} />
            <Input label="Expiry Date" type="month" value={item.expiryDate} onChange={e => update(item.id, 'expiryDate', e.target.value)} />
            <Input label="Credential ID" placeholder="ABC-123-XYZ" value={item.credentialId} onChange={e => update(item.id, 'credentialId', e.target.value)} />
            <Input label="Credential URL" placeholder="https://credly.com/..." value={item.url} onChange={e => update(item.id, 'url', e.target.value)} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Certifications;
