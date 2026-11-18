import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import { resumeService } from '../services/resumeService';
import toast from 'react-hot-toast';

const TEMPLATES = [
  { id: 'latex', name: 'LaTeX CS Tech', desc: 'Classic Jake\'s Resume / Academic CS Tech format with serif typography and horizontal section lines.', color: '#0F172A', features: ['100% ATS Top Score', 'Academic Serif Style', 'Clean Section Rules'] },
  { id: 'modern', name: 'Modern', desc: 'Clean sidebar layout with bold typography. Perfect for tech and design roles.', color: '#2563EB', features: ['Sidebar layout', 'Color customization', 'Skills visualization'] },
  { id: 'professional', name: 'Professional', desc: 'Traditional centered format with serif typography. Ideal for business and finance.', color: '#1E3A8A', features: ['Centered header', 'Serif fonts', 'Classic layout'] },
  { id: 'minimal', name: 'Minimal', desc: 'Elegant whitespace with timeline layout. Great for creative professionals.', color: '#374151', features: ['Maximum whitespace', 'Timeline layout', 'Clean typography'] },
  { id: 'creative', name: 'Creative', desc: 'Gradient header with multi-column layout. For those who want to stand out.', color: '#7C3AED', features: ['Gradient header', '3-column layout', 'Visual hierarchy'] },
  { id: 'corporate', name: 'Corporate', desc: 'Dark executive header with competency grids. For leadership and executive roles.', color: '#1F2937', features: ['Dark header', 'Competency grids', 'Executive style'] },
];

const Templates = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleUseTemplate = async (templateId) => {
    try {
      setCreating(true);
      const data = await resumeService.createResume({ title: 'My Resume', template: templateId });
      navigate(`/resume/${data.data._id}`);
    } catch (err) {
      toast.error(err.message);
      setCreating(false);
    }
  };

  return (
    <DashboardLayout title="Resume Templates" subtitle="Choose a template to start building your resume">
      <div className="p-4 lg:p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {TEMPLATES.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(selected === template.id ? null : template.id)}
              className={`cursor-pointer rounded-2xl border-2 transition-all ${
                selected === template.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/8 bg-white/4 hover:border-white/20 hover:bg-white/7'
              }`}
            >
              {/* Template Preview */}
              <div className="aspect-[3/4] rounded-xl overflow-hidden m-3 relative"
                style={{ background: `linear-gradient(135deg, ${template.color}20, ${template.color}40)` }}>
                <div style={{ background: template.color }} className="h-16 flex items-center px-3">
                  <div className="space-y-1.5">
                    <div className="w-20 h-2 bg-white/70 rounded" />
                    <div className="w-14 h-1.5 bg-white/40 rounded" />
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {[...Array(8)].map((_, j) => (
                    <div key={j} className="h-1.5 bg-white/20 rounded" style={{ width: `${95 - j * 6}%` }} />
                  ))}
                </div>
                {selected === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                )}
              </div>
              <div className="px-3 pb-3">
                <h3 className="font-semibold text-white text-sm mb-1">{template.name}</h3>
                <p className="text-xs text-slate-400 mb-2 leading-relaxed">{template.desc}</p>
                <div className="space-y-1 mb-3">
                  {template.features.map(f => (
                    <div key={f} className="flex items-center gap-1.5 text-xs text-slate-500">
                      <div className="w-1 h-1 rounded-full" style={{ background: template.color }} />
                      {f}
                    </div>
                  ))}
                </div>
                <Button
                  variant={selected === template.id ? 'primary' : 'secondary'}
                  size="sm"
                  className="w-full text-xs"
                  onClick={(e) => { e.stopPropagation(); handleUseTemplate(template.id); }}
                  loading={creating}
                >
                  {selected === template.id ? 'Use This Template' : 'Preview'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Templates;
