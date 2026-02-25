import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) return setError('All fields are required.');
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-md glass rounded-3xl p-8">
        <h1 className="text-2xl font-bold">Login</h1>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <input className="w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <div className="flex gap-2">
            <input type={show ? 'text' : 'password'} className="w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
            <button type="button" onClick={() => setShow((s) => !s)} className="rounded-xl bg-slate-800 px-3 text-white">{show ? 'Hide' : 'Show'}</button>
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button disabled={loading} className="w-full rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white">{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p className="mt-4 text-sm">New here? <Link to="/register" className="font-semibold text-brand-600">Register</Link></p>
      </div>
    </Layout>
  );
}
