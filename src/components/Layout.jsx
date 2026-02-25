import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function Layout({ children }) {
  return (
    <div className="gradient-surface min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}
