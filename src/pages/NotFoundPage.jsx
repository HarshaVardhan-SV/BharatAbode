import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-md glass rounded-3xl p-8 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Page not found.</p>
        <Link to="/" className="mt-6 inline-block rounded-xl bg-brand-600 px-4 py-2 text-white">Go Home</Link>
      </div>
    </Layout>
  );
}
