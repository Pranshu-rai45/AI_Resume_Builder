import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import CircularProgress from '../components/ui/CircularProgress';
import { resumeService } from '../services/resumeService';
import { atsService } from '../services/atsService';
import { SkeletonCard } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const ATSChecker = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    resumeService.getResumes({ limit: 50 }).then(d => {
      setResumes(d.data);
      if (d.data.length > 0) setSelectedResume(d.data[0]._id);
    }).catch(() => toast.error('Failed to load resumes')).finally(() => setLoadingResumes(false));
  }, []);

  const handleCheck = async () => {
    if (!selectedResume) { toast.error('Please select a resume'); return; }
    try {
      setLoading(true);
      setResult(null);
      const data = await atsService.checkATS(selectedResume);
      setResult(data.data);
      toast.success(`ATS Score: ${data.data.score}/100`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return { label: 'Excellent', color: '#10B981' };
    if (score >= 60) return { label: 'Good', color: '#F59E0B' };
    if (score >= 40) return { label: 'Fair', color: '#F97316' };
    return { label: 'Needs Work', color: '#EF4444' };
  };

  return (
    <DashboardLayout title="ATS Checker" subtitle="Optimize your resume for Applicant Tracking Systems">
      <div className="p-4 lg:p-6 max-w-4xl">
        {/* Select Resume */}
        <div className="glass rounded-2xl border border-white/8 p-5 mb-5">
          <h3 className="font-semibold text-white mb-3">Select Resume to Analyze</h3>
          {loadingResumes ? <SkeletonCard /> : (
            <div className="flex gap-3">
              <select
                value={selectedResume}
                onChange={e => setSelectedResume(e.target.value)}
                className="form-input flex-1"
              >
                <option value="">Choose a resume...</option>
                {resumes.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
              </select>
              <Button variant="primary" onClick={handleCheck} loading={loading} icon={<BarChart2 size={16} />}>
                Analyze ATS Score
              </Button>
            </div>
          )}
          {resumes.length === 0 && !loadingResumes && (
            <p className="text-slate-500 text-sm mt-2">No resumes found. Create a resume first to analyze its ATS score.</p>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16 glass rounded-2xl border border-white/8">
            <Loader2 size={36} className="animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-1">Analyzing your resume...</p>
            <p className="text-slate-400 text-sm">Checking for ATS compatibility, keywords, and more</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Score Overview */}
            <div className="glass rounded-2xl border border-white/8 p-6">
              <div className="flex items-center gap-6">
                <CircularProgress value={result.score} size={100} strokeWidth={8} label="/100" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {getScoreLabel(result.score).label}
                  </h3>
                  <p className="text-slate-400 text-sm mb-2">
                    Your ATS compatibility score is <strong style={{ color: getScoreLabel(result.score).color }}>{result.score}/100</strong>
                  </p>
                  <p className="text-xs text-slate-500">
                    {result.score >= 80
                      ? 'Your resume is well-optimized for ATS systems. Great job!'
                      : 'Follow the suggestions below to improve your ATS score.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Strengths */}
              {result.strengths?.length > 0 && (
                <div className="glass rounded-2xl border border-emerald-500/20 p-5">
                  <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2"><CheckCircle2 size={16} /> Strengths</h4>
                  <ul className="space-y-2">
                    {result.strengths.map((s, i) => <li key={i} className="text-sm text-slate-300 flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span>{s}</li>)}
                  </ul>
                </div>
              )}
              {/* Formatting Issues */}
              {result.formattingIssues?.length > 0 && (
                <div className="glass rounded-2xl border border-red-500/20 p-5">
                  <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2"><XCircle size={16} /> Issues Found</h4>
                  <ul className="space-y-2">
                    {result.formattingIssues.map((s, i) => <li key={i} className="text-sm text-slate-300 flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span>{s}</li>)}
                  </ul>
                </div>
              )}
              {/* Suggestions */}
              {result.suggestions?.length > 0 && (
                <div className="glass rounded-2xl border border-amber-500/20 p-5">
                  <h4 className="font-semibold text-amber-400 mb-3 flex items-center gap-2"><AlertTriangle size={16} /> Suggestions</h4>
                  <ul className="space-y-2">
                    {result.suggestions.map((s, i) => <li key={i} className="text-sm text-slate-300 flex items-start gap-2"><span className="text-amber-400 mt-0.5">→</span>{s}</li>)}
                  </ul>
                </div>
              )}
              {/* Missing Keywords */}
              {result.missingKeywords?.length > 0 && (
                <div className="glass rounded-2xl border border-blue-500/20 p-5">
                  <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2"><BarChart2 size={16} /> Missing Keywords</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingKeywords.map(kw => (
                      <span key={kw} className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs rounded-full">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Re-analyze */}
            <div className="text-center">
              <Button variant="secondary" onClick={handleCheck} icon={<RefreshCw size={14} />}>Re-analyze</Button>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ATSChecker;
