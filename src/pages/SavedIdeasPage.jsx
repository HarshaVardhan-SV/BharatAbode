import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { IdeaCard } from '../components/IdeaCard';
import { Layout } from '../components/Layout';
import { useAppData } from '../hooks/useAppData';

export default function SavedIdeasPage() {
  const { savedIdeas, removeSavedIdea } = useAppData();

  const totalCost = savedIdeas.reduce((sum, item) => sum + Number(item.estimatedCost || 0), 0);
  const avgROI = savedIdeas.length
    ? savedIdeas.reduce((sum, item) => sum + Number(item.valueIncrease || 0), 0) / savedIdeas.length
    : 0;

  return (
    <Layout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Saved Ideas</h1>
        {savedIdeas.length ? (
          <Link to="/roi-receipt" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
            Generate Billing & ROI Receipt
          </Link>
        ) : null}
      </div>

      {!savedIdeas.length ? (
        <EmptyState
          title="No saved ideas yet"
          description="Save an idea from recommendations."
          action={<Link to="/recommendations" className="rounded-xl bg-brand-600 px-4 py-2 text-white">Browse Ideas</Link>}
        />
      ) : (
        <>
          <section className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">Selected Ideas</p>
              <p className="text-2xl font-bold">{savedIdeas.length}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">Estimated Spend</p>
              <p className="text-2xl font-bold">Rs. {totalCost.toLocaleString('en-IN')}</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">Average ROI</p>
              <p className="text-2xl font-bold">{avgROI.toFixed(1)}%</p>
            </div>
          </section>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {savedIdeas.map((idea) => <IdeaCard key={idea.id} idea={idea} isSaved onToggle={removeSavedIdea} />)}
          </div>
        </>
      )}
    </Layout>
  );
}
