import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Phone,
  MessageCircle,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  Waves,
  Activity,
  Gauge,
  Filter,
  Check,
  ArrowRight,
} from 'lucide-react';
import Seo, { localBusinessJsonLd } from '../../components/Seo';
import { useSite } from '../../context/SiteContext';
import FaqAccordion from '../../components/FaqAccordion';
import BookingForm from '../../components/BookingForm';
import Img from '../../components/Img';
import { telHref, whatsappHref } from '../../utils/format';

const RO_FAQS = [
  {
    question: 'How often does a home RO water purifier require servicing?',
    answer:
      'We recommend complete sanitization and TDS testing every 3 to 4 months. In areas with high groundwater hardness or sediment, replacing sediment filters every 3-6 months and servicing the internal storage tank prevents biofilm build-up and maintains optimal flow rate.',
  },
  {
    question: 'What is TDS, and what should my drinking water TDS level be?',
    answer:
      'TDS stands for Total Dissolved Solids (measured in ppm - parts per million). Ideal drinking water TDS is generally between 80 and 150 ppm for optimal mineral balance and taste. During our service visit, our technician uses a calibrated digital TDS meter to test both raw input water and purified output water.',
  },
  {
    question: 'Do you replace the RO membrane or filters during this visit?',
    answer:
      'Our standard maintenance package covers full diagnostic check, internal storage tank descaling & sanitization, filter housing flush, electrical check, and TDS calibration. If our test reveals that a filter or RO membrane has reached end of life, we quote genuine, brand-compatible replacement parts upfront with your approval before replacing.',
  },
  {
    question: 'Which RO purifier brands do your technicians service?',
    answer:
      'We service all major brands and models: Kent RO, Eureka Forbes Aquaguard, Pureit, Havells, Livpure, AO Smith, Blue Star, LG, and custom under-sink commercial systems.',
  },
  {
    question: 'Why does my RO purified water sometimes taste stale or have an odor?',
    answer:
      'Stale taste is almost always caused by microbial biofilm accumulating inside the dark plastic internal storage tank or an exhausted post-carbon / taste enhancer cartridge. Our food-grade tank sanitization dissolves this biofilm completely, restoring fresh, crisp drinking water.',
  },
];

const FILTRATION_STAGES = [
  {
    name: 'Stage 1: Spun Sediment Filter',
    purpose: 'Traps visible mud, rust, and silt particles larger than 5 microns to prevent clogging of downstream filters.',
    lifespan: 'Inspect every 3 months; replace 3-6 months depending on input water turbidity.',
  },
  {
    name: 'Stage 2: Activated Carbon Block',
    purpose: 'Adsorbs volatile organic compounds, chlorine, foul odors, and unpleasant chemical taste.',
    lifespan: 'Service check every 3 months; replace 6-9 months to maintain pure taste.',
  },
  {
    name: 'Stage 3: RO Membrane (0.0001 Micron)',
    purpose: 'Semi-permeable barrier eliminating heavy metals (lead, arsenic, mercury), dissolved salts, and viruses.',
    lifespan: 'Checked via TDS rejection ratio; typically lasts 18 to 24 months with regular maintenance.',
  },
  {
    name: 'Stage 4: Post-Carbon / Mineral Cartridge',
    purpose: 'Balances pH levels, re-infuses essential minerals (calcium, magnesium), and polishes water taste.',
    lifespan: 'Sanitized during service; replaced every 12 months for optimal health benefits.',
  },
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Pre-Service Flow & TDS Diagnostic',
    desc: 'Digital TDS testing of raw input tap water versus purified drinking water. Booster pump pressure check.',
  },
  {
    step: '02',
    title: 'Internal Tank Descaling & Sterilization',
    desc: 'Storage tank is opened, drained of stagnant water, scrubbed free of slimy biofilm, and sanitized with food-grade agents.',
  },
  {
    step: '03',
    title: 'Filter Bowls & Tubing Deep Flush',
    desc: 'Sediment and pre-carbon filter housings are opened, cleaned of red rust deposits, and high-pressure reverse flushed.',
  },
  {
    step: '04',
    title: 'Auto-Cut, Leakage & Membrane Quality Calibration',
    desc: 'Verification of automatic float shut-off valve, high-pressure switch, solenoid valves, and leak-proof O-ring resealing.',
  },
];

export default function ROPurifierCleaningPage() {
  const { settings } = useSite();
  const c = settings?.contact || {};
  const name = settings?.businessName || 'Aqua Ak Enterprises';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'RO Water Purifier Cleaning and Maintenance',
      description:
        'Professional RO purifier servicing, internal tank sterilization, filter flushing, and digital TDS calibration for all major brands.',
      image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1200&q=80',
      provider: {
        '@type': 'LocalBusiness',
        name,
        ...(c.phone ? { telephone: c.phone } : {}),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: RO_FAQS.map((f) => ({
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
        page="ro-water-purifier-cleaning"
        title="RO Water Purifier Cleaning & Servicing | Tank Sanitization & TDS Check"
        description="Comprehensive RO purifier maintenance & tank sterilization. Digital TDS testing, filter housing flush, and pressure calibration for Kent, Aquaguard, Pureit, and all top brands."
        keywords="RO service, water purifier maintenance, RO tank cleaning, TDS test, purifier sanitization, RO repair"
        image="https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1200&q=80"
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white">
        <Img
          src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1920&q=85"
          alt="RO water purifier servicing and filter maintenance"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25 mix-blend-luminosity"
          eager
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-900/85 to-navy-950/70" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_25%,rgba(6,182,212,0.2),transparent_45%)]" />

        <div className="container-x py-16 sm:py-24 lg:py-28">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs font-semibold text-slate-300">
            <Link to="/" className="hover:text-aqua-400">Home</Link> / <Link to="/services" className="hover:text-aqua-400">Services</Link> / <span className="text-white">RO Purifier Maintenance</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <span className="glass mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-aqua-300">
                <Waves className="h-3.5 w-3.5 text-aqua-400" /> Complete System Hygiene & Purity Check
              </span>
              <h1 className="text-3xl font-extrabold leading-tight !text-white sm:text-5xl lg:text-5xl">
                RO Water Purifier Cleaning & Maintenance Services
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
                Ensure every drop your family drinks is 100% pure. Complete internal storage tank sterilization, filter housing deep flush, digital TDS calibration, and multi-point pressure inspection.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="#book" className="btn-aqua">
                  <CalendarCheck className="h-4 w-4" /> Book RO Service
                </a>
                {c.phone && (
                  <a href={telHref(c.phone)} className="btn-ghost-light">
                    <Phone className="h-4 w-4" /> Call {c.phone}
                  </a>
                )}
                {c.whatsapp && (
                  <a
                    href={whatsappHref(c.whatsapp, 'Hello, I want to schedule an RO purifier maintenance service.')}
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
              <h3 className="text-lg font-bold !text-white">What is Included in Our Service</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>Internal storage tank descaling and anti-bacterial scrub.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>Digital input & output TDS testing in front of you.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>Sediment and carbon bowl flush to remove trapped silt.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>Booster pump pressure and auto-cut float valve inspection.</span>
                </li>
              </ul>
              <div className="mt-6 rounded-2xl bg-white/10 p-4 text-center">
                <p className="text-xs font-semibold text-slate-300">All Leading Brands Serviced</p>
                <p className="text-xs text-aqua-300 mt-1">Kent • Aquaguard • Pureit • Havells • Livpure • AO Smith</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Booking Layout */}
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_400px] lg:py-20">
        <div className="min-w-0 space-y-16">
          {/* Service Introduction */}
          <section>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600">
              <ShieldCheck className="h-4 w-4" /> Pure Drinking Water Protection
            </div>
            <h2 className="text-2xl font-extrabold sm:text-3xl text-navy-900">
              Why Regular RO Purifier Servicing is Non-Negotiable
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              While your RO system filters out heavy metals and dissolved contaminants, its dark internal storage tank can become a breeding ground for invisible biofilm and algae over time if left unsterilized. Additionally, clogged sediment filters force the booster pump to overwork, causing membrane tears that allow unpurified water to seep into your glass.
            </p>
            <p className="mt-3 leading-relaxed text-slate-600">
              Our comprehensive maintenance service ensures your purifier runs at optimal efficiency, verifying that water hardness (TDS) is accurately balanced and that the stored drinking water remains as pure as when it passed through the membrane.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="card p-5 text-center">
                <Gauge className="mx-auto h-8 w-8 text-brand-600" />
                <h4 className="mt-3 font-bold text-navy-900 text-sm">TDS Optimization</h4>
                <p className="mt-1 text-xs text-slate-600">Calibration ensures beneficial minerals remain balanced for great taste.</p>
              </div>
              <div className="card p-5 text-center">
                <ShieldCheck className="mx-auto h-8 w-8 text-aqua-600" />
                <h4 className="mt-3 font-bold text-navy-900 text-sm">Tank Hygiene</h4>
                <p className="mt-1 text-xs text-slate-600">Food-grade sanitization prevents stagnant slime and bacteria.</p>
              </div>
              <div className="card p-5 text-center">
                <Activity className="mx-auto h-8 w-8 text-emerald-600" />
                <h4 className="mt-3 font-bold text-navy-900 text-sm">Pump & Leak Guard</h4>
                <p className="mt-1 text-xs text-slate-600">Pressure testing protects under-sink cabinets from water damage.</p>
              </div>
            </div>
          </section>

          {/* Filtration Stage Guide */}
          <section className="rounded-3xl bg-slate-50 p-6 sm:p-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Technical Transparency</span>
            <h2 className="mt-1 text-2xl font-extrabold text-navy-900">
              Understanding Your RO Filtration Stages
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              We educate you on how your purifier functions so you only replace parts when genuinely necessary:
            </p>

            <div className="mt-6 space-y-4">
              {FILTRATION_STAGES.map((f, i) => (
                <div key={i} className="card p-5 border-l-4 border-l-brand-600">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-navy-900 text-sm sm:text-base flex items-center gap-2">
                      <Filter className="h-4 w-4 text-aqua-600 shrink-0" /> {f.name}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{f.purpose}</p>
                  <p className="mt-2 text-xs font-semibold text-brand-700 bg-brand-50 inline-block px-2.5 py-1 rounded-md">
                    Recommended Maintenance: {f.lifespan}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 4-Step Process */}
          <section>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Precision Protocol</span>
            <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl text-navy-900">
              Our 4-Step RO Servicing Workflow
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {PROCESS_STEPS.map((p) => (
                <div key={p.step} className="card p-5 transition hover:shadow-card">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white font-display font-extrabold text-sm">
                    {p.step}
                  </span>
                  <h3 className="mt-3 font-bold text-navy-900 text-base">{p.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Supported Brands */}
          <section className="rounded-3xl bg-navy-800 p-6 sm:p-8 text-white">
            <h2 className="text-xl font-extrabold !text-white sm:text-2xl">
              Compatible with All Top RO Water Purifier Brands
            </h2>
            <p className="mt-2 text-xs text-slate-300">
              Our technicians carry precision diagnostic tools and food-grade sanitizing kits compatible with:
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 text-center">
              {['Kent RO', 'Eureka Forbes', 'Aquaguard', 'HUL Pureit', 'Havells', 'Livpure', 'AO Smith', 'Blue Star'].map((b) => (
                <div key={b} className="glass rounded-xl py-3 px-2 text-xs font-bold text-aqua-300">
                  <Check className="inline h-3 w-3 mr-1 text-aqua-400" /> {b}
                </div>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="mb-6 text-2xl font-extrabold text-navy-900">Frequently Asked Questions</h2>
            <FaqAccordion items={RO_FAQS} />
          </section>
        </div>

        {/* Sticky Booking Sidebar */}
        <aside id="book" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6 shadow-card border-brand-200">
            <div className="mb-4">
              <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                Direct Booking
              </span>
              <h3 className="mt-2 text-xl font-extrabold text-navy-900">Book RO Purifier Service</h3>
              <p className="mt-1 text-xs text-slate-500">Fast doorstep service. Transparent on-site assessment.</p>
            </div>
            <BookingForm compact />
          </div>

          <div className="mt-6 card p-5 bg-gradient-to-br from-slate-50 to-white text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Water Flowing Slow?</p>
            {c.phone && (
              <a href={telHref(c.phone)} className="mt-2 inline-flex items-center gap-2 font-display text-lg font-bold text-brand-600 hover:underline">
                <Phone className="h-4 w-4" /> {c.phone}
              </a>
            )}
            <p className="mt-1 text-xs text-slate-500">Same-day technician visits available</p>
          </div>
        </aside>
      </div>

      {/* Bottom CTA */}
      <section className="section bg-slate-50 border-t border-slate-200">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold text-navy-900">Complete Household Water Hygiene</h2>
            <p className="mt-2 text-sm text-slate-600">Pure water from your purifier starts with a clean overhead water tank.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
            <Link to="/water-tank-cleaning" className="card p-5 transition hover:shadow-card group">
              <h3 className="font-bold text-navy-900 group-hover:text-brand-600 flex items-center justify-between">
                Water Tank Cleaning <ArrowRight className="h-4 w-4 text-aqua-600" />
              </h3>
              <p className="mt-2 text-xs text-slate-600">6-stage mechanized cleaning and UV disinfection.</p>
            </Link>
            <Link to="/services/ro-filter-membrane-replacement" className="card p-5 transition hover:shadow-card group">
              <h3 className="font-bold text-navy-900 group-hover:text-brand-600 flex items-center justify-between">
                Filter & Membrane Service <ArrowRight className="h-4 w-4 text-aqua-600" />
              </h3>
              <p className="mt-2 text-xs text-slate-600">Genuine 75/100 GPD membranes and sediment/carbon swaps.</p>
            </Link>
            <Link to="/services/commercial-ro-plant-servicing" className="card p-5 transition hover:shadow-card group">
              <h3 className="font-bold text-navy-900 group-hover:text-brand-600 flex items-center justify-between">
                Commercial RO Plants <ArrowRight className="h-4 w-4 text-aqua-600" />
              </h3>
              <p className="mt-2 text-xs text-slate-600">Maintenance for 50 LPH to 1,000+ LPH systems for offices & clinics.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
