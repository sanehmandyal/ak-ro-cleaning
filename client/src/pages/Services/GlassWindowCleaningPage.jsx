import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Phone,
  MessageCircle,
  CalendarCheck,
  AppWindow,
  Sparkles,
  ShieldCheck,
  Eye,
  Sun,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Seo, { localBusinessJsonLd } from '../../components/Seo';
import { useSite } from '../../context/SiteContext';
import FaqAccordion from '../../components/FaqAccordion';
import BookingForm from '../../components/BookingForm';
import Img from '../../components/Img';
import { telHref, whatsappHref } from '../../utils/format';

const GLASS_FAQS = [
  {
    question: 'How do you clean high-rise apartment exterior balcony glass safely?',
    answer:
      'For high-rise residential balconies, our technicians use specialized telescopic carbon-fiber extension poles, magnetic dual-sided glass washers, and secure harness lanyards. We reach exterior panels thoroughly without compromising safety or spilling dirty runoff onto lower balconies.',
  },
  {
    question: 'Can you remove stubborn white hard-water calcium marks from glass shower partitions?',
    answer:
      'Yes. Shower cubicles develop dense calcium silicate crusts from soap and hard water. We apply a specialized non-abrasive mineral dissolver and buff the glass with ultra-fine felt pads, completely lifting mineral spots without scratching the tempered glass.',
  },
  {
    question: 'Do you clean window slider tracks and aluminum frames?',
    answer:
      'Yes! A complete window clean is never just about the glass. We use narrow nozzle crevice vacuums to extract accumulated sand, dust, and dead insects from slider tracks, wipe aluminum/uPVC frames, and ensure smooth sliding operation.',
  },
  {
    question: 'Will cleaning damage tinted films or frosted decorative glass?',
    answer:
      'No. We use pH-neutral, ammonia-free anti-static cleaning concentrates that are 100% safe for sun-control films, frosted glass, acoustic laminated glass, and bevelled decorative mirrors.',
  },
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Frame & Track Deep Vacuum',
    desc: 'High-suction crevice tools extract settled sand, atmospheric dust, and debris from uPVC / aluminum slider channels.',
  },
  {
    step: '02',
    title: 'Mineral Dissolution & Agitation',
    desc: 'Professional micro-fiber washer wands apply anti-static cleaning solution to break down rain spots and greasy finger marks.',
  },
  {
    step: '03',
    title: 'Precision Squeegee Extraction',
    desc: 'High-grade German silicone squeegee blades draw moisture off the glass in continuous, unified, streak-free passes.',
  },
  {
    step: '04',
    title: 'Microfiber Edge Buffing & Inspection',
    desc: 'Waffle-weave lint-free microfiber towels polish perimeter borders, sills, and hardware to a crystal clear mirror shine.',
  },
];

export default function GlassWindowCleaningPage() {
  const { settings } = useSite();
  const c = settings?.contact || {};
  const name = settings?.businessName || 'Aqua Ak Enterprises';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Glass and Window Cleaning Services',
      description:
        'Professional glass and window cleaning. Streak-free squeegee technique, hard water spot removal, and frame track vacuuming for homes and commercial facades.',
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80',
      provider: {
        '@type': 'LocalBusiness',
        name,
        ...(c.phone ? { telephone: c.phone } : {}),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: GLASS_FAQS.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
    localBusinessJsonLd(settings),
  ].filter(Boolean);

  return (
    <>
      <Seo
        page="glass-window-cleaning"
        title="Professional Glass & Window Cleaning | Streak-Free Balcony & Facade"
        description="Expert window and glass cleaning services. 100% streak-free squeegee technique, track vacuuming, and hard water calcium stain removal."
        keywords="window cleaning, glass cleaning, balcony glass cleaning, streak free windows, glass stain removal, window squeegee"
        image="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80"
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white">
        <Img
          src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1920&q=85"
          alt="Professional glass and window squeegee cleaning"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25 mix-blend-luminosity"
          eager
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-900/85 to-navy-950/70" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_25%,rgba(6,182,212,0.2),transparent_45%)]" />

        <div className="container-x py-16 sm:py-24 lg:py-28">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs font-semibold text-slate-300">
            <Link to="/" className="hover:text-aqua-400">Home</Link> / <Link to="/services" className="hover:text-aqua-400">Services</Link> / <span className="text-white">Glass & Window Cleaning</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <span className="glass mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-aqua-300">
                <AppWindow className="h-3.5 w-3.5 text-aqua-400" /> 100% Streak-Free Optical Clarity
              </span>
              <h1 className="text-3xl font-extrabold leading-tight !text-white sm:text-5xl lg:text-5xl">
                Crystal Clear Glass & Window Cleaning Services
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
                Restore radiant natural sunlight and spotless views. Professional squeegee cleaning for residential balcony glass, large sliding French doors, shower cubicles, and commercial storefronts.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="#book" className="btn-aqua">
                  <CalendarCheck className="h-4 w-4" /> Book Window Cleaning
                </a>
                {c.phone && (
                  <a href={telHref(c.phone)} className="btn-ghost-light">
                    <Phone className="h-4 w-4" /> Call {c.phone}
                  </a>
                )}
                {c.whatsapp && (
                  <a
                    href={whatsappHref(c.whatsapp, 'Hello, I want to book glass and window cleaning.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost-light"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                )}
              </div>
            </div>

            <div className="glass hidden rounded-3xl p-6 lg:block">
              <h3 className="text-lg font-bold !text-white">Service Inclusions</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>Flawless streak-free finish using professional silicone squeegees.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>Crevice vacuuming of window slider tracks and dust channels.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>Specialized calcium descaling for balcony & shower glass.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>Anti-static coating repels dust accumulation for weeks.</span>
                </li>
              </ul>
              <div className="mt-6 rounded-2xl bg-white/10 p-4 text-center">
                <p className="text-xs font-semibold text-slate-300">Fast Doorstep Service</p>
                <p className="font-display text-xl font-bold text-aqua-400">Streak-Free Optical Clarity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_400px] lg:py-20">
        <div className="min-w-0 space-y-16">
          {/* Residential vs Commercial */}
          <section>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Tailored Solutions</span>
            <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl text-navy-900">
              Complete Glass Cleaning for Homes & Businesses
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="card p-6 border-t-4 border-t-brand-600">
                <h3 className="font-bold text-navy-900 text-lg flex items-center gap-2">
                  <Sun className="h-5 w-5 text-amber-500" /> Residential Glass Care
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-aqua-600 shrink-0 mt-0.5" /> High-rise balcony glass panels & railings</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-aqua-600 shrink-0 mt-0.5" /> Sliding French windows and fly-mesh screens</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-aqua-600 shrink-0 mt-0.5" /> Tempered shower partitions descaled</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-aqua-600 shrink-0 mt-0.5" /> Decorative wall mirrors and skylights</li>
                </ul>
              </div>

              <div className="card p-6 border-t-4 border-t-navy-800">
                <h3 className="font-bold text-navy-900 text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5 text-brand-600" /> Commercial & Retail Facades
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-aqua-600 shrink-0 mt-0.5" /> Retail showroom storefront display glass</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-aqua-600 shrink-0 mt-0.5" /> Corporate office conference room partitions</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-aqua-600 shrink-0 mt-0.5" /> Building entrance glass revolving doors</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-aqua-600 shrink-0 mt-0.5" /> Low-rise exterior facade glass washing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4-Step Process */}
          <section className="rounded-3xl bg-slate-50 p-6 sm:p-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Our Method</span>
            <h2 className="mt-1 text-2xl font-extrabold text-navy-900">
              The 4-Step Streak-Free Squeegee Technique
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {PROCESS_STEPS.map((p) => (
                <div key={p.step} className="card p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white font-display font-extrabold text-sm">
                    {p.step}
                  </span>
                  <h4 className="mt-3 font-bold text-navy-900 text-base">{p.title}</h4>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="rounded-3xl bg-navy-800 p-6 sm:p-8 text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-aqua-400">Why Professional Care Matters</span>
            <h2 className="mt-1 text-xl font-extrabold !text-white sm:text-2xl">
              Why Paper Towels & Wipes Don&apos;t Work
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Newspaper and ordinary paper towels leave behind microscopic wood pulp lint, static charges, and swirl streaks that attract dust within hours. Our specialized rubber squeegees draw water off the surface cleanly without friction, while our anti-static solution repels air pollutants so your glass stays clean significantly longer.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm text-slate-200">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-aqua-400 shrink-0 mt-0.5" />
                <span>Zero streaks or haze when viewed against direct afternoon sunlight.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-aqua-400 shrink-0 mt-0.5" />
                <span>Telescopic carbon-fiber poles safely reach difficult exterior heights.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-aqua-400 shrink-0 mt-0.5" />
                <span>Dissolves hard-water rain spots without abrasive scratching.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-aqua-400 shrink-0 mt-0.5" />
                <span>Smooth sliding tracks prevent wear on roller wheels.</span>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="mb-6 text-2xl font-extrabold text-navy-900">Frequently Asked Questions</h2>
            <FaqAccordion items={GLASS_FAQS} />
          </section>
        </div>

        {/* Sticky Booking Sidebar */}
        <aside id="book" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6 shadow-card border-brand-200">
            <div className="mb-4">
              <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                Direct Booking
              </span>
              <h3 className="mt-2 text-xl font-extrabold text-navy-900">Book Glass Cleaning</h3>
              <p className="mt-1 text-xs text-slate-500">Fast online booking. Transparent doorstep assessment.</p>
            </div>
            <BookingForm compact />
          </div>

          <div className="mt-6 card p-5 bg-gradient-to-br from-slate-50 to-white text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Commercial / Storefront Quote?</p>
            <p className="mt-1 text-xs text-slate-600">We offer custom site inspections and recurring corporate rates.</p>
            {c.phone && (
              <a href={telHref(c.phone)} className="mt-3 inline-flex items-center gap-2 font-display text-base font-bold text-brand-600 hover:underline">
                <Phone className="h-4 w-4" /> Call {c.phone}
              </a>
            )}
          </div>
        </aside>
      </div>

      {/* Bottom CTA */}
      <section className="section bg-slate-50 border-t border-slate-200">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold text-navy-900">Complementary Deep Cleaning Services</h2>
            <p className="mt-2 text-sm text-slate-600">Enjoy full home hygiene alongside crystal clear windows.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link to="/bathroom-kitchen-cleaning" className="card p-5 transition hover:shadow-card group">
              <h3 className="font-bold text-navy-900 group-hover:text-brand-600 flex items-center justify-between">
                Bathroom & Kitchen Combo <ArrowRight className="h-4 w-4 text-aqua-600" />
              </h3>
              <p className="mt-2 text-xs text-slate-600">Hard water descaling and chimney degreasing.</p>
            </Link>
            <Link to="/water-tank-cleaning" className="card p-5 transition hover:shadow-card group">
              <h3 className="font-bold text-navy-900 group-hover:text-brand-600 flex items-center justify-between">
                Water Tank Cleaning <ArrowRight className="h-4 w-4 text-aqua-600" />
              </h3>
              <p className="mt-2 text-xs text-slate-600">6-stage mechanized cleaning and UV disinfection.</p>
            </Link>
            <Link to="/ro-water-purifier-cleaning" className="card p-5 transition hover:shadow-card group">
              <h3 className="font-bold text-navy-900 group-hover:text-brand-600 flex items-center justify-between">
                RO Purifier Maintenance <ArrowRight className="h-4 w-4 text-aqua-600" />
              </h3>
              <p className="mt-2 text-xs text-slate-600">Tank sterilization, TDS check, and filter flushing.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
