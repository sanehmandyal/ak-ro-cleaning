import { Suspense, useEffect, useState } from 'react';
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wrench, Images, CalendarCheck, MessageSquare, Globe, Star, HelpCircle, Search, Settings, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { get } from '../services/api';
import { LogoMark } from '../components/Logo';
import { FullPageLoader } from '../components/ui';

const NAV = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/admin/bookings', label: 'Bookings', Icon: CalendarCheck, badge: 'bookings' },
  { to: '/admin/inquiries', label: 'Inquiries', Icon: MessageSquare, badge: 'contacts' },
  { to: '/admin/services', label: 'Services', Icon: Wrench },
  { to: '/admin/gallery', label: 'Gallery', Icon: Images },
  { to: '/admin/content', label: 'Website Content', Icon: Globe },
  { to: '/admin/testimonials', label: 'Testimonials', Icon: Star },
  { to: '/admin/faqs', label: 'FAQs', Icon: HelpCircle },
  { to: '/admin/seo', label: 'SEO', Icon: Search },
  { to: '/admin/settings', label: 'Settings', Icon: Settings },
];

export default function AdminLayout() {
  const { admin, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState({ bookings: 0, contacts: 0 });
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!admin) return undefined;
    let active = true;
    const poll = () =>
      get('/admin/stats')
        .then((r) => active && setCounts({ bookings: r.data.bookings.unread, contacts: r.data.unreadContacts }))
        .catch(() => {});
    poll();
    const t = setInterval(poll, 60000);
    return () => { active = false; clearInterval(t); };
  }, [admin, pathname]);

  if (loading) return <FullPageLoader />;
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: pathname }} />;

  const sidebar = (
    <div className="flex h-full flex-col bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-slate-300 border-r border-aqua-500/15">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <LogoMark className="h-8 w-8" />
        <span className="font-display font-extrabold text-white">Aqua Ak Admin</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin">
        {NAV.map(({ to, label, Icon, end, badge }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${isActive ? 'bg-gradient-to-r from-aqua-400 to-brand-400 text-navy-950 font-bold shadow-glow' : 'hover:bg-white/10 hover:text-white'}`}>
            <Icon className="h-5 w-5 shrink-0" />
            <span className="flex-1">{label}</span>
            {badge && counts[badge] > 0 && <span className="rounded-full bg-aqua-400 px-2 py-0.5 text-xs font-bold text-navy-950">{counts[badge]}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-semibold hover:bg-white/10 hover:text-white"><ExternalLink className="h-5 w-5" /> View website</a>
        <button onClick={logout} className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold hover:bg-white/10 hover:text-white"><LogOut className="h-5 w-5" /> Logout</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-900/60" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw]">{sidebar}</aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <p className="ml-auto min-w-0 truncate text-sm text-slate-500">Signed in as <span className="font-semibold text-navy-800">{admin.name}</span></p>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6">
          <Suspense fallback={<FullPageLoader />}><Outlet /></Suspense>
        </main>
      </div>
    </div>
  );
}
