import { motion } from 'framer-motion';

const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-white/10 text-slate-300',
    primary: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
  };
  const sizes = { xs: 'px-1.5 py-0.5 text-xs', sm: 'px-2.5 py-1 text-xs', md: 'px-3 py-1.5 text-sm' };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
