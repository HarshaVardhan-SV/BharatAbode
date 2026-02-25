import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { Layout } from '../components/Layout';
import { ROIChart } from '../components/ROIChart';
import { useAppData } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const { savedIdeas, propertyForm } = useAppData();

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <section className="glass rounded-2xl p-5">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="mt-3 text-sm">{user?.name}</p><p className="text-sm">{user?.email}</p><p className="text-sm">{user?.city}</p>
        </section>
        <section className="glass rounded-2xl p-5">
          <h2 className="text-lg font-semibold">Saved Ideas</h2>
          <p className="mt-2 text-3xl font-bold text-brand-600">{savedIdeas.length}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/saved-ideas" className="inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm text-white">View all</Link>
            <Link to="/roi-receipt" className="inline-block rounded-xl bg-slate-800 px-4 py-2 text-sm text-white dark:bg-white dark:text-slate-900">
              ROI Receipt
            </Link>
          </div>
        </section>
        <section className="glass rounded-2xl p-5">
          <h2 className="text-lg font-semibold">Current Budget</h2>
          <p className="mt-2 text-lg">{propertyForm ? `Rs. ${Number(propertyForm.budget).toLocaleString('en-IN')}` : 'No form submitted yet'}</p>
        </section>
      </div>

      <section className="mt-6 glass rounded-2xl p-5">
        <h2 className="text-lg font-semibold">ROI Chart</h2>
        {!savedIdeas.length ? <EmptyState title="No chart data" description="Save ideas to see ROI chart." /> : <ROIChart ideas={savedIdeas} />}
      </section>
    </Layout>
  );
}
