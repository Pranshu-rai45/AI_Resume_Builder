import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children, title, subtitle, actions }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen(v => !v)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="flex-shrink-0 h-16 border-b border-white/8 bg-slate-900/80 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-all"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              {title && <h1 className="text-lg font-bold text-white truncate">{title}</h1>}
              {subtitle && <p className="text-xs text-slate-500 truncate hidden sm:block">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
            <ThemeToggle />
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs cursor-pointer">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
