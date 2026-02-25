import { motion } from 'framer-motion';

export function EmptyState({ title, description, action }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 text-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-slate-600 dark:text-slate-300">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </motion.div>
  );
}
