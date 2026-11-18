import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Palette, Sparkles, User,
  Settings, LogOut, ChevronLeft, ChevronRight, Zap,
  BarChart2, Shield, Menu, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/resumes', icon: FileText, label: 'My Resumes' },
  { path: '/templates', icon: Palette, label: 'Templates' },
  { path: '/ai-assistant', icon: Sparkles, label: 'AI Assistant' },
  { path: '/ats-checker', icon: BarChart2, label: 'ATS Checker' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const adminItems = [
  { path: '/admin', icon: Shield, label: 'Admin Dashboard' },
  { path: '/admin/users', icon: User, label: 'Users' },
  { path: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
];

const Sidebar = ({ onMobileToggle, mobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileToggle}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed left-0 top-0 h-full z-30 flex flex-col
          bg-slate-900/95 backdrop-blur-xl border-r border-white/8
          lg:relative lg:translate-x-0
          transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ flexShrink: 0 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/8 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Zap size={16} className="text-white fill-white" />
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-base gradient-text-blue whitespace-nowrap"
              >
                ResumeAI
              </motion.span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(v => !v)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-all"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <button
            onClick={onMobileToggle}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="px-4 py-4 border-b border-white/8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.plan === 'free' ? 'Free Plan' : `${user?.plan} Plan`}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-hide">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link key={path} to={path} onClick={() => onMobileToggle?.()}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                  ${isActive(path)
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/6'
                  }
                `}
              >
                {isActive(path) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full" />
                )}
                <Icon size={18} className={`flex-shrink-0 ${isActive(path) ? 'text-blue-400' : ''}`} />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium"
                  >
                    {label}
                  </motion.span>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 shadow-xl z-50">
                    {label}
                  </div>
                )}
              </motion.div>
            </Link>
          ))}

          {/* Admin section */}
          {isAdmin && (
            <>
              {!collapsed && (
                <p className="px-3 pt-4 pb-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">Admin</p>
              )}
              {!collapsed && <div className="border-t border-white/6 my-1" />}
              {adminItems.map(({ path, icon: Icon, label }) => (
                <Link key={path} to={path} onClick={() => onMobileToggle?.()}>
                  <div className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                    ${isActive(path)
                      ? 'bg-purple-600/20 border border-purple-500/30 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/6'
                    }
                  `}>
                    <Icon size={18} className="flex-shrink-0" />
                    {!collapsed && <span className="text-sm font-medium">{label}</span>}
                  </div>
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Upgrade banner */}
        {!collapsed && user?.plan === 'free' && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20">
            <p className="text-xs font-semibold text-white mb-1">Upgrade to Pro</p>
            <p className="text-xs text-slate-400 mb-2">Unlimited AI generations & resumes</p>
            <button className="w-full text-xs font-semibold py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-opacity">
              Upgrade Now →
            </button>
          </div>
        )}

        {/* Logout */}
        <div className="p-2 border-t border-white/8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
