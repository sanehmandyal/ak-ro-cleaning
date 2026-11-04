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
} from 'lucide-react';
import Logo from './Logo';
import { useSite } from '../context/SiteContext';
import { telHref } from '../utils/format';

const ALL_WEBSITE_PAGES = [
  { to: '/', label: 'Home', num: 1 },
  { to: '/about', label: 'About Us', num: 2 },
  { to: '/services', label: 'Our Services', num: 3 },
  { to: '/water-tank-cleaning', label: 'Water Tank Cleaning', num: 4, icon: Droplets },
  { to: '/ro-water-purifier-cleaning', label: 'RO Purifier Maintenance', num: 5, icon: Waves },
  { to: '/bathroom-kitchen-cleaning', label: 'Bathroom & Kitchen Deep Clean', num: 6, icon: Bath },
  { to: '/glass-window-cleaning', label: 'Glass & Window Cleaning', num: 7, icon: AppWindow },
  { to: '/gallery', label: 'Gallery / Our Work', num: 8 },
  { to: '/contact', label: 'Contact & Book', num: 9 },
];

const SERVICE_PAGES = [
  { to: '/water-tank-cleaning', label: 'Water Tank Cleaning', icon: Droplets, desc: '6-stage mechanized cleaning & UV' },
  { to: '/ro-water-purifier-cleaning', label: 'RO Purifier Maintenance', icon: Waves, desc: 'Internal tank descaling & TDS check' },
  { to: '/bathroom-kitchen-cleaning', label: 'Bathroom & Kitchen Deep Clean', icon: Bath, desc: 'Limescale descaling & chimney degrease' },
  { to: '/glass-window-cleaning', label: 'Glass & Window Cleaning', icon: AppWindow, desc: 'Streak-free balcony squeegee' },
  { to: '/services/ro-filter-membrane-replacement', label: 'Filter & Membrane Replacement', icon: Layers, desc: 'Genuine 75/100 GPD membranes' },
  { to: '/services/commercial-ro-plant-servicing', label: 'Commercial RO Plant Service', icon: Building2, desc: '50 to 1,000+ LPH systems' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { pathname } = useLocation();
  const { settings } = useSite();
  const phone = settings?.contact?.phone;

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
    `rounded-xl px-2.5 py-1.5 text-xs font-bold transition xl:text-sm ${
      isActive
        ? 'text-aqua-600 bg-aqua-50 shadow-sm border border-aqua-200/60'
        : 'text-navy-900 hover:text-aqua-600 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-aqua-100/70 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <Logo />

        {/* Desktop Navigation showing all 9 pages */}
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About Us
          </NavLink>

          {/* Services Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setServicesDropdown((s) => !s)}
              onMouseEnter={() => setServicesDropdown(true)}
              className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition xl:text-sm ${
                pathname.includes('/services') || pathname.includes('-cleaning')
                  ? 'text-aqua-600 bg-aqua-50 border border-aqua-200/60'
                  : 'text-navy-900 hover:text-aqua-600 hover:bg-slate-50'
              }`}
              aria-expanded={servicesDropdown}
            >
              Services{' '}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  servicesDropdown ? 'rotate-180' : ''
                }`}
              />
            </button>

            {servicesDropdown && (
              <div
                onMouseLeave={() => setServicesDropdown(false)}
                className="absolute left-0 top-full mt-1 w-80 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-card"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Dedicated Service Pages
                </div>
                <div className="space-y-1">
                  {SERVICE_PAGES.map((s) => {
                    const IconCmp = s.icon;
                    return (
                      <Link
                        key={s.to}
                        to={s.to}
                        className="flex items-start gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-navy-800 hover:bg-slate-50 hover:text-brand-600 transition"
                      >
                        <IconCmp className="h-4 w-4 text-aqua-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">{s.label}</p>
                          <p className="text-[11px] font-normal text-slate-500">{s.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-2 border-t border-slate-100 pt-2">
                  <Link
                    to="/services"
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-brand-600 hover:bg-brand-50 transition"
                  >
                    <span>Page 3: View All Services</span>
                    <Sparkles className="h-3.5 w-3.5 text-aqua-500" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/water-tank-cleaning" className={linkClass}>
            Water Tank
          </NavLink>
          <NavLink to="/ro-water-purifier-cleaning" className={linkClass}>
            RO Purifier
          </NavLink>
          <NavLink to="/bathroom-kitchen-cleaning" className={linkClass}>
            Bath & Kitchen
          </NavLink>
          <NavLink to="/glass-window-cleaning" className={linkClass}>
            Glass Cleaning
          </NavLink>
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

        {/* Medium Screen (lg) Simplified Nav */}
        <nav className="hidden items-center gap-1 lg:flex xl:hidden" aria-label="Main Condensed">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/services" className={linkClass}>
            Services
          </NavLink>
          <NavLink to="/water-tank-cleaning" className={linkClass}>
            Tank Clean
          </NavLink>
          <NavLink to="/ro-water-purifier-cleaning" className={linkClass}>
            RO Purifier
          </NavLink>
          <NavLink to="/gallery" className={linkClass}>
            Gallery
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Desktop CTA actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {phone && (
            <a href={telHref(phone)} className="btn-outline btn-sm">
              <Phone className="h-4 w-4" /> {phone}
            </a>
          )}
          <Link to="/booking" className="btn-primary btn-sm">
            <CalendarCheck className="h-4 w-4" /> Book a Service
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-brand-500 hover:bg-white hover:text-brand-600 transition"
            title="Admin Dashboard"
          >
            <Shield className="h-3.5 w-3.5 text-brand-600" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile Action & Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {phone && (
            <a
              href={telHref(phone)}
              className="flex h-10 items-center gap-1.5 rounded-xl bg-aqua-50 border border-aqua-200 px-2.5 py-1 text-xs font-bold text-navy-900 shadow-xs"
              aria-label="Call Now"
            >
              <Phone className="h-3.5 w-3.5 text-brand-600" />
              <span className="hidden sm:inline">Call</span>
            </a>
          )}
          <Link
            to="/admin"
            className="flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700 hover:text-brand-600"
            title="Admin Login"
          >
            <Shield className="h-3.5 w-3.5 text-brand-600" />
            <span className="hidden xs:inline">Admin</span>
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-navy-800"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Listing All 9 Pages */}
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-16 max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-100 bg-white shadow-card lg:hidden"
        >
          <nav className="container-x flex flex-col gap-1 py-4" aria-label="Mobile">
            {/* Quick Admin Access Card */}
            <div className="mb-2 flex items-center justify-between rounded-xl bg-brand-50/60 p-2.5 border border-brand-100">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-900">Admin Control Panel</p>
                  <p className="text-[11px] text-slate-500">Bookings, content & gallery</p>
                </div>
              </div>
              <Link
                to="/admin"
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-brand-700"
              >
                Dashboard
              </Link>
            </div>

            <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              All 9 Website Pages
            </div>

            {ALL_WEBSITE_PAGES.map((page) => (
              <NavLink
                key={page.to}
                to={page.to}
                end={page.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isActive ? 'bg-brand-50 text-brand-600 font-bold' : 'text-navy-800 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {page.num}
                  </span>
                  <span>{page.label}</span>
                </div>
                {page.icon && <page.icon className="h-4 w-4 text-aqua-600" />}
              </NavLink>
            ))}

            <NavLink
              to="/locations"
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isActive ? 'bg-brand-50 text-brand-600 font-bold' : 'text-navy-800 hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-brand-600 ml-1" />
                <span>Service Locations</span>
              </div>
            </NavLink>

            <div className="mt-3 grid gap-2 pt-3 border-t border-slate-100">
              <Link to="/booking" className="btn-primary">
                <CalendarCheck className="h-4 w-4" /> Book a Service
              </Link>
              {phone && (
                <a href={telHref(phone)} className="btn-outline">
                  <Phone className="h-4 w-4" /> Call {phone}
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
