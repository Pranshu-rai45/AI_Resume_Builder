import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, BarChart2, Download, TrendingUp, Sparkles } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { SkeletonCard } from '../../components/ui/Skeleton';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="glass rounded-2xl border border-white/8 p-5">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon size={18} className="text-white" /></div>
    <div className="text-2xl font-bold text-white">{value ?? '—'}</div>
    <div className="text-sm text-slate-400">{label}</div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(d => setStats(d.data)).catch(() => toast.error('Failed to load admin stats')).finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: Users, label: 'Total Users', value: stats?.totalUsers, color: 'bg-gradient-to-br from-blue-500 to-blue-600', delay: 0 },
    { icon: FileText, label: 'Total Resumes', value: stats?.totalResumes, color: 'bg-gradient-to-br from-purple-500 to-purple-600', delay: 0.1 },
    { icon: Download, label: 'Total Downloads', value: stats?.totalDownloads, color: 'bg-gradient-to-br from-emerald-500 to-emerald-600', delay: 0.2 },
    { icon: Sparkles, label: 'AI Generations', value: stats?.totalAIUsage, color: 'bg-gradient-to-br from-amber-500 to-amber-600', delay: 0.3 },
    { icon: TrendingUp, label: 'New This Month', value: stats?.newUsersThisMonth, color: 'bg-gradient-to-br from-rose-500 to-rose-600', delay: 0.4 },
    { icon: BarChart2, label: 'Active This Month', value: stats?.activeUsersThisMonth, color: 'bg-gradient-to-br from-cyan-500 to-cyan-600', delay: 0.5 },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Platform overview and analytics">
      <div className="p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />) : cards.map(c => <StatCard key={c.label} {...c} />)}
        </div>

        {/* Recent Users */}
        {stats?.recentUsers?.length > 0 && (
          <div className="glass rounded-2xl border border-white/8 p-5">
            <h3 className="font-semibold text-white mb-4">Recent Registrations</h3>
            <div className="space-y-3">
              {stats.recentUsers.map(u => (
                <div key={u._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {u.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 capitalize">{u.plan}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
