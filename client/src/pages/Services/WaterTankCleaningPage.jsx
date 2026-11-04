import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Phone,
  MessageCircle,
  CalendarCheck,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Droplets,
  Layers,
  Wrench,
  Activity,
  ArrowRight,
} from 'lucide-react';
import Seo, { localBusinessJsonLd } from '../../components/Seo';
import { useSite } from '../../context/SiteContext';
import FaqAccordion from '../../components/FaqAccordion';
import BookingForm from '../../components/BookingForm';
import Img from '../../components/Img';
import BeforeAfter from '../../components/BeforeAfter';
import { telHref, whatsappHref } from '../../utils/format';

const TANK_FAQS = [
  {
    question: 'How frequently should overhead and underground water tanks be cleaned?',
    answer:
      'According to municipal health guidelines and the World Health Organization (WHO), drinking and domestic water storage tanks should be professionally emptied, descaled, and sterilized every 6 months. In areas with high groundwater TDS or hard water, quarterly cleaning is strongly recommended.',
  },
  {
    question: 'What is your 6-stage mechanized water tank cleaning process?',
    answer:
      'Our 6 stages are: (1) Mechanized Dewatering, (2) German Slurry Vacuum Extraction, (3) High-Pressure Rotary Jet Scrubbing (150 Bar), (4) Vacuum Sludge Evacuation, (5) Food-Grade Anti-Bacterial Sanitization Spray, and (6) UV Radiation Disinfection to kill dormant bacterial spores and algae.',
  },
  {
    question: 'Do you use toxic chemical bleach or chlorine that leaves a bad odor?',
    answer:
      'No. We exclusively use certified food-grade, biodegradable, non-hazardous antibacterial agents. Our sanitizing solution rinses away completely with zero toxic chemical residue, leaving your water crystal clear, pure, and completely odorless.',
  },
  {
    question: 'How long does the water tank cleaning take, and will my water supply be disrupted?',
    answer:
      'A standard overhead tank (500L to 1,500L) takes approximately 60 to 90 minutes. Large underground sumps (5,000L to 20,000L) take about 2 to 3.5 hours. We advise booking a time when low water is already in the tank, minimizing any wastage or disruption to your home.',
  },
  {
    question: 'Can you clean both plastic Sintex tanks and concrete underground sumps?',
    answer:
      'Yes. Our pressure washers, slurry pumps, and disinfection techniques are calibrated for all tank types including HDPE/plastic Sintex tanks, stainless steel tanks, loft tanks, and large underground RCC concrete sumps.',
  },
];

const STAGES = [
  {
    step: '01',
    title: 'Mechanized Dewatering',
    desc: 'High-discharge submersible pumps rapidly drain existing dirty water down to the base level.',
    icon: Droplets,
  },
  {
    step: '02',
    title: 'Heavy Slurry Extraction',
    desc: 'German slurry suction pumps remove thick sediment, settled sand, mud, and decaying organic debris.',
    icon: Layers,
  },
  {
    step: '03',
    title: '150-Bar High-Pressure Scrubbing',
    desc: 'Rotary high-pressure water jets blast away algae, calcium calcite crust, and biofilm from walls and ceiling.',
    icon: Wrench,
  },
  {
    step: '04',
    title: 'Vacuum Sludge Evacuation',
    desc: 'Industrial vacuum suction units evacuate every drop of dirty suspended slurry from corners and seams.',
    icon: Activity,
  },
  {
    step: '05',
    title: 'Food-Grade Antibacterial Spray',
    desc: 'Tanks are misted with eco-friendly, food-safe antibacterial solution to neutralize invisible microbes.',
    icon: ShieldCheck,
  },
  {
    step: '06',
    title: 'Ultraviolet (UV) Sterilization',
    desc: 'Specially engineered high-intensity UV lamps radiate the interior to eradicate floating cysts and bacterial spores.',
    icon: Sparkles,
  },
];

const EQUIPMENT = [
  { name: '150-Bar Rotary Pressure Washer', desc: 'Commercial water jet blast descales thick calcite without damaging tank walls.' },
  { name: 'German Industrial Slurry Vacuum', desc: 'Heavy-duty extraction unit capable of sucking dense mud, silt, and rust.' },
  { name: 'Submersible Dewatering Pumps', desc: 'High-volume dewatering evacuates large residential and commercial tanks fast.' },
  { name: 'UV Radiation Disinfection Lamp', desc: 'Ultraviolet ray sterilizer destroys waterborne microorganisms at a cellular level.' },
  { name: 'Anti-Bacterial Cold Fogger', desc: 'Disperses a sterile micron-level mist across ceiling, vents, and tight corners.' },
  { name: 'Personal Protective Sterile Gear', desc: 'Technicians wear clean-room suits, non-marking rubber boots, and safety masks.' },
];

export default function WaterTankCleaningPage() {
  const { settings } = useSite();
  const c = settings?.contact || {};
  const name = settings?.businessName || 'Aqua Ak Enterprises';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Water Tank Cleaning Services',
      description:
        'Professional 6-stage mechanized water tank cleaning, sludge extraction, and UV sterilization for overhead and underground tanks.',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
      provider: {
        '@type': 'LocalBusiness',
        name,
        ...(c.phone ? { telephone: c.phone } : {}),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: TANK_FAQS.map((f) => ({
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
        page="water-tank-cleaning"
        title="Water Tank Cleaning Services | 6-Stage Mechanized & UV Disinfection"
        description="Certified 6-stage mechanized water tank cleaning. Complete sludge vacuum extraction, 150-bar rotary pressure wash, and UV sterilization for overhead and underground sumps."
        keywords="water tank cleaning, underground sump cleaning, overhead tank cleaning, mechanized tank cleaning, UV disinfection tank"
        image="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80"
        jsonLd={jsonLd}
      />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white">
        <Img
          src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=85"
          alt="Water tank cleaning equipment and sterile reservoir"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30 mix-blend-luminosity"
          eager
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-900/85 to-navy-950/70" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_25%,rgba(6,182,212,0.2),transparent_45%)]" />

        <div className="container-x py-16 sm:py-24 lg:py-28">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs font-semibold text-slate-300">
            <Link to="/" className="hover:text-aqua-400">Home</Link> / <Link to="/services" className="hover:text-aqua-400">Services</Link> / <span className="text-white">Water Tank Cleaning</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <span className="glass mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-aqua-300">
                <Sparkles className="h-3.5 w-3.5 text-aqua-400" /> 6-Stage Mechanized & UV Disinfection
              </span>
              <h1 className="text-3xl font-extrabold leading-tight !text-white sm:text-5xl lg:text-5xl">
                Certified Water Tank Cleaning & Sanitization Services
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
                Safeguard your family from waterborne bacteria, algae, and muddy sediment. We utilize 150-bar rotary pressure jets, German slurry extraction vacuums, and hospital-grade UV sterilization.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="#book" className="btn-aqua">
                  <CalendarCheck className="h-4 w-4" /> Book Tank Cleaning
                </a>
                {c.phone && (
                  <a href={telHref(c.phone)} className="btn-ghost-light">
                    <Phone className="h-4 w-4" /> Call {c.phone}
                  </a>
                )}
                {c.whatsapp && (
                  <a
                    href={whatsappHref(c.whatsapp, 'Hello, I want to book a water tank cleaning service.')}
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
              <h3 className="text-lg font-bold !text-white">Why Pure Tank Water Matters</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>Prevents typhoid, cholera, and gastrointestinal infections.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>Stops premature clogging of expensive RO water purifier filters.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>Prevents hair fall, skin irritation, and unpleasant tap odors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-400" />
                  <span>Extends the life of washing machines, geysers, and plumbing fixtures.</span>
                </li>
              </ul>
              <div className="mt-6 rounded-2xl bg-white/10 p-4 text-center">
                <p className="text-xs font-semibold text-slate-300">Fast Doorstep Service</p>
                <p className="font-display text-xl font-bold text-aqua-400">Customized Free Assessment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Booking Form Layout */}
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_400px] lg:py-20">
        <div className="min-w-0 space-y-16">
          {/* Why Cleaning Matters */}
          <section>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
              <AlertTriangle className="h-4 w-4" /> The Hidden Danger in Storage Tanks
            </div>
            <h2 className="text-2xl font-extrabold sm:text-3xl text-navy-900">
              Why Regular Water Tank Cleaning is Vital for Your Health
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Municipal supply and borewell water carry microscopic sand, rust, and silt that settle at the bottom of overhead and underground water reservoirs. Over just a few months in warm climates, this stagnant layer develops into dense organic sludge that breeds algae, biofilm, and disease-causing bacteria (such as E. coli and Salmonella).
            </p>
            <p className="mt-3 leading-relaxed text-slate-600">
              Every time you brush your teeth, wash vegetables, shower, or wash dishes, you are exposed to this water. Even the finest domestic RO purifier struggles when the input water tank is laden with heavy bio-sediment. Our mechanized 6-stage protocol completely eliminates this hazard.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="card border-l-4 border-l-rose-500 p-5">
                <h4 className="font-bold text-navy-900">Common Risks of Dirty Tanks</h4>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  <li>• Turbid water with sulfurous or earthy taste</li>
                  <li>• Chronic skin rashes, acne, and severe hair loss</li>
                  <li>• Mud clogging overhead showers and aerators</li>
                  <li>• Bacterial contamination and stomach bugs</li>
                </ul>
              </div>
              <div className="card border-l-4 border-l-aqua-500 p-5">
                <h4 className="font-bold text-navy-900">Benefits of Our Service</h4>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  <li>• 100% crystal clear, odor-free tap water</li>
                  <li>• Multi-stage UV disinfection eradicates germs</li>
                  <li>• Zero toxic chemical residue left behind</li>
                  <li>• Complete photo documentation provided</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Before & After Transformation */}
          <section className="rounded-3xl bg-slate-50 p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold text-navy-900">Real Transformation: Water Tank Cleaning</h2>
            <p className="mt-2 text-sm text-slate-600">
              Drag the interactive slider below to witness the dramatic difference our mechanized slurry extraction and high-pressure scrubbing achieves.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl shadow-card">
              <BeforeAfter
                before="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=80"
                after="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"
                title="Overhead Water Tank Transformation"
              />
            </div>
          </section>

          {/* 6-Stage Process */}
          <section>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Engineering Excellence</span>
            <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl text-navy-900">
              Our 6-Stage Mechanized Cleaning Process
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              No manual wiping with dirty rags. We employ specialized industrial-grade mechanized equipment at every step:
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {STAGES.map((s) => {
                const IconCmp = s.icon;
                return (
                  <div key={s.step} className="card relative flex flex-col p-6 transition hover:shadow-card">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 font-display font-extrabold text-sm">
                        {s.step}
                      </span>
                      <IconCmp className="h-5 w-5 text-aqua-600" />
                    </div>
                    <h3 className="mt-4 font-bold text-navy-900 text-base">{s.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Specialized Equipment */}
          <section className="rounded-3xl bg-navy-800 p-6 sm:p-8 text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-aqua-400">Certified Technology</span>
            <h2 className="mt-1 text-2xl font-extrabold !text-white sm:text-3xl">
              Professional Industrial Equipment We Use
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {EQUIPMENT.map((eq, i) => (
                <div key={i} className="glass rounded-2xl p-4">
                  <h4 className="font-bold text-aqua-300 text-sm">{eq.name}</h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">{eq.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="mb-6 text-2xl font-extrabold text-navy-900">Frequently Asked Questions</h2>
            <FaqAccordion items={TANK_FAQS} />
          </section>
        </div>

        {/* Sticky Booking Sidebar */}
        <aside id="book" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6 shadow-card border-brand-200">
            <div className="mb-4">
              <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                Direct Booking
              </span>
              <h3 className="mt-2 text-xl font-extrabold text-navy-900">Book Water Tank Cleaning</h3>
              <p className="mt-1 text-xs text-slate-500">Fixed upfront rate. No advance payment required.</p>
            </div>
            <BookingForm compact />
          </div>

          <div className="mt-6 card p-5 bg-gradient-to-br from-slate-50 to-white text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Need Immediate Assistance?</p>
            {c.phone && (
              <a href={telHref(c.phone)} className="mt-2 inline-flex items-center gap-2 font-display text-lg font-bold text-brand-600 hover:underline">
                <Phone className="h-4 w-4" /> {c.phone}
              </a>
            )}
            <p className="mt-1 text-xs text-slate-500">Available Mon - Sat: 8 AM - 8 PM</p>
          </div>
        </aside>
      </div>

      {/* Bottom CTA & Related Services */}
      <section className="section bg-slate-50 border-t border-slate-200">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold text-navy-900">Explore Complete Water Purity Services</h2>
            <p className="mt-2 text-sm text-slate-600">Combine clean water storage with high-efficiency RO purifier filtration.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link to="/ro-water-purifier-cleaning" className="card p-5 transition hover:shadow-card group">
              <h3 className="font-bold text-navy-900 group-hover:text-brand-600 flex items-center justify-between">
                RO Purifier Sanitization <ArrowRight className="h-4 w-4 text-aqua-600" />
              </h3>
              <p className="mt-2 text-xs text-slate-600">Storage tank sterilization, biofilm removal, and TDS check.</p>
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
