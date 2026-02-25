import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';

const nav = [
  { to: '/', label: 'Home' },
  { to: '/property-form', label: 'Property Form' },
  { to: '/recommendations', label: 'Recommendations' },
  { to: '/saved-ideas', label: 'Saved Ideas' },
  { to: '/roi-receipt', label: 'ROI Receipt' },
  { to: '/dashboard', label: 'Dashboard' }
];

export function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-white/20 bg-white/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold">Bharat<span className="text-brand-600">Abode</span></Link>
        <nav className="flex flex-wrap gap-2">
          {user ? nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={({isActive}) => `rounded-full px-3 py-1 text-sm ${isActive ? 'bg-brand-600 text-white' : 'hover:bg-white/20'}`}>
              {item.label}
            </NavLink>
          )) : null}
          {isAdmin ? <NavLink to="/admin" className="rounded-full px-3 py-1 text-sm hover:bg-white/20">Admin</NavLink> : null}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!user ? (
            <>
              <Link to="/login" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white">Login</Link>
              <Link to="/register" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-900">Register</Link>
            </>
          ) : (
            <button onClick={async () => { await logout(); navigate('/login'); }} className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white">Logout</button>
          )}
        </div>
      </div>
    </header>
  );
}
