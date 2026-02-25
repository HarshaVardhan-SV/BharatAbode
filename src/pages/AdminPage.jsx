import { useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { Layout } from '../components/Layout';
import { useAppData } from '../hooks/useAppData';

const empty = {
  title: '',
  category: '',
  description: '',
  propertyType: '',
  estimatedCost: '',
  valueIncrease: '',
  timeRequired: '',
  imageUrls: ''
};

export default function AdminPage() {
  const { ideas, users, addIdea, editIdea, deleteIdea } = useAppData();
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState('');
  const [error, setError] = useState('');

  const sortedUsers = useMemo(() => users.slice().sort((a, b) => a.name.localeCompare(b.name)), [users]);

  const toImagesArray = (csv) =>
    String(csv || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const submit = async (e) => {
    e.preventDefault();
    const required = { ...form };
    delete required.imageUrls;

    if (Object.values(required).some((v) => !String(v).trim())) {
      return setError('All fields except imageUrls are required.');
    }

    setError('');
    const images = toImagesArray(form.imageUrls);

    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      propertyType: form.propertyType,
      estimatedCost: Number(form.estimatedCost),
      valueIncrease: Number(form.valueIncrease),
      timeRequired: form.timeRequired,
      city: 'Any',
      images,
      imageUrl: images[0] || ''
    };

    if (editingId) {
      await editIdea(editingId, payload);
      setEditingId('');
    } else {
      await addIdea(payload);
    }

    setForm(empty);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="glass rounded-2xl p-5">
          <h2 className="text-lg font-semibold">{editingId ? 'Edit idea' : 'Add idea'}</h2>
          <form onSubmit={submit} className="mt-4 grid gap-3">
            {Object.keys(form).map((k) => (
              <input
                key={k}
                className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2"
                placeholder={k === 'imageUrls' ? 'imageUrls (optional, comma separated)' : k}
                value={form[k]}
                onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))}
              />
            ))}
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            <button className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white">
              {editingId ? 'Update' : 'Create'}
            </button>
          </form>
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="text-lg font-semibold">Users</h2>
          {!sortedUsers.length ? (
            <EmptyState title="No users" description="Users appear after registration." />
          ) : (
            <div className="mt-3 space-y-2">
              {sortedUsers.map((u) => (
                <div key={u.id} className="rounded-xl bg-white/40 p-3 text-sm dark:bg-slate-800/40">
                  {u.name} - {u.email}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 glass rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Manage Ideas</h2>
        {!ideas.length ? (
          <EmptyState title="No ideas" description="Add ideas to begin." />
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-left">Cost</th>
                  <th className="px-3 py-2 text-left">ROI</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ideas.map((i) => (
                  <tr key={i.id}>
                    <td className="px-3 py-2">{i.title}</td>
                    <td className="px-3 py-2">Rs. {i.estimatedCost.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2">{i.valueIncrease}%</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(i.id);
                            setForm({
                              title: i.title,
                              category: i.category,
                              description: i.description,
                              propertyType: i.propertyType,
                              estimatedCost: String(i.estimatedCost),
                              valueIncrease: String(i.valueIncrease),
                              timeRequired: i.timeRequired,
                              imageUrls: Array.isArray(i.images) ? i.images.join(', ') : i.imageUrl || ''
                            });
                          }}
                          className="rounded bg-brand-600 px-2 py-1 text-white"
                        >
                          Edit
                        </button>
                        <button onClick={() => deleteIdea(i.id)} className="rounded bg-red-600 px-2 py-1 text-white">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Layout>
  );
}
