import { Link } from 'react-router-dom';
import { Droplets } from 'lucide-react';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Seo title="Page not found" noindex />
      <Droplets className="h-14 w-14 text-aqua-500" />
      <p className="mt-4 font-display text-6xl font-extrabold text-navy-800">404</p>
      <h1 className="mt-2 text-2xl font-extrabold">This page has been wiped clean</h1>
      <p className="mt-2 max-w-md text-slate-600">The page you are looking for does not exist or may have moved.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn-primary">Back to home</Link>
        <Link to="/services" className="btn-outline">View services</Link>
      </div>
    </section>
  );
}
