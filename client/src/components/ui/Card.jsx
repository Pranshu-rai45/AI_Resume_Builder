import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, onClick, glass = false }) => (
  <motion.div
    onClick={onClick}
    whileHover={hover ? { y: -4, scale: 1.005 } : undefined}
    className={`
      rounded-2xl border transition-all duration-300
      ${glass
        ? 'bg-white/6 backdrop-blur-xl border-white/10'
        : 'bg-white/4 border-white/8'
      }
      ${hover ? 'cursor-pointer hover:bg-white/7 hover:border-white/15 hover:shadow-2xl hover:shadow-black/30' : ''}
      ${className}
    `}
  >
    {children}
  </motion.div>
);

export default Card;
