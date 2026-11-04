import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { optimizeImage } from '../utils/format';

export function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#0b1f3a" />
      <path d="M32 10c8 11 14 18 14 26a14 14 0 0 1-28 0c0-8 6-15 14-26z" fill="#19c3d6" />
      <path d="M25 38l5 5 10-12" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({ light = false, to = '/' }) {
  const { settings } = useSite();
  const name = settings?.businessName || 'Aqua Ak Enterprises';
  const logo = settings?.logo?.url;
  return (
    <Link to={to} className="flex min-w-0 items-center gap-2.5" aria-label={`${name} home`}>
      {logo ? (
        <img src={optimizeImage(logo, 160)} alt={`${name} logo`} className="h-9 w-auto max-w-[140px] object-contain" />
      ) : (
        <LogoMark />
      )}
      <span className={`truncate font-display text-base font-extrabold leading-tight sm:text-lg ${light ? 'text-white' : 'text-navy-800'}`}>
        {name}
      </span>
    </Link>
  );
}
