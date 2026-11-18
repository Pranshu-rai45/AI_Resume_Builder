import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
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
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Account created! Welcome to ResumeAI! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    '3 free resumes to get started',
    '10 AI generations per month',
    'All 5 professional templates',
    'ATS score checker',
    'PDF export included',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-700/15 rounded-full blur-3xl" />

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left - Benefits */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold gradient-text-blue">ResumeAI</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Building Your{' '}
            <span className="gradient-text">Dream Resume</span>
          </h1>
          <p className="text-slate-400 mb-6">Join 50,000+ professionals who've landed their dream jobs with AI-powered resumes.</p>
          <div className="space-y-3">
            {benefits.map(b => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={11} className="text-emerald-400" />
                </div>
                <span className="text-slate-300 text-sm">{b}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="glass rounded-2xl border border-white/10 p-8 shadow-2xl shadow-black/50">
            <h2 className="text-xl font-bold text-white mb-1">Create your account</h2>
            <p className="text-slate-400 text-sm mb-6">Free forever. No credit card required.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" type="text" placeholder="John Doe" icon={<User size={16} />}
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} error={errors.name} required />
              <Input label="Email Address" type="email" placeholder="you@example.com" icon={<Mail size={16} />}
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} error={errors.email} required />
              <Input label="Password" type="password" placeholder="Min. 8 characters" icon={<Lock size={16} />}
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} error={errors.password} required />
              <Input label="Confirm Password" type="password" placeholder="Repeat your password" icon={<Lock size={16} />}
                value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} error={errors.confirmPassword} required />

              <Button type="submit" variant="primary" className="w-full" size="lg" loading={loading}>
                Create Free Account
                {!loading && <ArrowRight size={16} />}
              </Button>
            </form>

            <p className="text-center text-slate-500 text-xs mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
            </p>
            <p className="text-center text-slate-600 text-xs mt-3">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
