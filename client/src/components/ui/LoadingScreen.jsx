import { motion } from 'framer-motion';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F172A' }}>
    <div className="flex flex-col items-center gap-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-full"
        style={{ border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #2563EB' }}
      />
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-slate-400 font-medium"
      >
        Loading...
      </motion.p>
    </div>
  </div>
);

export default LoadingScreen;
