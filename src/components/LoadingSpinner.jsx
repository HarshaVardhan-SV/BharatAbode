import { motion } from 'framer-motion';

export function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="h-10 w-10 rounded-full border-4 border-brand-500/30 border-t-brand-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-sm text-slate-600 dark:text-slate-300">{label}</p>
      </div>
    </div>
  );
}
