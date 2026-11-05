import { useEffect, useState, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Phone,
  CalendarCheck,
  ChevronDown,
  Droplets,
  Waves,
  Bath,
  AppWindow,
  Sparkles,
  Layers,
  MapPin,
  Building2,
  Shield,
  ArrowRight,
} from 'lucide-react';
import Logo from './Logo';
import { useSite } from '../context/SiteContext';
import { telHref } from '../utils/format';

const SERVICE_PAGES = [
  { to: '/water-tank-cleaning', label: 'Water Tank Cleaning', icon: Droplets, desc: '6-stage mechanized cleaning & UV disinfection' },
  { to: '/ro-water-purifier-cleaning', label: 'RO Purifier Maintenance', icon: Waves, desc: 'Internal tank descaling & digital TDS check' },
  { to: '/bathroom-kitchen-cleaning', label: 'Bathroom & Kitchen Deep Clean', icon: Bath, desc: 'Hard water limescale descaling & degrease' },
  { to: '/glass-window-cleaning', label: 'Glass & Window Cleaning', icon: AppWindow, desc: 'Streak-free balcony & facade glass wash' },
  { to: '/services/ro-filter-membrane-replacement', label: 'Filter & Membrane Replacement', icon: Layers, desc: 'Genuine 75/100 GPD high-TDS membranes' },
  { to: '/services/commercial-ro-plant-servicing', label: 'Commercial RO Plant Service', icon: Building2, desc: '50 to 1,000+ LPH systems for offices' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { pathname } = useLocation();
  const { settings } = useSite();
  const phone = settings?.contact?.phone || '9219254461';

  useEffect(() => {
    setOpen(false);
    setServicesDropdown(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Click outside to close desktop dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const linkClass = ({ isActive }) =>
    `rounded-xl px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? 'text-aqua-600 bg-aqua-50 shadow-xs border border-aqua-200/60 font-bold'
        : 'text-navy-900 hover:text-aqua-600 hover:bg-slate-50'
    }`;

  const isServicesActive = pathname.startsWith('/services') || pathname.includes('-cleaning');

  return (
    <header className="sticky top-0 z-50 border-b border-aqua-100/70 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        {/* Full Logo - Never cut off */}
        <div className="shrink-0">
          <Logo />
        </div>

        {/* Clean Desktop Navigation Links */}
        <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Main Navigation">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About Us
          </NavLink>

          {/* Services Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setServicesDropdown((s) => !s)}
              onMouseEnter={() => setServicesDropdown(true)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                isServicesActive
                  ? 'text-aqua-600 bg-aqua-50 border border-aqua-200/60 font-bold'
                  : 'text-navy-900 hover:text-aqua-600 hover:bg-slate-50'
              }`}
              aria-expanded={servicesDropdown}
            >
              <span>Services</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                  servicesDropdown ? 'rotate-180 text-aqua-600' : ''
                }`}
              />
            </button>

            {servicesDropdown && (
              <div
                onMouseLeave={() => setServicesDropdown(false)}
                className="absolute left-0 top-full mt-2 w-88 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Specialized Services
                </div>
                <div className="space-y-1">
                  {SERVICE_PAGES.map((s) => {
                    const IconCmp = s.icon;
                    return (
                      <Link
                        key={s.to}
                        to={s.to}
                        className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-navy-900 hover:bg-aqua-50/70 hover:text-aqua-700 transition"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-aqua-100/70 text-aqua-700 mt-0.5">
                          <IconCmp className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-navy-900">{s.label}</p>
                          <p className="text-[11px] font-normal text-slate-500 leading-tight">{s.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-2.5 border-t border-slate-100 pt-2">
                  <Link
                    to="/services"
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-aqua-700 hover:bg-aqua-50 transition"
                  >
                    <span>View All Services Catalog</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/gallery" className={linkClass}>
            Gallery
          </NavLink>
          <NavLink to="/locations" className={linkClass}>
            Locations
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact & Book
          </NavLink>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden items-center gap-2.5 lg:flex shrink-0">
          {phone && (
            <a
              href={telHref(phone)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-aqua-200 bg-aqua-50/70 px-3 py-1.5 text-xs font-bold text-navy-950 hover:bg-aqua-100 transition shadow-xs"
            >
              <Phone className="h-3.5 w-3.5 text-aqua-600" />
              <span>{phone}</span>
            </a>
          )}
          <Link to="/booking" className="btn-primary btn-sm shadow-glow">
            <CalendarCheck className="h-4 w-4" /> Book Service
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:border-brand-500 hover:bg-white hover:text-brand-600 transition"
            title="Admin Dashboard"
          >
            <Shield className="h-3.5 w-3.5 text-brand-600" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile Header Buttons */}
        <div className="flex items-center gap-2 lg:hidden">
          {phone && (
            <a
              href={telHref(phone)}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-aqua-50 border border-aqua-200 px-2.5 py-1 text-xs font-bold text-navy-950 shadow-xs"
              aria-label="Call Now"
            >
              <Phone className="h-3.5 w-3.5 text-aqua-600" />
              <span className="hidden xs:inline">Call</span>
            </a>
          )}
          <Link
            to="/admin"
            className="flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700"
            title="Admin Login"
          >
            <Shield className="h-3.5 w-3.5 text-brand-600" />
            <span className="hidden xs:inline">Admin</span>
          </Link>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-navy-800 hover:bg-slate-50"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-navy-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-16 max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-100 bg-white shadow-2xl lg:hidden"
        >
          <nav className="container-x flex flex-col gap-1 py-4" aria-label="Mobile Navigation">
            {/* Quick Admin Access Card */}
            <div className="mb-3 flex items-center justify-between rounded-xl bg-aqua-50/70 p-3 border border-aqua-200/60">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-aqua-600 text-white">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-950">Aqua Ak Admin Panel</p>
                  <p className="text-[11px] text-slate-500">Manage bookings & services</p>
                </div>
              </div>
              <Link
                to="/admin"
                className="rounded-lg bg-aqua-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-aqua-700"
              >
                Dashboard
              </Link>
            </div>

            <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-aqua-50 text-aqua-700 font-bold' : 'text-navy-900 hover:bg-slate-50'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-aqua-50 text-aqua-700 font-bold' : 'text-navy-900 hover:bg-slate-50'
                }`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-aqua-50 text-aqua-700 font-bold' : 'text-navy-900 hover:bg-slate-50'
                }`
              }
            >
              Gallery / Work
            </NavLink>
            <NavLink
              to="/locations"
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-aqua-50 text-aqua-700 font-bold' : 'text-navy-900 hover:bg-slate-50'
                }`
              }
            >
              Service Locations
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-aqua-50 text-aqua-700 font-bold' : 'text-navy-900 hover:bg-slate-50'
                }`
              }
            >
              Contact Us
            </NavLink>

            <div className="mt-3 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">
              Services
            </div>
            {SERVICE_PAGES.map((s) => {
              const IconCmp = s.icon;
              return (
                <NavLink
                  key={s.to}
                  to={s.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      isActive ? 'bg-aqua-50 text-aqua-700 font-bold' : 'text-navy-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <IconCmp className="h-4 w-4 text-aqua-600" />
                  <span>{s.label}</span>
                </NavLink>
              );
            })}

            <div className="mt-4 grid gap-2 pt-3 border-t border-slate-100">
              <Link to="/booking" className="btn-primary w-full justify-center">
                <CalendarCheck className="h-4 w-4" /> Book Doorstep Service
              </Link>
              {phone && (
                <a href={telHref(phone)} className="btn-outline w-full justify-center">
                  <Phone className="h-4 w-4 text-aqua-600" /> Call {phone}
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
