import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Save, Trash2, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleSave = async () => {
    try {
      setSaving(true);
      const data = await userService.updateProfile({ name });
      updateUser(data.data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const data = await userService.uploadAvatar(file);
      updateUser({ avatar: data.data.avatar });
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await userService.deleteAvatar();
      updateUser({ avatar: null });
      toast.success('Avatar removed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout title="Profile" subtitle="Manage your account information">
      <div className="p-4 lg:p-6 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-white/8 p-6">
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-6 pb-6 border-b border-white/8">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                {user?.avatar ? (
                  <img src={`http://localhost:5000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-3xl font-bold">{user?.name?.charAt(0)}</span>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
              >
                {uploading ? <Loader2 size={14} className="animate-spin text-white" /> : <Camera size={14} className="text-white" />}
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            <div>
              <h3 className="font-semibold text-white">{user?.name}</h3>
              <p className="text-sm text-slate-400">{user?.email}</p>
              <p className="text-xs text-slate-500 mt-0.5 capitalize">{user?.plan} Plan</p>
              {user?.avatar && (
                <button onClick={handleDeleteAvatar} className="text-xs text-red-400 hover:text-red-300 mt-1.5 flex items-center gap-1">
                  <Trash2 size={10} /> Remove photo
                </button>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} icon={<User size={16} />} />
            <Input label="Email Address" value={user?.email || ''} disabled inputClassName="opacity-60 cursor-not-allowed" hint="Email cannot be changed" />
            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={handleSave} loading={saving} icon={<Save size={14} />}>
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Plan', value: user?.plan?.toUpperCase() || 'FREE', color: 'text-blue-400' },
            { label: 'AI Usage', value: `${user?.aiUsageCount}/${user?.aiUsageLimit}`, color: 'text-purple-400' },
            { label: 'Role', value: user?.role?.toUpperCase() || 'USER', color: 'text-emerald-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass rounded-xl border border-white/8 p-3 text-center">
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
