import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, FileText, Trash2, Copy, Share2,
  BarChart2, Download, MoreVertical, X
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import CircularProgress from '../components/ui/CircularProgress';
import { SkeletonCard } from '../components/ui/Skeleton';
import { resumeService } from '../services/resumeService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';

const MyResumes = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await resumeService.getResumes({ search, sort: '-updatedAt' });
      setResumes(data.data);
    } catch {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadResumes(); }, [search]);

  const handleCreate = async () => {
    try {
      setCreating(true);
      const data = await resumeService.createResume({ title: `Resume ${resumes.length + 1}` });
      navigate(`/resume/${data.data._id}`);
    } catch (err) {
      toast.error(err.message);
      setCreating(false);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await resumeService.duplicateResume(id);
      toast.success('Resume duplicated!');
      loadResumes();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleShare = async (id) => {
    try {
      const data = await resumeService.shareResume(id);
      await navigator.clipboard.writeText(data.shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch {
      toast.error('Failed to generate share link');
    }
  };

  const handleDelete = async () => {
    try {
      await resumeService.deleteResume(deleteModal);
      setDeleteModal(null);
      toast.success('Resume deleted');
      setResumes(prev => prev.filter(r => r._id !== deleteModal));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout
      title="My Resumes"
      subtitle="Manage and edit all your resumes"
      actions={
        <Button variant="primary" size="sm" icon={<Plus size={16} />} onClick={handleCreate} loading={creating}>
          New Resume
        </Button>
      }
    >
      <div className="p-4 lg:p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search resumes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input pl-10 w-full md:w-72"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-24 glass rounded-2xl border border-white/8">
            <FileText size={40} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">{search ? 'No resumes found' : 'No resumes yet'}</h3>
            <p className="text-slate-500 text-sm mb-5">{search ? 'Try a different search term' : 'Create your first AI-powered resume'}</p>
            {!search && <Button variant="primary" size="sm" onClick={handleCreate} loading={creating}><Plus size={16} /> Create Resume</Button>}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume, i) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl border border-white/8 hover:border-white/20 p-5 transition-all group relative"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="flex-1 cursor-pointer min-w-0"
                    onClick={() => navigate(`/resume/${resume._id}`)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center mb-2">
                      <FileText size={18} className="text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-white text-sm truncate group-hover:text-blue-400 transition-colors">{resume.title}</h3>
                    <p className="text-xs text-slate-500 capitalize">{resume.template} • {format(new Date(resume.updatedAt), 'MMM d, yyyy')}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <CircularProgress value={resume.atsScore || 0} size={44} strokeWidth={4} label="ATS" />
                    {/* Menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === resume._id ? null : resume._id); }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-all"
                      >
                        <MoreVertical size={14} />
                      </button>
                      <AnimatePresence>
                        {activeMenu === resume._id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -5 }}
                            className="absolute right-0 top-8 z-20 w-40 bg-slate-800 rounded-xl border border-white/10 shadow-2xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                          >
                            {[
                              { icon: Copy, label: 'Duplicate', action: () => { handleDuplicate(resume._id); setActiveMenu(null); } },
                              { icon: Share2, label: 'Share', action: () => { handleShare(resume._id); setActiveMenu(null); } },
                              { icon: Trash2, label: 'Delete', action: () => { setDeleteModal(resume._id); setActiveMenu(null); }, danger: true },
                            ].map(({ icon: Icon, label, action, danger }) => (
                              <button key={label} onClick={action}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${danger ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-300 hover:bg-white/8 hover:text-white'}`}>
                                <Icon size={14} /> {label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="flex gap-2 pt-3 border-t border-white/6">
                  <Button variant="ghost" size="sm" className="flex-1 text-xs" onClick={() => navigate(`/resume/${resume._id}`)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs px-2" onClick={() => navigate(`/ats-checker?resumeId=${resume._id}`)}>
                    <BarChart2 size={12} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Resume" size="sm">
        <p className="text-slate-400 text-sm mb-5">Are you sure you want to delete this resume? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteModal(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}><Trash2 size={14} /> Delete</Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default MyResumes;
