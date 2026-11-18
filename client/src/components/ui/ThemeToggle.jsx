import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
        isDark ? 'bg-slate-700' : 'bg-blue-200'
      } ${className}`}
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{ x: isDark ? 2 : 30 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`absolute top-1 w-5 h-5 rounded-full flex items-center justify-center ${
          isDark ? 'bg-slate-400' : 'bg-white'
        }`}
      >
        {isDark ? (
          <Moon size={10} className="text-slate-800" />
        ) : (
          <Sun size={10} className="text-amber-500" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
