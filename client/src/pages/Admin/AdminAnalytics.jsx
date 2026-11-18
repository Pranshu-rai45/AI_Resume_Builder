import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { SkeletonCard } from '../../components/ui/Skeleton';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics').then(d => setAnalytics(d.data)).catch(() => toast.error('Failed to load analytics')).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Analytics" subtitle="Platform usage statistics">
      <div className="p-4 lg:p-6 space-y-6">
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : (
          <>
            {/* Event Stats */}
            {analytics?.eventStats?.length > 0 && (
              <div className="glass rounded-2xl border border-white/8 p-5">
                <h3 className="font-semibold text-white mb-4">Event Distribution (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.eventStats.map(e => ({ name: e._id.replace(/_/g, ' '), count: e.count }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#E2E8F0' }} />
                    <Bar dataKey="count" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#7C3AED" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Daily Registrations */}
            {analytics?.dailyRegistrations?.length > 0 && (
              <div className="glass rounded-2xl border border-white/8 p-5">
                <h3 className="font-semibold text-white mb-4">Daily Registrations</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.dailyRegistrations.map(d => ({ date: d._id, count: d.count }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#E2E8F0' }} />
                    <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {analytics?.eventStats?.length === 0 && analytics?.dailyRegistrations?.length === 0 && (
              <div className="text-center py-16 glass rounded-2xl border border-white/8 text-slate-500">
                No analytics data yet. Data will appear as users interact with the platform.
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
