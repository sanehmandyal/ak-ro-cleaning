import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  MessageCircle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Droplets,
  Waves,
  Bath,
  ChefHat,
  AppWindow,
  ArrowRight,
  Layers,
} from 'lucide-react';
import Seo, { localBusinessJsonLd } from '../../components/Seo';
import { useSite } from '../../context/SiteContext';
import FaqAccordion from '../../components/FaqAccordion';
import BookingForm from '../../components/BookingForm';
import Img from '../../components/Img';
import { telHref } from '../../utils/format';

const LOCATIONS_DATA = {
  lucknow: {
    city: 'Lucknow (Jankipuram & All Localities)',
    slug: 'lucknow',
    title: 'Aqua Ak Enterprises - RO & Water Tank Cleaning in Jankipuram, Lucknow',
    description:
      'Certified mechanized water tank cleaning, RO purifier servicing, and deep cleaning services across Jankipuram, Aliganj, Gomti Nagar, and all Lucknow areas.',
    heroImage: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1600&q=80',
    waterNote:
      'Lucknow groundwater in Jankipuram and surrounding areas frequently exhibits heavy calcium scaling, high TDS, and mud sediment that chokes RO membranes and leaves stubborn algae in overhead water tanks. Aqua Ak Enterprises provides certified 6-stage slurry cleaning and digital TDS testing at your doorstep.',
    neighborhoods: [
      'Jankipuram (Sectors A, B, C, D, Ext., Ring Road)',
      'Aliganj (Sectors A to Q, Kapoorthala, Dandiya)',
      'Gomti Nagar & Gomti Nagar Extension',
      'Indira Nagar, Kalyanpur & Munshipulia',
      'Mahanagar, Vikas Nagar & Tedhi Pulia',
      'Hazratganj, Alambagh, Ashiyana & Charbagh',
    ],
    faqs: [
      {
        question: 'Where is Aqua Ak Enterprises located in Lucknow?',
        answer: 'Our registered headquarters is located at Jankipuram, Lucknow. We dispatch fully equipped mobile service vans across all sectors of Jankipuram, Aliganj, Gomti Nagar, and Greater Lucknow. Call 9219254461.',
      },
      {
        question: 'How quickly can your technician arrive in Jankipuram or Aliganj?',
        answer: 'Because our central operations hub is in Jankipuram, our verified technicians can arrive within 30 to 60 minutes for emergency water tank cleaning or RO breakdown repair. Contact us on 9219254461.',
      },
      {
        question: 'Which RO purifier brands does Aqua Ak Enterprises service in Lucknow?',
        answer: 'We service all major brands: Kent, Aquaguard, Pureit, Livpure, Havells, AO Smith, and commercial RO plants, stocking authentic sealed replacement membranes and sediment filters.',
      },
    ],
  },
  noida: {
    city: 'Noida & Greater Noida',
    slug: 'noida',
    title: 'Professional Cleaning & Water Tank Services in Noida & Greater Noida',
    description:
      'Certified mechanized water tank cleaning, RO purifier maintenance, and deep cleaning services across Noida sectors 1 to 150, Expressway, and Greater Noida West.',
    heroImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
    waterNote:
      'Noida and Greater Noida groundwater often exhibits elevated TDS levels (400 - 900+ ppm) and calcium hardness, leading to rapid scaling in overhead tanks and shower tiles. Regular bi-annual tank cleaning and quarterly RO purifier servicing is essential here.',
    neighborhoods: [
      'Sector 62, 63, 50, 78, 79, 137',
      'Noida Expressway High-Rise Societies',
      'Gaur City 1 & 2, Greater Noida West',
      'Jaypee Greens, Pari Chowk',
      'Sector 15, 16, 18 Commercial Areas',
      'Sector 120, 121, 122 Residential Hubs',
    ],
    faqs: [
      {
        question: 'How quickly can your team arrive for water tank cleaning in Noida?',
        answer: 'We have stationed mobile service vans stationed in Sector 62 and Expressway. We offer same-day service and 24-hour advance slot confirmation across all Noida sectors.',
      },
      {
        question: 'Do societies in Greater Noida require special permission for your team?',
        answer: 'Our technicians carry valid government photo IDs, company uniform badges, and security gate check-in documentation for smooth entry into gated high-rise societies.',
      },
    ],
  },
  delhi: {
    city: 'South & Central Delhi',
    slug: 'delhi',
    title: 'Professional Cleaning & Water Hygiene Services in Delhi NCR',
    description:
      'Premier water tank UV sterilization, RO purifier repair & maintenance, bathroom descaling, and full home deep cleaning across South and Central Delhi.',
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1600&q=80',
    waterNote:
      'Delhi supply water alternates between river surface water and groundwater blending. Biofilm and silt settle quickly in older overhead Sintex and underground masonry sumps. Our 6-stage slurry extraction ensures your domestic water is pure and sterile.',
    neighborhoods: [
      'Vasant Kunj, Vasant Vihar',
      'Greater Kailash 1 & 2, Saket',
      'Hauz Khas, Green Park, Safdarjung',
      'Defence Colony, Lajpat Nagar',
      'Chanakyapuri, Connaught Place',
      'Dwarka Sub-City Sectors 1-23',
    ],
    faqs: [
      {
        question: 'Can you clean underground concrete sumps in South Delhi builder floors?',
        answer: 'Yes. We specialize in deep RCC underground water sumps commonly found in Delhi independent floors and bungalows, using industrial German slurry pumps.',
      },
      {
        question: 'Do you offer weekend cleaning slots in Delhi?',
        answer: 'Yes, Saturday and Sunday slots are very popular and can be booked easily online with no extra weekend surcharge.',
      },
    ],
  },
  gurgaon: {
    city: 'Gurgaon (Gurugram)',
    slug: 'gurgaon',
    title: 'Expert Home Deep Cleaning & Water Tank Services in Gurgaon',
    description:
      'Top-rated mechanized water tank sanitization, RO purifier servicing, and kitchen/bathroom descaling for condominiums and villas across Gurgaon.',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    waterNote:
      'Gurgaon experiences severe hard water from borewell supplies, leaving chalky white calcium crust on shower cubicles, faucets, and water tank bases. Our surface-safe descaling and UV sanitization restore cleanliness and hygiene.',
    neighborhoods: [
      'DLF Phase 1, 2, 3, 4, 5',
      'Golf Course Road & Golf Course Extension',
      'Cyber City & Udyog Vihar Commercials',
      'Sohna Road, Sector 47, 48, 49',
      'Sushant Lok 1, 2, 3',
      'New Gurgaon Sectors 82-95',
    ],
    faqs: [
      {
        question: 'Do you clean condominium balcony glass and window tracks in Gurgaon?',
        answer: 'Yes. Our glass cleaning team handles exterior balcony panels, sliding track vacuums, and shower enclosure descaling across all DLF and Golf Course Road condominiums.',
      },
      {
        question: 'Can I book an ongoing quarterly water hygiene contract for my villa?',
        answer: 'Yes! We offer discounted bi-annual and quarterly maintenance subscriptions for water tanks, RO purifiers, and home deep cleans.',
      },
    ],
  },
  ghaziabad: {
    city: 'Ghaziabad & East Delhi',
    slug: 'ghaziabad',
    title: 'Mechanized Cleaning & Water Tank Hygiene in Ghaziabad',
    description:
      'Professional water tank cleaning, RO filter service, and home deep cleaning in Indirapuram, Vaishali, Vasundhara, and Kaushambi.',
    heroImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80',
    waterNote:
      'East Delhi and Ghaziabad societies rely heavily on mixed water supplies. Silt, rust from aging delivery pipes, and mud settle rapidly in underground reservoirs. Mechanized evacuation is essential to prevent waterborne illnesses.',
    neighborhoods: [
      'Indirapuram (Ahinsa Khand, Vaibhav Khand)',
      'Vaishali Sectors 1-9',
      'Vasundhara Sectors 1-19',
      'Kaushambi High-Rise Societies',
      'Raj Nagar Extension',
      'Mayur Vihar Phase 1, 2, 3',
    ],
    faqs: [
      {
        question: 'Do your technicians bring their own power extension cords and equipment?',
        answer: 'Yes. Our team carries 50-meter heavy-duty industrial extension cables, water inlet tubes, and complete dewatering gear.',
      },
    ],
  },
  bengaluru: {
    city: 'Bengaluru (Bangalore)',
    slug: 'bengaluru',
    title: 'Specialized Cleaning & RO Water Services in Bengaluru',
    description:
      'Certified mechanized water tank sanitization, RO purifier servicing, and corporate/residential deep cleaning across Bangalore.',
    heroImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    waterNote:
      'Bengaluru borewell water in tech corridors (Whitefield, Bellandur, Sarjapur) has exceptionally high hardness and silica content. We provide heavy-duty chemical-free tank descaling and RO membrane diagnostic visits.',
    neighborhoods: [
      'Whitefield, ITPL & Kadugodi',
      'Koramangala, HSR Layout, BTM Layout',
      'Indiranagar, Domlur, Old Airport Road',
      'Bellandur, Marathahalli, Outer Ring Road',
      'Electronic City Phase 1 & 2',
      'Hebbal, Manyata Tech Park, Yelahanka',
    ],
    faqs: [
      {
        question: 'Do you service commercial tech offices and co-working spaces in Bengaluru?',
        answer: 'Yes. We cater to tech agencies, startups, clinics, and residential apartments with after-hours flexible scheduling.',
      },
    ],
  },
};

export default function LocationsPage() {
  const { city } = useParams();
  const { settings } = useSite();
  const c = settings?.contact || {};
  const name = settings?.businessName || 'Aqua Ak Enterprises';

  const currentLoc = city && LOCATIONS_DATA[city.toLowerCase()] ? LOCATIONS_DATA[city.toLowerCase()] : null;

  if (currentLoc) {
    const jsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: `${name} - ${currentLoc.city}`,
        description: currentLoc.description,
        telephone: c.phone || '+919219254461',
        address: {
          '@type': 'PostalAddress',
          addressLocality: currentLoc.city,
          addressCountry: 'IN',
        },
        areaServed: currentLoc.neighborhoods.map((n) => ({ '@type': 'Place', name: n })),
      },
      localBusinessJsonLd(settings),
    ].filter(Boolean);

    return (
      <>
        <Seo
          page="locations"
          title={`${currentLoc.city} Cleaning & Water Tank Services | ${name}`}
          description={currentLoc.description}
          keywords={`cleaning services in ${currentLoc.city}, water tank cleaning in ${currentLoc.city}, RO service ${currentLoc.city}, bathroom deep cleaning ${currentLoc.city}`}
          image={currentLoc.heroImage}
          jsonLd={jsonLd}
        />

        {/* City Hero */}
        <section className="relative isolate overflow-hidden bg-navy-800 text-white">
          <Img
            src={currentLoc.heroImage}
            alt={`Cleaning services in ${currentLoc.city}`}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            eager
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-900/85 to-navy-800/60" />

          <div className="container-x py-16 sm:py-24">
            <nav aria-label="Breadcrumb" className="mb-4 text-xs font-semibold text-slate-300">
              <Link to="/" className="hover:text-aqua-400">Home</Link> / <Link to="/locations" className="hover:text-aqua-400">Locations</Link> / <span className="text-white">{currentLoc.city}</span>
            </nav>

            <span className="glass mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-aqua-300">
              <MapPin className="h-3.5 w-3.5 text-aqua-400" /> Local Service Hub: {currentLoc.city}
            </span>
            <h1 className="text-3xl font-extrabold leading-tight !text-white sm:text-5xl max-w-3xl">
              {currentLoc.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg leading-relaxed">
              {currentLoc.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#book" className="btn-aqua">
                <CalendarCheck className="h-4 w-4" /> Book in {currentLoc.city}
              </a>
              {c.phone && (
                <a href={telHref(c.phone)} className="btn-ghost-light">
                  <Phone className="h-4 w-4" /> Call {c.phone}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Local Content */}
        <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_400px]">
          <div className="min-w-0 space-y-12">
            {/* Water Quality & Context */}
            <section className="card p-6 border-l-4 border-l-brand-600">
              <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                <Droplets className="h-5 w-5 text-aqua-600" /> Local Water Quality & Hygiene Advice
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{currentLoc.waterNote}</p>
            </section>

            {/* Neighborhoods Covered */}
            <section>
              <h2 className="text-2xl font-extrabold text-navy-900">Neighborhoods Covered in {currentLoc.city}</h2>
              <p className="mt-2 text-sm text-slate-600">Our technicians provide prompt doorstep visits across:</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {currentLoc.neighborhoods.map((n, i) => (
                  <div key={i} className="card p-4 flex items-center gap-2 text-sm font-semibold text-navy-800">
                    <CheckCircle2 className="h-4 w-4 text-aqua-600 shrink-0" /> {n}
                  </div>
                ))}
              </div>
            </section>

            {/* Services Available in this City */}
            <section>
              <h2 className="text-2xl font-extrabold text-navy-900">Popular Services in {currentLoc.city}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Link to="/water-tank-cleaning" className="card p-5 group hover:shadow-card transition">
                  <Droplets className="h-6 w-6 text-brand-600 mb-2" />
                  <h3 className="font-bold text-navy-900 group-hover:text-brand-600 text-base">
                    Water Tank Cleaning
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">6-stage mechanized cleaning and UV radiation for pure water.</p>
                </Link>
                <Link to="/ro-water-purifier-cleaning" className="card p-5 group hover:shadow-card transition">
                  <Waves className="h-6 w-6 text-aqua-600 mb-2" />
                  <h3 className="font-bold text-navy-900 group-hover:text-brand-600 text-base">
                    RO Purifier Maintenance
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">Tank sterilization, TDS check, and filter flushing.</p>
                </Link>
                <Link to="/services/ro-filter-membrane-replacement" className="card p-5 group hover:shadow-card transition">
                  <Layers className="h-6 w-6 text-brand-600 mb-2" />
                  <h3 className="font-bold text-navy-900 group-hover:text-brand-600 text-base">
                    Filter & Membrane Replacement
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">Genuine 75/100 GPD membranes, sediment filters & carbon blocks.</p>
                </Link>
                <Link to="/services/commercial-ro-plant-servicing" className="card p-5 group hover:shadow-card transition">
                  <ShieldCheck className="h-6 w-6 text-teal-600 mb-2" />
                  <h3 className="font-bold text-navy-900 group-hover:text-brand-600 text-base">
                    Commercial RO Plant Servicing
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">50 LPH to 1,000+ LPH systems for offices, schools, and clinics.</p>
                </Link>
              </div>
            </section>

            {/* Local FAQs */}
            {currentLoc.faqs?.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-extrabold text-navy-900">Frequently Asked Questions</h2>
                <FaqAccordion items={currentLoc.faqs} />
              </section>
            )}
          </div>

          {/* Sticky Booking Form */}
          <aside id="book" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6 shadow-card border-brand-200">
              <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 mb-2">
                Fast Doorstep Visit
              </span>
              <h3 className="text-xl font-extrabold text-navy-900">Book in {currentLoc.city}</h3>
              <p className="mt-1 text-xs text-slate-500 mb-4">No advance fee. Transparent on-site billing.</p>
              <BookingForm compact />
            </div>
          </aside>
        </div>
      </>
    );
  }

  // Index View (All Locations)
  return (
    <>
      <Seo
        page="locations"
        title={`Service Areas & Locations | ${name}`}
        description={`Explore the cities and residential zones served by ${name} in Jankipuram, Lucknow and surrounding regions. Prompt doorstep water tank cleaning and RO servicing.`}
      />

      <section className="bg-navy-800 py-14 text-center sm:py-20 text-white">
        <div className="container-x">
          <span className="glass mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-aqua-300">
            <MapPin className="h-3.5 w-3.5 text-aqua-400" /> Wide Regional Reach
          </span>
          <h1 className="text-3xl font-extrabold !text-white sm:text-5xl">Areas & Cities We Serve</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Dedicated mobile units equipped with mechanized pressure scrubbers, slurry pumps, and UV sanitization gear ready to serve your locality.
          </p>
        </div>
      </section>

      <div className="container-x py-14 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(LOCATIONS_DATA).map((loc) => (
            <div key={loc.slug} className="card p-6 flex flex-col justify-between hover:shadow-card transition group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-bold text-aqua-600 bg-aqua-50 px-2.5 py-1 rounded-md">Same-Day Slots</span>
                </div>
                <h3 className="text-xl font-bold text-navy-900 group-hover:text-brand-600">{loc.city}</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{loc.description}</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Sectors:</p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    {loc.neighborhoods.slice(0, 3).map((n, i) => (
                      <li key={i}>• {n}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link to={`/locations/${loc.slug}`} className="text-sm font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
                  View Local Details <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/booking" className="btn-primary btn-sm">Book</Link>
              </div>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div className="mt-12 card p-8 bg-gradient-to-br from-brand-50 via-white to-slate-50 text-center max-w-3xl mx-auto">
          <h3 className="text-xl font-extrabold text-navy-900">Don&apos;t See Your Exact Sector Listed?</h3>
          <p className="mt-2 text-sm text-slate-600">
            We routinely service peripheral societies and upcoming sectors. Contact our dispatch team to confirm immediate availability.
          </p>
          <div className="mt-5 flex justify-center gap-4 flex-wrap">
            {c.phone && (
              <a href={telHref(c.phone)} className="btn-primary">
                <Phone className="h-4 w-4" /> Call {c.phone}
              </a>
            )}
            <Link to="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </div>
    </>
  );
}
