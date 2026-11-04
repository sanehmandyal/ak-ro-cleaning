import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Sparkles,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Waves,
  Bath,
  ChefHat,
  AppWindow,
  Building2,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageCircle,
} from 'lucide-react';
import Seo from '../../components/Seo';
import { get, errorMessage } from '../../services/api';
import { useSite } from '../../context/SiteContext';
import { CardSkeletons, ErrorState, EmptyState, Spinner } from '../../components/ui';
import Img from '../../components/Img';
import BeforeAfter from '../../components/BeforeAfter';
import { optimizeImage, telHref, whatsappHref } from '../../utils/format';

const PAGE_SIZE = 12;

const CATEGORY_ICONS = {
  All: Sparkles,
  'Water Tank Cleaning': Droplets,
  'RO Purifier Servicing': Waves,
  'Bathroom Deep Cleaning': Bath,
  'Kitchen Deep Cleaning': ChefHat,
  'Glass & Window Cleaning': AppWindow,
  'Commercial RO & Office': Building2,
  'Team & Equipment': Wrench,
};

const SERVICE_LINKS = {
  'Water Tank Cleaning': '/water-tank-cleaning',
  'RO Purifier Servicing': '/ro-water-purifier-cleaning',
  'Bathroom Deep Cleaning': '/bathroom-kitchen-cleaning',
  'Kitchen Deep Cleaning': '/bathroom-kitchen-cleaning',
  'Glass & Window Cleaning': '/glass-window-cleaning',
  'Commercial RO & Office': '/services/commercial-ro-plant-servicing',
  'Team & Equipment': '/booking',
};

export default function Gallery() {
  const { settings } = useSite();
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [retry, setRetry] = useState(0);

  const c = settings?.contact || {};
  const name = settings?.businessName || 'Aqua Ak Enterprises';

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    get('/gallery', { category, page, limit: PAGE_SIZE })
      .then((r) => {
        if (!active) return;
        setItems((prev) => (page === 1 ? r.data : [...prev, ...r.data]));
        setPages(r.pagination?.pages || 1);
        if (r.categories && r.categories.length > 0) {
          setCategories(r.categories);
        }
      })
      .catch((e) => {
        if (active) setError(errorMessage(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [category, page, retry]);

  const singleItems = useMemo(() => items.filter((i) => i.type !== 'before-after' || !i.type), [items]);

  const activeLightboxItem = lightboxIndex !== null ? singleItems[lightboxIndex] : null;

  const nextLightbox = () => {
    if (lightboxIndex !== null && singleItems.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % singleItems.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null && singleItems.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + singleItems.length) % singleItems.length);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const choose = (cat) => {
    setItems([]);
    setPage(1);
    setCategory(cat);
  };

  const beforeAfterItems = useMemo(() => items.filter((i) => i.type === 'before-after'), [items]);

  const displayCategories = useMemo(() => {
    const defaultList = [
      'All',
      'Water Tank Cleaning',
      'RO Purifier Servicing',
      'Bathroom Deep Cleaning',
      'Kitchen Deep Cleaning',
      'Glass & Window Cleaning',
      'Commercial RO & Office',
      'Team & Equipment',
    ];
    if (categories.length > 0) {
      const merged = new Set(['All', ...categories]);
      defaultList.forEach((c) => merged.add(c));
      return Array.from(merged);
    }
    return defaultList;
  }, [categories]);

  return (
    <>
      <Seo
        page="gallery"
        title={`Our Work Gallery | Real Transformations | ${name}`}
        description="Browse authentic photographs of our water tank cleaning, RO purifier maintenance, bathroom & kitchen deep clean, and commercial RO projects."
        keywords="cleaning gallery, water tank cleaning photos, RO purifier service photos, before after cleaning, bathroom descaling pictures"
      />

      {/* Hero Header */}
      <section className="relative isolate overflow-hidden bg-navy-800 text-white">
        <Img
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80"
          alt="Professional water tank and cleaning gallery background"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25"
          eager
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-900/90 to-navy-800/80" />

        <div className="container-x py-16 text-center sm:py-24">
          <span className="glass mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-aqua-300">
            <Sparkles className="h-3.5 w-3.5 text-aqua-400" /> Verifiable On-Site Transformations
          </span>
          <h1 className="text-3xl font-extrabold leading-tight !text-white sm:text-5xl lg:text-6xl">
            Our Work Gallery
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
            Real photography from actual client sites. See the hygienic difference of our 6-stage mechanized water tank cleanings, internal RO storage sterilizations, and intensive descaling.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/booking" className="btn-aqua">
              <CalendarCheck className="h-4 w-4" /> Book a Transformation
            </Link>
            {c.phone && (
              <a href={telHref(c.phone)} className="btn-ghost-light">
                <Phone className="h-4 w-4" /> Call {c.phone}
              </a>
            )}
            {c.whatsapp && (
              <a
                href={whatsappHref(c.whatsapp, 'Hello, I was viewing your gallery and would like to book a service.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-light"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Equipment & Standards Showcase Bar */}
      <section className="border-b border-slate-200 bg-slate-50 py-5">
        <div className="container-x">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            <div className="flex flex-col items-center p-2">
              <span className="font-display text-xl font-bold text-brand-600 sm:text-2xl">150-Bar</span>
              <span className="text-xs font-semibold text-slate-600">Rotary Jet Power</span>
            </div>
            <div className="flex flex-col items-center p-2">
              <span className="font-display text-xl font-bold text-aqua-600 sm:text-2xl">100%</span>
              <span className="text-xs font-semibold text-slate-600">Food-Grade Non-Toxic</span>
            </div>
            <div className="flex flex-col items-center p-2">
              <span className="font-display text-xl font-bold text-teal-600 sm:text-2xl">German Slurry</span>
              <span className="text-xs font-semibold text-slate-600">Vacuum Dewatering</span>
            </div>
            <div className="flex flex-col items-center p-2">
              <span className="font-display text-xl font-bold text-navy-800 sm:text-2xl">Digital TDS</span>
              <span className="text-xs font-semibold text-slate-600">Calibrated Testing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="section pb-8">
        <div className="container-x">
          <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Gallery categories">
            {displayCategories.map((cName) => {
              const Icon = CATEGORY_ICONS[cName] || Sparkles;
              const active = category === cName;
              return (
                <button
                  key={cName}
                  role="tab"
                  aria-selected={active}
                  onClick={() => choose(cName)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
                    active
                      ? 'bg-brand-600 text-white shadow-glow'
                      : 'bg-slate-100 text-navy-800 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {cName}
                </button>
              );
            })}
          </div>

          {/* Interactive Before & After Spotlight (when showing All or relevant categories) */}
          {beforeAfterItems.length > 0 && page === 1 && (
            <div className="mb-14">
              <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
                    <ShieldCheck className="h-4 w-4" /> Before & After Transformations
                  </span>
                  <h2 className="mt-1 text-2xl font-extrabold text-navy-900">
                    Direct Side-by-Side Proof of Purity
                  </h2>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {beforeAfterItems.map((item) => (
                  <div key={item._id} className="card overflow-hidden shadow-card hover:shadow-card-hover transition">
                    <div className="p-3 bg-slate-100">
                      <BeforeAfter
                        before={item.beforeImage?.url}
                        after={item.afterImage?.url}
                        title={item.title}
                      />
                    </div>
                    <div className="p-5">
                      <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                        {item.category}
                      </span>
                      <h3 className="mt-2 text-base font-bold text-navy-900">{item.title}</h3>
                      {item.description && (
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.description}</p>
                      )}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          to={SERVICE_LINKS[item.category] || '/booking'}
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                        >
                          Book Service <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Photo Gallery Grid */}
          <div>
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-aqua-600">
                  <Sparkles className="h-4 w-4" /> Project Photography
                </span>
                <h2 className="mt-1 text-2xl font-extrabold text-navy-900">
                  {category === 'All' ? 'Complete Project Portfolio' : `${category} Photographs`}
                </h2>
              </div>
            </div>

            {error ? (
              <ErrorState message={error} onRetry={() => setRetry((r) => r + 1)} />
            ) : loading && page === 1 ? (
              <CardSkeletons count={6} />
            ) : items.length === 0 ? (
              <EmptyState title="No photos found" text="Try selecting another category or check back soon." />
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((g) => {
                    const isBeforeAfter = g.type === 'before-after';
                    const singleIdx = singleItems.findIndex((s) => s._id === g._id);

                    return (
                      <figure
                        key={g._id}
                        className="card overflow-hidden transition duration-300 hover:shadow-card-hover group"
                      >
                        {isBeforeAfter ? (
                          <div className="p-3 bg-slate-100">
                            <BeforeAfter
                              before={g.beforeImage?.url}
                              after={g.afterImage?.url}
                              title={g.title}
                            />
                          </div>
                        ) : (
                          <div
                            className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 cursor-pointer"
                            onClick={() => {
                              if (singleIdx !== -1) setLightboxIndex(singleIdx);
                            }}
                          >
                            <Img
                              src={g.image?.url}
                              alt={g.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-navy-950/20 opacity-0 transition group-hover:opacity-100 flex items-center justify-center">
                              <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-navy-900 shadow">
                                Click to Zoom
                              </span>
                            </div>
                          </div>
                        )}
                        <figcaption className="p-5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-block rounded-full bg-aqua-50 px-2.5 py-0.5 text-xs font-bold text-aqua-700">
                              {g.category}
                            </span>
                          </div>
                          <h3 className="mt-2 font-display text-base font-bold text-navy-900 group-hover:text-brand-600 transition">
                            {g.title}
                          </h3>
                          {g.description && (
                            <p className="mt-1 text-xs leading-relaxed text-slate-600">{g.description}</p>
                          )}
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" /> Verified On-Site Result
                            </span>
                            <Link
                              to={SERVICE_LINKS[g.category] || '/booking'}
                              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                            >
                              Book <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>

                {page < pages && (
                  <div className="mt-12 text-center">
                    <button
                      className="btn-outline"
                      disabled={loading}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      {loading ? <Spinner className="h-4 w-4" /> : null} Load More Work
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-navy-950/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxItem.title}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {singleItems.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightbox();
                }}
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightbox();
                }}
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <figure
            className="max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-navy-900 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={optimizeImage(activeLightboxItem.image?.url, 1600)}
              alt={activeLightboxItem.title}
              className="max-h-[75vh] w-auto rounded-xl object-contain mx-auto"
            />
            <figcaption className="p-4 text-center">
              <span className="inline-block rounded-full bg-aqua-400/20 px-3 py-1 text-xs font-bold text-aqua-300 mb-1">
                {activeLightboxItem.category}
              </span>
              <p className="font-display text-lg font-bold text-white">{activeLightboxItem.title}</p>
              {activeLightboxItem.description && (
                <p className="mt-1 text-xs text-slate-300 max-w-xl mx-auto">{activeLightboxItem.description}</p>
              )}
            </figcaption>
          </figure>
        </div>
      )}

      {/* Bottom CTA */}
      <section className="section bg-slate-50 border-t border-slate-200">
        <div className="container-x">
          <div className="rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 p-8 text-white sm:p-12 text-center max-w-4xl mx-auto shadow-card">
            <h2 className="text-2xl font-extrabold sm:text-3xl !text-white">
              Want Results Like These For Your Home or Workplace?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
              Schedule your water tank cleaning, RO purifier sanitization, or deep cleaning today. Our certified team arrives on time with mechanized equipment.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/booking" className="btn-aqua">
                <CalendarCheck className="h-4 w-4" /> Book Doorstep Service
              </Link>
              {c.phone && (
                <a href={telHref(c.phone)} className="btn-ghost-light">
                  <Phone className="h-4 w-4" /> Call {c.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
