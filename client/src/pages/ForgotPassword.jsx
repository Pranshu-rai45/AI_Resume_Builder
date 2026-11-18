import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Zap, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    try {
      setLoading(true);
      await authService.forgotPassword(email);
      setSent(true);
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
          {!sent ? (
            <>
              <h1 className="text-2xl font-bold text-white mb-1">Forgot Password?</h1>
              <p className="text-slate-400 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email Address" type="email" placeholder="you@example.com" icon={<Mail size={16} />}
                  value={email} onChange={e => { setEmail(e.target.value); setError(''); }} error={error} required />
                <Button type="submit" variant="primary" className="w-full" size="lg" loading={loading}>
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check your email!</h2>
              <p className="text-slate-400 text-sm mb-2">We sent a password reset link to</p>
              <p className="text-blue-400 font-medium text-sm mb-4">{email}</p>
              <p className="text-slate-500 text-xs">The link expires in 1 hour. Check your spam folder if you don't see it.</p>
            </div>
          )}
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

export default ForgotPassword;
