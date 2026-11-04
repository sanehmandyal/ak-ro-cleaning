import { Suspense } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingActions from '../components/FloatingActions';
import { FullPageLoader } from '../components/ui';
import { useSite } from '../context/SiteContext';

function PromoBanner() {
  const { settings } = useSite();
  const b = settings?.promoBanner;
  if (!b?.enabled || !b.text) return null;
  return (
    <div className="bg-navy-800 px-4 py-2 text-center text-xs text-white sm:text-sm">
      <span>{b.text}</span>
      {b.linkText && b.linkUrl && (
        b.linkUrl.startsWith('/') ? (
          <Link to={b.linkUrl} className="ml-2 font-bold text-aqua-400 underline">{b.linkText}</Link>
        ) : (
          <a href={b.linkUrl} className="ml-2 font-bold text-aqua-400 underline">{b.linkText}</a>
        )
      )}
    </div>
  );
}

export default function PublicLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[200] focus:rounded focus:bg-white focus:px-3 focus:py-2">Skip to content</a>
      <PromoBanner />
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<FullPageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
