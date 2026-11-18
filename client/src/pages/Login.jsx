import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await login(form);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-700/15 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <span className="text-xl font-bold gradient-text-blue">ResumeAI</span>
        </Link>

        {/* Card */}
        <div className="glass rounded-2xl border border-white/10 p-8 shadow-2xl shadow-black/50">
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              error={errors.email}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={<Lock size={16} />}
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              error={errors.password}
              required
            />

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-full" size="lg" loading={loading}>
              Sign In
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>

          {/* Demo hint */}
          <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
            <p className="text-xs text-blue-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-blue-300 hover:text-white transition-colors">
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
