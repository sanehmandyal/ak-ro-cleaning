import { CheckCircle2, Target, Eye, Award, ShieldCheck, HeartHandshake, Sparkles, Clock, Check, Users } from 'lucide-react';
import Seo from '../../components/Seo';
import { useSite } from '../../context/SiteContext';
import { SectionHeading } from '../../components/ui';
import Img from '../../components/Img';
import { Link } from 'react-router-dom';

export default function About() {
  const { settings } = useSite();
  const a = settings?.about || {};
  const name = settings?.businessName || 'Aqua Ak Enterprises';

  return (
    <>
      <Seo
        page="about"
        title={`About Us | ${name} - Professional Hygiene & Water Tank Services`}
        description={a.intro || `Learn about ${name}, our story, mission, certified cleaning standards, and dedicated team.`}
        image={a.image?.url}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 py-16 text-center sm:py-24 text-white relative isolate overflow-hidden border-b border-aqua-500/20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.25),transparent_60%)]" />
        <div className="container-x">
          <span className="glass mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-aqua-300 border border-aqua-400/30">
            <Sparkles className="h-3.5 w-3.5 text-aqua-400" /> Dedicated Hygiene Pioneers
          </span>
          <h1 className="text-3xl font-extrabold !text-white sm:text-5xl lg:text-6xl tracking-tight">About {name}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200 leading-relaxed text-base sm:text-lg">{a.intro}</p>
        </div>
      </section>

      {/* Our Story & Experience */}
      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Img
            src={
              a.image?.url && !a.image.url.includes('1582213782179') && !a.image.url.includes('1581578731548')
                ? a.image.url
                : '/images/ro-purifier-machine.jpg'
            }
            alt={`${name} modern RO water purifier machine with digital TDS display`}
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-card"
            sizes="(min-width:1024px) 50vw, 100vw"
            eager
          />
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-aqua-600">
              <HeartHandshake className="h-4 w-4" /> Our Story & Foundations
            </div>
            <h2 className="text-2xl font-extrabold sm:text-3xl text-navy-900">
              Built on the Principle of Pure Water & Healthy Living
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              {name} was established after recognizing a glaring gap in urban residential health: families invested in high-end drinking purifiers, yet their overhead storage reservoirs and pipes remained coated in mud, algae, and calcium scale.
            </p>
            <p className="mt-3 leading-relaxed text-slate-600">
              We pioneered mechanized 6-stage slurry extraction and UV sterilization to replace the hazardous manual rag-and-bleach methods of the past. Today, we have expanded to complete domestic and commercial deep hygiene, providing descaling, grease eradication, and upholstery restoration without harmful chemicals.
            </p>
            {a.trustPoints?.length > 0 && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {a.trustPoints.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-semibold text-navy-800">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-600" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-slate-50">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <div className="card p-8 border-t-4 border-t-brand-600">
            <Target className="h-9 w-9 text-brand-600" />
            <h3 className="mt-4 text-xl font-extrabold text-navy-900">Our Mission</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{a.mission}</p>
          </div>
          <div className="card p-8 border-t-4 border-t-aqua-500">
            <Eye className="h-9 w-9 text-aqua-600" />
            <h3 className="mt-4 text-xl font-extrabold text-navy-900">Our Vision</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{a.vision}</p>
          </div>
        </div>
      </section>

      {/* Professional Standards */}
      {a.standards?.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeading eyebrow="Standards" title="Our Professional Cleaning Standards" subtitle="Quality protocols enforced on every single service engagement." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {a.standards.map((s, i) => (
                <div key={i} className="card p-6 relative overflow-hidden group hover:shadow-card transition">
                  <span className="font-display text-4xl font-black text-brand-100 group-hover:text-aqua-200 transition">
                    0{i + 1}
                  </span>
                  <p className="mt-2 text-sm font-bold text-navy-900 leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Customers Trust Us */}
      <section className="section bg-navy-800 text-white">
        <div className="container-x">
          <SectionHeading light eyebrow="Confidence & Safety" title={`Why Customers Trust ${name}`} subtitle="We believe exceptional service is built on reliability, safety, and respect." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="glass rounded-2xl p-6">
              <Users className="h-8 w-8 text-aqua-400 mb-3" />
              <h4 className="font-bold text-base !text-white">Trained & Verified Crew</h4>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Full-time employees with verified government photo IDs and rigorous safety certifications.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <ShieldCheck className="h-8 w-8 text-aqua-400 mb-3" />
              <h4 className="font-bold text-base !text-white">Non-Toxic Compounds</h4>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Zero harmful acids or harsh chlorine fumes. Safe for children, pets, elderly, and drinking water.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <Clock className="h-8 w-8 text-aqua-400 mb-3" />
              <h4 className="font-bold text-base !text-white">Punctual & Prepared</h4>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Our technicians arrive on time with complete industrial scrubbers, extension cords, and gear.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <Award className="h-8 w-8 text-aqua-400 mb-3" />
              <h4 className="font-bold text-base !text-white">100% Satisfaction</h4>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Pre- and post-cleaning inspection walk-through. Any area needing adjustment is re-cleaned on the spot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section text-center">
        <div className="container-x max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold sm:text-4xl text-navy-900">Experience Certified Hygiene Today</h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Join thousands of satisfied homeowners and business managers who trust {name} for their water hygiene and deep cleaning needs.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/booking" className="btn-primary">
              Book a Service Online
            </Link>
            <Link to="/services" className="btn-outline">
              Explore All Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
