import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Phone,
  MessageCircle,
  CalendarCheck,
  Bath,
  ChefHat,
  Sparkles,
  ShieldCheck,
  Flame,
  Droplets,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Seo, { localBusinessJsonLd } from '../../components/Seo';
import { useSite } from '../../context/SiteContext';
import FaqAccordion from '../../components/FaqAccordion';
import BookingForm from '../../components/BookingForm';
import Img from '../../components/Img';
import BeforeAfter from '../../components/BeforeAfter';
import { telHref, whatsappHref } from '../../utils/format';

const COMBO_FAQS = [
  {
    question: 'What is included in the Bathroom and Kitchen Combo package?',
    answer:
      'The combo package gives you complete deep cleaning of one bathroom plus one kitchen. This includes tile descaling, hard water limescale removal, chrome fixture polishing, toilet sanitization, chimney filter degreasing, stovetop scrub, tile backsplash degreasing, cabinet exterior wipe, and sink sanitization.',
  },
  {
    question: 'How long does the entire service take, and how many cleaners arrive?',
    answer:
      'We send a 2-cleaner specialized team equipped with rotary scrubbers, industrial degreasers, and descaling compounds. The complete service takes approximately 3 to 3.5 hours.',
  },
  {
    question: 'Will harsh acids be used on my bathroom marble or kitchen granite?',
    answer:
      'Never. We never use corrosive muriatic acids or abrasive powders. We use pH-neutral, surface-safe calcium dissolvers and citrus-based degreasers that protect marble, granite, ceramic glaze, and chrome hardware.',
  },
  {
    question: 'Do I need to prepare my kitchen before your team arrives?',
    answer:
      'We recommend clearing excessive loose utensils from countertops and sinks so our cleaners can access and degrease surfaces thoroughly. Modular cabinet interiors can also be included if items are placed in boxes beforehand.',
  },
];

const BATHROOM_ITEMS = [
  {
    title: 'Hard-Water Descaling',
    desc: 'Dissolves thick calcium and mineral crust from ceramic wall tiles and glass shower cubicles.',
    icon: Droplets,
  },
  {
    title: 'Tile & Grout Deep Scrub',
    desc: 'High-speed rotary agitation lifts black mold, mildew, and yellow grime from grout joints.',
    icon: Layers,
  },
  {
    title: 'Chrome & Metal Fixture Buffing',
    desc: 'Taps, showerheads, health faucets, and towel rods are hand-polished to mirror reflection.',
    icon: Sparkles,
  },
  {
    title: 'Complete Sanitaryware Sterilization',
    desc: 'Heavy-duty descaling and germicidal sanitization of toilet bowl, flush cistern, and washbasin.',
    icon: ShieldCheck,
  },
];

const KITCHEN_ITEMS = [
  {
    title: 'Chimney Hood & Baffle Filter Degreasing',
    desc: 'Baffle and mesh filters are immersed in hot degreasing baths to remove carbonized cooking oil.',
    icon: Flame,
  },
  {
    title: 'Stovetop & Burner Deep Cleansing',
    desc: 'Gas hob surfaces, burner rings, knobs, and drip trays stripped of greasy residue.',
    icon: ChefHat,
  },
  {
    title: 'Tile Backsplash & Wall Degreasing',
    desc: 'Oily splatters behind the cooking range are dissolved and wiped clean to original sheen.',
    icon: Layers,
  },
  {
    title: 'Sink & Countertop Sanitization',
    desc: 'Deep scrub of stainless steel or quartz sinks, limescale removal, and food-contact surface sanitization.',
    icon: Sparkles,
  },
];

export default function BathroomKitchenCleaningPage() {
  const { settings } = useSite();
  const [activeTab, setActiveTab] = useState('both');
  const c = settings?.contact || {};
  const name = settings?.businessName || 'Aqua Ak Enterprises';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Bathroom and Kitchen Deep Cleaning',
      description:
        'Professional bathroom and kitchen deep cleaning combo. Hard water stain descaling, tile scrub, chimney degreasing, and food-safe sanitization.',
      image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80',
      provider: {
        '@type': 'LocalBusiness',
        name,
        ...(c.phone ? { telephone: c.phone } : {}),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: COMBO_FAQS.map((f) => ({
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
        page="bathroom-kitchen-cleaning"
        title="Bathroom & Kitchen Deep Cleaning Services | Hard Water Descaling & Degreasing"
        description="Complete bathroom and kitchen deep cleaning. Remove stubborn hard water limescale from tiles and glass, plus intensive chimney and stovetop degreasing."
        keywords="bathroom deep cleaning, kitchen deep cleaning, chimney degreasing, tile descaling, hard water stain removal, kitchen cleaning"
        image="https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80"
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white">
        <Img
          src="https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1920&q=85"
          alt="Bathroom and kitchen deep cleaning professional results"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25 mix-blend-luminosity"
          eager
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-900/85 to-navy-950/70" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_25%,rgba(6,182,212,0.2),transparent_45%)]" />

        <div className="container-x py-16 sm:py-24 lg:py-28">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs font-semibold text-slate-300">
            <Link to="/" className="hover:text-aqua-400">Home</Link> / <Link to="/services" className="hover:text-aqua-400">Services</Link> / <span className="text-white">Bathroom & Kitchen Deep Cleaning</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <span className="glass mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-aqua-300">
                <Sparkles className="h-3.5 w-3.5 text-aqua-400" /> Dual-Hygiene Special Combo
              </span>
              <h1 className="text-3xl font-extrabold leading-tight !text-white sm:text-5xl lg:text-5xl">
                Bathroom & Kitchen Deep Cleaning Services
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
                Restore sparkling tile glaze, remove hard-water stains, and eradicate sticky oil grease from chimney filters, hobs, and counters with surface-safe, hospital-grade formulations.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="#book" className="btn-aqua">
                  <CalendarCheck className="h-4 w-4" /> Book Combo Package
                </a>
                {c.phone && (
                  <a href={telHref(c.phone)} className="btn-ghost-light">
                    <Phone className="h-4 w-4" /> Call {c.phone}
                  </a>
                )}
                {c.whatsapp && (
                  <a
                    href={whatsappHref(c.whatsapp, 'Hello, I want to book the Bathroom & Kitchen deep cleaning combo.')}
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
              <h3 className="text-lg font-bold !text-white">Dual-Hygiene Package Highlights</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>100% surface-safe calcium dissolvers remove hard-water scale.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>Chimney baffle filter immersion degreasing restores suction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>Rotary brush tile scrub eradicates mildew from porous grout.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>Deep clean both areas in a single synchronized visit.</span>
                </li>
              </ul>
              <div className="mt-6 rounded-2xl bg-white/10 p-4 text-center">
                <p className="text-xs font-semibold text-slate-300">Special Combo Package</p>
                <p className="font-display text-xl font-bold text-aqua-400">1 Bath + 1 Kitchen Deep Clean</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_400px] lg:py-20">
        <div className="min-w-0 space-y-16">
          {/* Tab Filter Controls */}
          <section>
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              <button
                onClick={() => setActiveTab('both')}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${activeTab === 'both' ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                Complete Package (Both)
              </button>
              <button
                onClick={() => setActiveTab('bathroom')}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition inline-flex items-center gap-2 ${activeTab === 'bathroom' ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                <Bath className="h-4 w-4" /> Bathroom Deep Clean
              </button>
              <button
                onClick={() => setActiveTab('kitchen')}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition inline-flex items-center gap-2 ${activeTab === 'kitchen' ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                <ChefHat className="h-4 w-4" /> Kitchen Deep Clean
              </button>
            </div>
          </section>

          {/* Section 1: Bathroom Deep Cleaning */}
          {(activeTab === 'both' || activeTab === 'bathroom') && (
            <section className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-aqua-600">
                <Bath className="h-4 w-4" /> Comprehensive Sanitization
              </div>
              <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">
                1. Professional Bathroom Deep Cleaning
              </h2>
              <p className="leading-relaxed text-slate-600">
                Hard water in urban regions contains heavy calcium and magnesium that bond with soap fats, creating a stubborn white or chalky film on shower glass, ceramic tiles, and chrome faucets. Our specialized descaling treatment gently dissolves this calcium matrix without etching glossy tile surfaces or causing micro-scratches.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {BATHROOM_ITEMS.map((item, i) => {
                  const IconCmp = item.icon;
                  return (
                    <div key={i} className="card p-5">
                      <IconCmp className="h-6 w-6 text-brand-600 mb-2" />
                      <h4 className="font-bold text-navy-900 text-sm">{item.title}</h4>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Bathroom Before/After */}
              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <h4 className="font-bold text-navy-900 text-sm mb-3">Bathroom Descaling: Before & After</h4>
                <BeforeAfter
                  before="https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1000&q=80"
                  after="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80"
                  title="Bathroom Tile Descaling Transformation"
                />
              </div>
            </section>
          )}

          {/* Section 2: Kitchen Deep Cleaning */}
          {(activeTab === 'both' || activeTab === 'kitchen') && (
            <section className="space-y-6 pt-6 border-t border-slate-200">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
                <ChefHat className="h-4 w-4" /> Heavy Grease Eradication
              </div>
              <h2 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">
                2. Professional Kitchen Deep Cleaning
              </h2>
              <p className="leading-relaxed text-slate-600">
                Indian and Asian culinary traditions involve high-heat frying and spices that vaporize and settle as a sticky yellow crust across chimney filters, tiled splashbacks, cabinet handles, and behind the stove. Daily surface wiping only smears this grease. Our industrial citrus-based degreasers break down carbonized oil bonds within minutes.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {KITCHEN_ITEMS.map((item, i) => {
                  const IconCmp = item.icon;
                  return (
                    <div key={i} className="card p-5">
                      <IconCmp className="h-6 w-6 text-amber-600 mb-2" />
                      <h4 className="font-bold text-navy-900 text-sm">{item.title}</h4>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Kitchen Before/After */}
              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <h4 className="font-bold text-navy-900 text-sm mb-3">Kitchen Chimney & Hob: Before & After</h4>
                <BeforeAfter
                  before="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80"
                  after="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80"
                  title="Kitchen Chimney & Backsplash Transformation"
                />
              </div>
            </section>
          )}

          {/* Why Choose Us */}
          <section className="rounded-3xl bg-navy-800 p-6 sm:p-8 text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-aqua-400">Strict Safety Standards</span>
            <h2 className="mt-1 text-xl font-extrabold !text-white sm:text-2xl">
              Zero Acid. Zero Damaged Glaze. 100% Surface Protection.
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-slate-200">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-aqua-400 shrink-0 mt-0.5" />
                <span>Safe for Italian marble, polished granite, and delicate vitrified tiles.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-aqua-400 shrink-0 mt-0.5" />
                <span>Leaves no toxic chlorine fumes or stinging odors in your living area.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-aqua-400 shrink-0 mt-0.5" />
                <span>Color-coded microfiber towels prevent any cross-contamination.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-aqua-400 shrink-0 mt-0.5" />
                <span>Trained and background-verified technicians with safety footwear.</span>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="mb-6 text-2xl font-extrabold text-navy-900">Frequently Asked Questions</h2>
            <FaqAccordion items={COMBO_FAQS} />
          </section>
        </div>

        {/* Sticky Booking Sidebar */}
        <aside id="book" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6 shadow-card border-brand-200">
            <div className="mb-4">
              <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                Combo Deep Clean
              </span>
              <h3 className="mt-2 text-xl font-extrabold text-navy-900">Book Deep Clean</h3>
              <p className="mt-1 text-xs text-slate-500">Includes 1 Bathroom & 1 Kitchen. Select your slot below.</p>
            </div>
            <BookingForm compact />
          </div>

          <div className="mt-6 card p-5 bg-gradient-to-br from-slate-50 to-white text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Need Extra Bathrooms Added?</p>
            <p className="mt-1 text-xs text-slate-600">Additional bathrooms or balconies can be added to your booking.</p>
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
            <h2 className="text-2xl font-extrabold text-navy-900">Pair With Our Other Core Services</h2>
            <p className="mt-2 text-sm text-slate-600">Keep every aspect of your home clean, hygienic, and safe.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
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
            <Link to="/glass-window-cleaning" className="card p-5 transition hover:shadow-card group">
              <h3 className="font-bold text-navy-900 group-hover:text-brand-600 flex items-center justify-between">
                Glass & Window Cleaning <ArrowRight className="h-4 w-4 text-aqua-600" />
              </h3>
              <p className="mt-2 text-xs text-slate-600">Streak-free squeegee clarity for balconies and windows.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
