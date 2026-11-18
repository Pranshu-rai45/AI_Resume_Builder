import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/ui/Badge';
import { SkeletonCard } from '../../components/ui/Skeleton';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/users', { params: { search } }).then(d => setUsers(d.data)).catch(() => toast.error('Failed to load users')).finally(() => setLoading(false));
  }, [search]);

  const planVariant = { free: 'default', pro: 'primary', enterprise: 'purple' };

  return (
    <DashboardLayout title="Users" subtitle="Manage all platform users">
      <div className="p-4 lg:p-6">
        <div className="relative mb-4 w-64">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="form-input pl-10 w-full" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : (
          <div className="glass rounded-2xl border border-white/8 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  {['User', 'Email', 'Plan', 'Role', 'AI Usage', 'Joined'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user.name?.charAt(0)}
                        </div>
                        <span className="text-sm text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{user.email}</td>
                    <td className="px-4 py-3"><Badge variant={planVariant[user.plan] || 'default'} className="capitalize">{user.plan}</Badge></td>
                    <td className="px-4 py-3">
                      {user.role === 'admin' ? (
                        <Badge variant="purple"><Shield size={10} /> Admin</Badge>
                      ) : (
                        <Badge variant="default">User</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{user.aiUsageCount}/{user.aiUsageLimit}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{format(new Date(user.createdAt), 'MMM d, yyyy')}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-sm">No users found</div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
