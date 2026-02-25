import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { IdeaCard } from '../components/IdeaCard';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAppData } from '../hooks/useAppData';

export default function RecommendationsPage() {
  const { ideas, savedIdeas, propertyForm, saveIdea, removeSavedIdea, loading } = useAppData();

  if (loading) return <Layout><LoadingSpinner label="Loading recommendations..." /></Layout>;
  if (!propertyForm) {
    return <Layout><EmptyState title="No property form" description="Submit property details first." action={<Link to="/property-form" className="rounded-xl bg-brand-600 px-4 py-2 text-white">Open Form</Link>} /></Layout>;
  }

  const filtered = ideas.filter((i) => i.estimatedCost <= Number(propertyForm.budget));
  const list = filtered.length ? filtered : ideas;

  return (
    <Layout>
      <h1 className="mb-6 text-2xl font-bold">Recommendations</h1>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((idea) => {
          const isSaved = savedIdeas.some((s) => s.id === idea.id);
          return <IdeaCard key={idea.id} idea={idea} isSaved={isSaved} onToggle={(id) => isSaved ? removeSavedIdea(id) : saveIdea(id)} />;
        })}
      </div>
    </Layout>
  );
}
