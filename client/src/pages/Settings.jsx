import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Lock, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ThemeToggle from '../components/ui/ThemeToggle';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwordForm.newPassword.length < 8) { toast.error('New password must be at least 8 characters'); return; }
    try {
      setChangingPassword(true);
      await authService.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await userService.deleteAccount(deletePassword);
      await logout();
    } catch (err) {
      toast.error(err.message);
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account preferences">
      <div className="p-4 lg:p-6 max-w-2xl space-y-5">
        {/* Theme */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-white/8 p-5">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            {theme === 'dark' ? <Moon size={16} className="text-blue-400" /> : <Sun size={16} className="text-amber-400" />}
            Appearance
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">Theme Mode</p>
              <p className="text-xs text-slate-500">Choose between dark and light mode</p>
            </div>
            <ThemeToggle />
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl border border-white/8 p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Lock size={16} className="text-blue-400" />Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <Input label="Current Password" type="password" value={passwordForm.currentPassword}
              onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))} required />
            <Input label="New Password" type="password" value={passwordForm.newPassword}
              onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))} hint="Minimum 8 characters" required />
            <Input label="Confirm New Password" type="password" value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))} required />
            <Button type="submit" variant="primary" size="sm" loading={changingPassword} icon={<Lock size={14} />}>Update Password</Button>
          </form>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl border border-red-500/20 p-5">
          <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2"><AlertTriangle size={16} />Danger Zone</h3>
          <p className="text-slate-400 text-sm mb-4">Permanently deactivate your account. This action cannot be undone.</p>
          <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>Delete Account</Button>
        </motion.div>
      </div>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account" size="sm">
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">This will permanently deactivate your account. Enter your password to confirm.</p>
          <Input label="Password" type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} placeholder="Enter your password" />
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" className="flex-1" onClick={handleDeleteAccount} loading={deleting}>Delete Account</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Settings;
