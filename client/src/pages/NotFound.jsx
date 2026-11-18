import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-700/10 rounded-full blur-3xl" />
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="text-[120px] font-black gradient-text-blue leading-none mb-4">404</div>
      <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
      <p className="text-slate-400 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-3 justify-center">
        <Link to="/"><Button variant="primary" icon={<Home size={16} />}>Go Home</Button></Link>
        <button onClick={() => window.history.back()}><Button variant="secondary" icon={<ArrowLeft size={16} />}>Go Back</Button></button>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
