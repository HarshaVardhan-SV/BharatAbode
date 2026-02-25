import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <section className="grid items-center gap-10 py-8 lg:grid-cols-2 lg:py-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="mb-3 inline-block rounded-full bg-brand-500/20 px-4 py-1 text-sm font-semibold text-brand-600">Property Value Intelligence</p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Upgrade your home smartly with <span className="text-brand-600">BharatAbode</span></h1>
          <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">Affordable suggestions designed for Indian middle-class residential properties.</p>
          {!isAuthenticated ? (
            <div className="mt-8 flex gap-3">
              <Link to="/register" className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white">Start Free</Link>
              <Link to="/login" className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white dark:bg-white dark:text-slate-900">Login</Link>
            </div>
          ) : (
            <div className="mt-8"><Link to="/dashboard" className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white">Go to Dashboard</Link></div>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold">Why BharatAbode</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl bg-white/40 p-4 dark:bg-slate-800/40">Affordable, ROI-focused property improvements</div>
            <div className="rounded-xl bg-white/40 p-4 dark:bg-slate-800/40">Recommendations personalized to your budget</div>
            <div className="rounded-xl bg-white/40 p-4 dark:bg-slate-800/40">Save, compare, and execute upgrades confidently</div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}
