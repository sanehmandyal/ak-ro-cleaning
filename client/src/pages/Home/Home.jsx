import { Link } from 'react-router-dom';
import { Phone, MessageCircle, CalendarCheck, ArrowRight, Star, MapPin, Clock, Mail, Quote } from 'lucide-react';
import Seo, { localBusinessJsonLd } from '../../components/Seo';
import { useSite } from '../../context/SiteContext';
import useFetch from '../../hooks/useFetch';
import { SectionHeading, CardSkeletons, ErrorState } from '../../components/ui';
import ServiceCard from '../../components/ServiceCard';
import Icon from '../../components/Icon';
import BeforeAfter from '../../components/BeforeAfter';
import FaqAccordion from '../../components/FaqAccordion';
import Img from '../../components/Img';
import { telHref, whatsappHref, optimizeImage } from '../../utils/format';

function Hero({ settings }) {
  const c = settings?.contact || {};
  const hero = settings?.hero || {};
  const bg = hero.image?.url;
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white">
      {bg ? (
        <>
          <img src={optimizeImage(bg, 1920)} alt="Aqua Ak Enterprises Pure Water" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25 mix-blend-luminosity" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-900/85 to-navy-950/70" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_25%,rgba(6,182,212,0.25),transparent_45%),radial-gradient(circle_at_85%_75%,rgba(16,185,129,0.2),transparent_45%)]" />
        </>
      ) : (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,.35),transparent_45%),radial-gradient(circle_at_10%_90%,rgba(20,184,166,.4),transparent_50%)]" />
      )}
      <div className="container-x grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.2fr_.8fr] lg:py-28">
        <div className="animate-fade-up">
          <p className="glass mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-aqua-300 border border-aqua-400/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Star className="h-3.5 w-3.5 fill-aqua-400 text-aqua-400" /> {settings?.tagline || 'Purity Guaranteed · Certified Water Hygiene'}
          </p>
          <h1 className="text-3xl font-extrabold leading-tight !text-white sm:text-5xl lg:text-[3.5rem] tracking-tight">
            {hero.heading || 'Certified RO Purifier & Mechanized Water Tank Cleaning'}
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-200 sm:text-lg leading-relaxed">{hero.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/booking" className="btn-primary shadow-glow">
              <CalendarCheck className="h-4 w-4" /> Book Doorstep Service
            </Link>
            {c.phone && (
              <a href={telHref(c.phone)} className="btn-ghost-light">
                <Phone className="h-4 w-4 text-aqua-400" /> Call {c.phone}
              </a>
            )}
            {c.whatsapp && (
              <a href={whatsappHref(c.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn-ghost-light">
                <MessageCircle className="h-4 w-4 text-emerald-400" /> WhatsApp Direct
              </a>
            )}
          </div>
        </div>
        {settings?.stats?.length > 0 && (
          <div className="glass-dark grid grid-cols-2 gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl p-5 sm:p-7 mt-4 lg:mt-0 border border-aqua-500/20 shadow-2xl">
            {settings.stats.slice(0, 4).map((s) => (
              <div key={s.label} className="rounded-xl sm:rounded-2xl bg-white/[0.06] p-3.5 sm:p-5 text-center border border-white/5 hover:border-aqua-400/40 transition">
                <p className="font-display text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-aqua-400 to-mint-400 bg-clip-text text-transparent">{s.value}</p>
                <p className="mt-1.5 text-[11px] sm:text-xs font-medium text-slate-300">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const { settings } = useSite();
  const services = useFetch('/services', { popular: 'true' });
  const gallery = useFetch('/gallery', { type: 'before-after', limit: 3 });
  const testimonials = useFetch('/testimonials');
  const faqs = useFetch('/faqs');
  const c = settings?.contact || {};
  const name = settings?.businessName || 'Aqua Ak Enterprises';

  return (
    <>
      <Seo
        page="home"
        title={`${name} | Water Tank, RO Purifier & Deep Cleaning`}
        description={settings?.hero?.description}
        jsonLd={localBusinessJsonLd(settings)}
      />
      <Hero settings={settings} />

      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="What we do" title="Our Popular Services" subtitle="Reliable cleaning for the places that matter most to your health and comfort." />
          {services.loading ? <CardSkeletons /> : services.error ? <ErrorState message={services.error} onRetry={services.reload} /> : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {(services.data?.length ? services.data : []).map((s) => <ServiceCard key={s._id} service={s} />)}
              </div>
              <div className="mt-10 text-center">
                <Link to="/services" className="btn-outline">View all services <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </>
          )}
        </div>
      </section>


      {settings?.whyChooseUs?.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-x">
            <SectionHeading eyebrow="Why choose us" title={`Why Customers Trust ${name}`} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {settings.whyChooseUs.map((w, i) => (
                <div key={i} className="card p-6 text-center transition hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-aqua-500 text-white">
                    <Icon name={w.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">{w.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{w.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {gallery.data?.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeading eyebrow="Our work" title="Before & After" subtitle="Drag the slider to see the difference our team makes." />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gallery.data.map((g) => (
                <figure key={g._id}>
                  <BeforeAfter before={g.beforeImage?.url} after={g.afterImage?.url} title={g.title} />
                  <figcaption className="mt-3 text-center text-sm font-semibold text-navy-800">{g.title}</figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-10 text-center"><Link to="/gallery" className="btn-outline">See full gallery <ArrowRight className="h-4 w-4" /></Link></div>
          </div>
        </section>
      )}

      {settings?.howItWorks?.length > 0 && (
        <section className="section bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white border-y border-aqua-500/20">
          <div className="container-x">
            <SectionHeading light eyebrow="How it works" title="Clean & Pure in Four Simple Steps" />
            <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {settings.howItWorks.map((s, i) => (
                <li key={i} className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-aqua-400/40 transition">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-aqua-400 to-mint-400 font-display font-black text-navy-950 shadow-glow">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-bold !text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">{s.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {testimonials.data?.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeading eyebrow="Testimonials" title="What Our Customers Say" />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.data.slice(0, 6).map((t) => (
                <figure key={t._id} className="card flex flex-col p-6">
                  <Quote className="h-7 w-7 text-aqua-500" />
                  <div className="mt-3 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    ))}
                  </div>
                  <blockquote className="mt-3 flex-1 break-words text-sm leading-relaxed text-slate-600">{t.message}</blockquote>
                  <figcaption className="mt-4 border-t border-slate-100 pt-4">
                    <p className="font-display font-bold text-navy-800">{t.name}</p>
                    <p className="text-xs text-slate-500">{[t.service, t.location].filter(Boolean).join(' · ')}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {settings?.serviceAreas?.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-x">
            <SectionHeading eyebrow="Service areas" title="Areas We Serve" subtitle="Not sure if we cover your locality? Call us and we will confirm." />
            <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
              {settings.serviceAreas.map((a, i) => (
                <li key={i} className="card inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-navy-800">
                  <MapPin className="h-4 w-4 text-aqua-600" /> {a.name}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {faqs.data?.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
            <FaqAccordion items={faqs.data} />
          </div>
        </section>
      )}

      <section className="section bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white border-t border-aqua-500/30 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.2),transparent_50%)]" />
        <div className="container-x grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="glass mb-3 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-aqua-300">
              <Star className="h-3.5 w-3.5 text-aqua-400" /> Fast Doorstep Service in Lucknow
            </span>
            <h2 className="text-3xl font-extrabold !text-white sm:text-4xl">Ready for 100% Pure, Hygienic Water?</h2>
            <p className="mt-3 text-slate-200 leading-relaxed">Book certified RO servicing or mechanized water tank cleaning in 60 seconds.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/booking" className="btn-primary shadow-glow">
                <CalendarCheck className="h-4 w-4" /> Book a Service Now
              </Link>
              <Link to="/contact" className="btn-ghost-light">Contact Our Specialists</Link>
            </div>
          </div>
          <ul className="space-y-3.5 text-sm glass-dark p-6 rounded-3xl border border-white/10">
            {c.phone && <li className="flex items-center gap-3"><Phone className="h-5 w-5 text-aqua-400 shrink-0" /><a href={telHref(c.phone)} className="font-bold text-white hover:text-aqua-300 transition text-base">{c.phone}</a></li>}
            {c.email && <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-aqua-400 shrink-0" /><a href={`mailto:${c.email}`} className="break-all hover:text-aqua-300">{c.email}</a></li>}
            {c.address && <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-aqua-400" /><span>{c.address}, {c.city}</span></li>}
            {settings?.businessHours?.[0] && <li className="flex items-center gap-3"><Clock className="h-5 w-5 text-aqua-400 shrink-0" /><span>{settings.businessHours[0].day}: {settings.businessHours[0].hours}</span></li>}
          </ul>
        </div>
      </section>
    </>
  );
}
