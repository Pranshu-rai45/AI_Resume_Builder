import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Zap, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await authService.resetPassword(token, form);
      toast.success('Password reset successfully! You are now signed in.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-700/15 rounded-full blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <span className="text-xl font-bold gradient-text-blue">ResumeAI</span>
        </Link>

        <div className="glass rounded-2xl border border-white/10 p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Reset Password</h1>
          <p className="text-slate-400 text-sm mb-6">Enter your new password below.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="New Password" type="password" placeholder="Min. 8 characters" icon={<Lock size={16} />}
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} error={errors.password} required />
            <Input label="Confirm Password" type="password" placeholder="Repeat new password" icon={<Lock size={16} />}
              value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} error={errors.confirmPassword} required />
            <Button type="submit" variant="primary" className="w-full" size="lg" loading={loading}>
              Reset Password
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
