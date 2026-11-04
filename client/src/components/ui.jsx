import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';

export function SectionHeading({ eyebrow, title, subtitle, center = true, light = false }) {
  return (
    <div className={`mb-10 max-w-2xl sm:mb-12 ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p className={`mb-2 text-xs font-bold uppercase tracking-[.18em] ${light ? 'text-aqua-400' : 'text-aqua-600'}`}>{eyebrow}</p>
      )}
      <h2 className={`text-2xl font-extrabold sm:text-3xl lg:text-4xl ${light ? '!text-white' : ''}`}>{title}</h2>
      {subtitle && <p className={`mt-3 text-base ${light ? 'text-slate-300' : 'text-slate-600'}`}>{subtitle}</p>}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function CardSkeletons({ count = 3 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <Skeleton className="h-44 rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-red-50 p-6 text-center" role="alert">
      <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
      <p className="text-sm text-red-800">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline btn-sm mt-4">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', text }) {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <Inbox className="mx-auto mb-3 h-10 w-10 text-slate-300" />
      <p className="font-display font-bold text-navy-800">{title}</p>
      {text && <p className="mt-1 text-sm text-slate-500">{text}</p>}
    </div>
  );
}

export function Spinner({ className = 'h-5 w-5' }) {
  return <Loader2 className={`animate-spin ${className}`} aria-label="Loading" />;
}

export function FullPageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-brand-600">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

export function Field({ label, error, hint, children, required, htmlFor }) {
  return (
    <div>
      {label && (
        <label className="label" htmlFor={htmlFor}>
          {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
