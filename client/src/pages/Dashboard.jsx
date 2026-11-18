import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Download, BarChart2, Clock, Plus, Sparkles,
  ArrowRight, TrendingUp, Zap, Eye
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';
import CircularProgress from '../components/ui/CircularProgress';
import { resumeService } from '../services/resumeService';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass rounded-2xl p-5 border border-white/8 hover:border-white/15 transition-all group"
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg`}>
        <Icon size={18} className="text-white" />
      </div>
      <TrendingUp size={14} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
    <div className="text-sm text-slate-400">{label}</div>
    {sub && <div className="text-xs text-slate-600 mt-0.5">{sub}</div>}
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, resumesData] = await Promise.all([
          resumeService.getStats(),
          resumeService.getResumes({ limit: 4, sort: '-updatedAt' })
        ]);
        setStats(statsData.data);
        setResumes(resumesData.data);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoadingStats(false);
        setLoadingResumes(false);
      }
    };
    loadData();
  }, []);

  const handleCreateResume = async () => {
    try {
      setCreating(true);
      const data = await resumeService.createResume({ title: 'My Resume' });
      navigate(`/resume/${data.data._id}`);
    } catch (err) {
      toast.error(err.message);
      setCreating(false);
    }
  };

  const statCards = [
    { icon: FileText, label: 'Total Resumes', value: stats?.totalResumes ?? '—', color: 'bg-gradient-to-br from-blue-500 to-blue-600', delay: 0 },
    { icon: Download, label: 'Total Downloads', value: stats?.totalDownloads ?? '—', color: 'bg-gradient-to-br from-purple-500 to-purple-600', delay: 0.1 },
    { icon: BarChart2, label: 'Avg ATS Score', value: stats?.avgAtsScore ? `${stats.avgAtsScore}%` : '—', color: 'bg-gradient-to-br from-emerald-500 to-emerald-600', delay: 0.2 },
    { icon: Clock, label: 'Last Updated', value: stats?.lastResumeTitle ?? '—', sub: stats?.lastUpdated ? format(new Date(stats.lastUpdated), 'MMM d, yyyy') : null, color: 'bg-gradient-to-br from-amber-500 to-amber-600', delay: 0.3 },
  ];

  return (
    <DashboardLayout
      title={`Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, ${user?.name?.split(' ')[0]}! 👋`}
      subtitle="Here's what's happening with your resumes"
      actions={
        <Button variant="primary" size="sm" icon={<Plus size={16} />} onClick={handleCreateResume} loading={creating}>
          New Resume
        </Button>
      }
    >
      <div className="p-4 lg:p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingStats
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : statCards.map(card => <StatCard key={card.label} {...card} />)
          }
        </div>

        {/* AI Usage bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl border border-white/8 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" />
              <span className="font-semibold text-white text-sm">AI Usage This Month</span>
            </div>
            <span className="text-xs text-slate-400">{user?.plan === 'free' ? 'Free Plan' : 'Pro Plan'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/6 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((user?.aiUsageCount / user?.aiUsageLimit) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
              />
            </div>
            <span className="text-sm text-slate-400 flex-shrink-0">
              {user?.aiUsageCount}/{user?.aiUsageLimit}
            </span>
          </div>
          {user?.plan === 'free' && (
            <p className="text-xs text-slate-500 mt-2">
              Upgrade to Pro for unlimited AI generations.{' '}
              <button className="text-blue-400 hover:text-blue-300">Upgrade →</button>
            </p>
          )}
        </motion.div>

        {/* Recent Resumes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Recent Resumes</h2>
            <Link to="/resumes" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loadingResumes ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : resumes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 glass rounded-2xl border border-white/8"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <FileText size={28} className="text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">No resumes yet</h3>
              <p className="text-slate-500 text-sm mb-4">Create your first AI-powered resume</p>
              <Button variant="primary" size="sm" onClick={handleCreateResume} loading={creating}>
                <Plus size={16} /> Create Resume
              </Button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {resumes.map((resume, i) => (
                <motion.div
                  key={resume._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl border border-white/8 hover:border-white/20 p-5 transition-all group cursor-pointer"
                  onClick={() => navigate(`/resume/${resume._id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center">
                        <FileText size={18} className="text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">{resume.title}</h3>
                        <p className="text-xs text-slate-500 capitalize">{resume.template} Template</p>
                      </div>
                    </div>
                    <CircularProgress value={resume.atsScore || 0} size={48} strokeWidth={5} label="ATS" />
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs text-slate-600">Updated {format(new Date(resume.updatedAt), 'MMM d')}</span>
                    <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye size={12} className="text-blue-400" />
                      <span className="text-xs text-blue-400">Open</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Plus, label: 'New Resume', color: 'from-blue-500 to-blue-600', action: handleCreateResume },
              { icon: Sparkles, label: 'AI Assistant', color: 'from-purple-500 to-purple-600', path: '/ai-assistant' },
              { icon: BarChart2, label: 'ATS Checker', color: 'from-emerald-500 to-emerald-600', path: '/ats-checker' },
              { icon: Zap, label: 'Templates', color: 'from-amber-500 to-amber-600', path: '/templates' },
            ].map(({ icon: Icon, label, color, action, path }) => (
              <motion.div
                key={label}
                whileHover={{ y: -4 }}
                onClick={action || (() => navigate(path))}
                className="glass rounded-xl border border-white/8 hover:border-white/20 p-4 text-center cursor-pointer transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={18} className="text-white" />
                </div>
                <p className="text-xs font-medium text-slate-300">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
