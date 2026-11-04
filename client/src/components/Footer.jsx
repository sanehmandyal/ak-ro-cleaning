import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Shield } from 'lucide-react';
import { Facebook, Instagram, Youtube, Twitter, Linkedin } from './BrandIcons';
import Logo from './Logo';
import { useSite } from '../context/SiteContext';
import useFetch from '../hooks/useFetch';
import { telHref } from '../utils/format';

const SOCIALS = [
  ['facebook', Facebook], ['instagram', Instagram], ['youtube', Youtube], ['twitter', Twitter], ['linkedin', Linkedin],
];

export function SocialLinks({ social = {}, className = '' }) {
  const items = SOCIALS.filter(([k]) => social[k]);
  if (!items.length) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map(([k, Cmp]) => (
        <a key={k} href={social[k]} target="_blank" rel="noopener noreferrer" aria-label={k}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-aqua-500 hover:text-navy-900">
          <Cmp className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}

export default function Footer() {
  const { settings } = useSite();
  const { data: services } = useFetch('/services');
  const c = settings?.contact || {};
  const name = settings?.businessName || 'Aqua Ak Enterprises';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-navy-900 via-navy-950 to-[#020b17] border-t border-aqua-500/20 text-slate-300">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed">{settings?.footer?.about || settings?.tagline}</p>
          <SocialLinks social={settings?.social} className="mt-5" />
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider !text-white">Website Pages (1-9)</h3>
          <ul className="space-y-2 text-sm">
            {[
              ['/', '1. Home Page'],
              ['/about', '2. About Us'],
              ['/services', '3. Our Services'],
              ['/water-tank-cleaning', '4. Water Tank Cleaning'],
              ['/ro-water-purifier-cleaning', '5. RO Purifier Maintenance'],
              ['/bathroom-kitchen-cleaning', '6. Bathroom & Kitchen Clean'],
              ['/glass-window-cleaning', '7. Glass & Window Cleaning'],
              ['/gallery', '8. Gallery / Our Work'],
              ['/contact', '9. Contact & Book a Service'],
            ].map(([to, l]) => (
              <li key={to}><Link to={to} className="hover:text-aqua-400">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider !text-white">Services</h3>
          <ul className="space-y-2 text-sm">
            {(services || []).slice(0, 7).map((s) => (
              <li key={s._id}><Link to={`/services/${s.slug}`} className="hover:text-aqua-400">{s.title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider !text-white">Contact</h3>
          <ul className="space-y-3 text-sm">
            {c.phone && <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" /><a href={telHref(c.phone)} className="hover:text-aqua-400">{c.phone}</a></li>}
            {c.email && <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" /><a href={`mailto:${c.email}`} className="break-all hover:text-aqua-400">{c.email}</a></li>}
            {c.address && <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" /><span>{c.address}</span></li>}
            {settings?.businessHours?.[0] && (
              <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                <span>{settings.businessHours[0].day}: {settings.businessHours[0].hours}</span></li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="container-x flex flex-col items-center justify-between gap-3 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
          <span>{settings?.footer?.copyright || `© ${year} ${name}. All rights reserved.`}</span>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="inline-flex items-center gap-1.5 text-slate-300 hover:text-aqua-400 transition font-medium">
              <Shield className="h-3.5 w-3.5 text-aqua-400" />
              <span>Admin Panel</span>
            </Link>
            <Link to="/contact" className="hover:text-aqua-400 transition">
              Customer Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
