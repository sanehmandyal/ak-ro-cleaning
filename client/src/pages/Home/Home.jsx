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
    <section className="relative isolate overflow-hidden bg-navy-800 text-white">
      {bg ? (
        <>
          <img src={optimizeImage(bg, 1600)} alt="" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900/90 via-navy-800/75 to-navy-800/40" />
        </>
      ) : (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(25,195,214,.35),transparent_45%),radial-gradient(circle_at_10%_90%,rgba(29,111,224,.45),transparent_50%)]" />
      )}
      <div className="container-x grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.2fr_.8fr] lg:py-28">
        <div className="animate-fade-up">
          <p className="glass mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-aqua-100">
            <Star className="h-3.5 w-3.5 fill-aqua-400 text-aqua-400" /> {settings?.tagline || 'Hygienic. Reliable. Spotless.'}
          </p>
          <h1 className="text-3xl font-extrabold leading-tight !text-white sm:text-5xl lg:text-[3.4rem]">
            {hero.heading || 'Professional Cleaning for a Healthier Home & Workplace'}
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-200 sm:text-lg">{hero.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/booking" className="btn-aqua"><CalendarCheck className="h-4 w-4" /> Book a Service</Link>
            {c.phone && <a href={telHref(c.phone)} className="btn-ghost-light"><Phone className="h-4 w-4" /> Call Now</a>}
            {c.whatsapp && (
              <a href={whatsappHref(c.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn-ghost-light">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            )}
          </div>
        </div>
        {settings?.stats?.length > 0 && (
          <div className="glass grid grid-cols-2 gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mt-4 lg:mt-0">
            {settings.stats.slice(0, 4).map((s) => (
              <div key={s.label} className="rounded-xl sm:rounded-2xl bg-white/10 p-3 sm:p-4 text-center">
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-aqua-400">{s.value}</p>
                <p className="mt-1 text-[11px] sm:text-xs text-slate-200">{s.label}</p>
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
        <section className="section bg-navy-800">
          <div className="container-x">
            <SectionHeading light eyebrow="How it works" title="Clean in Four Simple Steps" />
            <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {settings.howItWorks.map((s, i) => (
                <li key={i} className="glass rounded-2xl p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-aqua-500 font-display font-extrabold text-navy-900">{i + 1}</span>
                  <h3 className="mt-4 text-lg font-bold !text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{s.description}</p>
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

      <section className="section bg-gradient-to-br from-brand-600 to-navy-800 text-white">
        <div className="container-x grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold !text-white sm:text-3xl">Ready for a spotless space?</h2>
            <p className="mt-3 text-slate-200">Book online in a minute or talk to us directly.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/booking" className="btn-aqua"><CalendarCheck className="h-4 w-4" /> Book a Service</Link>
              <Link to="/contact" className="btn-ghost-light">Contact us</Link>
            </div>
          </div>
          <ul className="space-y-3 text-sm">
            {c.phone && <li className="flex items-center gap-3"><Phone className="h-5 w-5 text-aqua-400" /><a href={telHref(c.phone)}>{c.phone}</a></li>}
            {c.email && <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-aqua-400" /><a href={`mailto:${c.email}`} className="break-all">{c.email}</a></li>}
            {c.address && <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-aqua-400" />{c.address}</li>}
            {settings?.businessHours?.[0] && <li className="flex items-center gap-3"><Clock className="h-5 w-5 text-aqua-400" />{settings.businessHours[0].day}: {settings.businessHours[0].hours}</li>}
          </ul>
        </div>
      </section>
    </>
  );
}
