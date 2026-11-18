import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Button = forwardRef(({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false, className = '',
  onClick, type = 'button', icon, iconRight, ...props
}, ref) => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/20',
    ghost: 'text-slate-300 hover:text-white hover:bg-white/8',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/20 hover:-translate-y-0.5',
    outline: 'border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5',
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        transition-all duration-200 cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${sizes[size]} ${variants[variant]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? <span className="w-4 h-4 flex-shrink-0">{icon}</span> : null}
      {children}
      {!loading && iconRight ? <span className="w-4 h-4 flex-shrink-0">{iconRight}</span> : null}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
