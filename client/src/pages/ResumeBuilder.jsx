import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Save, Download, Eye, EyeOff,
  Sparkles, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import { useResume } from '../context/ResumeContext';
import { resumeService } from '../services/resumeService';
import toast from 'react-hot-toast';
import { exportToPDF } from '../utils/pdfExport';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Builder steps
import PersonalDetails from '../components/builder/PersonalDetails';
import Education from '../components/builder/Education';
import Experience from '../components/builder/Experience';
import Projects from '../components/builder/Projects';
import Skills from '../components/builder/Skills';
import Achievements from '../components/builder/Achievements';
import Certifications from '../components/builder/Certifications';
import Languages from '../components/builder/Languages';
import Interests from '../components/builder/Interests';
import SocialLinks from '../components/builder/SocialLinks';
import LivePreview from '../components/builder/LivePreview';
import StepIndicator from '../components/builder/StepIndicator';

const STEPS = [
  { id: 'personal', label: 'Personal Details', component: PersonalDetails },
  { id: 'education', label: 'Education', component: Education },
  { id: 'experience', label: 'Experience', component: Experience },
  { id: 'projects', label: 'Projects', component: Projects },
  { id: 'skills', label: 'Skills', component: Skills },
  { id: 'achievements', label: 'Achievements', component: Achievements },
  { id: 'certifications', label: 'Certifications', component: Certifications },
  { id: 'languages', label: 'Languages', component: Languages },
  { id: 'interests', label: 'Interests', component: Interests },
  { id: 'social', label: 'Social Links', component: SocialLinks },
];

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadResume, resumeData, saving, isDirty, saveNow, currentResume } = useResume();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    if (id) {
      loadResume(id).then(() => setLoading(false)).catch(err => {
        toast.error('Failed to load resume');
        navigate('/resumes');
      });
    } else {
      // Create new resume on mount
      resumeService.createResume({ title: 'My Resume' }).then(data => {
        navigate(`/resume/${data.data._id}`, { replace: true });
      }).catch(err => {
        toast.error(err.message);
        navigate('/resumes');
      });
    }
  }, [id]);

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const el = previewRef.current;
      if (!el) {
        toast.error('Resume preview not ready for export');
        return;
      }

      await exportToPDF(el, resumeData.title || 'resume');

      if (currentResume?._id) {
        resumeService.trackDownload(currentResume._id).catch(() => {});
      }
      toast.success('PDF downloaded successfully! 🎉');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error(err?.message || 'PDF export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  if (loading) {
    return (
      <DashboardLayout title="Resume Builder">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-blue-400" />
            <p className="text-slate-400">Loading resume...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={resumeData.title || 'Resume Builder'}
      subtitle={`Step ${currentStep + 1} of ${STEPS.length} • ${STEPS[currentStep].label}`}
      actions={
        <div className="flex items-center gap-2">
          {/* Autosave indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            {saving ? (
              <><Loader2 size={12} className="animate-spin text-blue-400" /><span className="text-blue-400">Saving...</span></>
            ) : isDirty ? (
              <><AlertCircle size={12} className="text-amber-400" /><span className="text-amber-400">Unsaved</span></>
            ) : (
              <><CheckCircle2 size={12} className="text-emerald-400" /><span>Saved</span></>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowPreview(v => !v)}>
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Preview'}</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={saveNow} loading={saving}>
            <Save size={14} /> Save
          </Button>
          <Button variant="primary" size="sm" onClick={handleExportPDF} loading={exporting}>
            <Download size={14} /> PDF
          </Button>
        </div>
      }
    >
      <div className="flex h-full overflow-hidden">
        {/* Editor Panel */}
        <div className={`flex-1 flex flex-col overflow-hidden ${showPreview ? 'hidden lg:flex' : 'flex'}`}>
          {/* Step Indicator */}
          <div className="flex-shrink-0 px-4 lg:px-6 pt-4">
            <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} />
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <CurrentStepComponent />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex-shrink-0 px-4 lg:px-6 py-4 border-t border-white/8 flex items-center justify-between gap-3">
            <Button
              variant="secondary" size="sm"
              onClick={() => setCurrentStep(p => Math.max(0, p - 1))}
              disabled={currentStep === 0}
              icon={<ChevronLeft size={16} />}
            >
              Previous
            </Button>
            <span className="text-xs text-slate-500">{currentStep + 1} / {STEPS.length}</span>
            {currentStep < STEPS.length - 1 ? (
              <Button
                variant="primary" size="sm"
                onClick={() => setCurrentStep(p => p + 1)}
                iconRight={<ChevronRight size={16} />}
              >
                Next
              </Button>
            ) : (
              <Button variant="success" size="sm" onClick={handleExportPDF} loading={exporting}>
                <Download size={14} /> Export PDF
              </Button>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className={`${showPreview ? 'flex' : 'hidden lg:flex'} w-full lg:w-[45%] xl:w-[42%] flex-shrink-0 border-l border-white/8 flex-col`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 flex-shrink-0">
            <span className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
              <Eye size={14} className="text-blue-400" />
              Live Preview
            </span>
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)} className="lg:hidden">
              <ChevronRight size={14} /> Back
            </Button>
          </div>
          <div className="flex-1 overflow-auto bg-slate-800/30 p-4">
            <div className="origin-top scale-75 md:scale-90 lg:scale-75 xl:scale-90 transition-transform">
              <div ref={previewRef}>
                <LivePreview resumeData={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilder;
