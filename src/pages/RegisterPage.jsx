import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', city: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v.trim())) return setError('All fields are required.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setError('');
    try {
      await register({ name: form.name, email: form.email, city: form.city, password: form.password });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-lg glass rounded-3xl p-8">
        <h1 className="text-2xl font-bold">Register</h1>
        <form onSubmit={submit} className="mt-5 grid gap-3">
          <input className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <input className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <input className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2" placeholder="City" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
          <div className="flex gap-2">
            <input type={show ? 'text' : 'password'} className="w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
            <button type="button" onClick={() => setShow((s) => !s)} className="rounded-xl bg-slate-800 px-3 text-white">{show ? 'Hide' : 'Show'}</button>
          </div>
          <input type={show ? 'text' : 'password'} className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2" placeholder="Confirm password" value={form.confirm} onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))} />
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white">Create Account</button>
        </form>
        <p className="mt-4 text-sm">Already registered? <Link to="/login" className="font-semibold text-brand-600">Login</Link></p>
      </div>
    </Layout>
  );
}
