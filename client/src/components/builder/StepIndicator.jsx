import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const StepIndicator = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide pb-2">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center flex-shrink-0">
          <button
            onClick={() => onStepClick(i)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              i === currentStep
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : i < currentStep
                ? 'text-emerald-400 hover:bg-emerald-500/10'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
              i < currentStep
                ? 'bg-emerald-500 text-white'
                : i === currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-white/8 text-slate-500'
            }`}>
              {i < currentStep ? <Check size={10} /> : i + 1}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </button>
          {i < steps.length - 1 && (
            <div className={`w-4 h-px mx-0.5 ${i < currentStep ? 'bg-emerald-500/40' : 'bg-white/8'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
