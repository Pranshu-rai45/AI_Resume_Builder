import { forwardRef, useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label, error, hint, icon, required = false,
  className = '', inputClassName = '', type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 flex items-center justify-center pointer-events-none z-10">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`
            form-input
            ${icon ? 'has-left-icon !pl-11' : ''}
            ${isPassword ? 'has-right-icon !pr-11' : ''}
            ${error ? 'form-input-error' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors z-10 flex items-center justify-center p-1 rounded-md"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && (
        <div className="flex items-center gap-1.5 text-red-400 text-xs mt-0.5">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
