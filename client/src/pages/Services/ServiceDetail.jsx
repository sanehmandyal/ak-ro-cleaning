import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import Seo, { localBusinessJsonLd } from '../../components/Seo';
import { useSite } from '../../context/SiteContext';
import useFetch from '../../hooks/useFetch';
import { Skeleton, ErrorState, SectionHeading } from '../../components/ui';
import Img from '../../components/Img';
import Icon from '../../components/Icon';
import FaqAccordion from '../../components/FaqAccordion';
import BookingForm from '../../components/BookingForm';
import { telHref, whatsappHref } from '../../utils/format';
import NotFound from '../NotFound';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { settings } = useSite();
  const { data: s, loading, error, reload } = useFetch(`/services/${slug}`);
  const others = useFetch('/services');
  const c = settings?.contact || {};
  const name = settings?.businessName || 'Aqua Ak Enterprises';

  if (loading) {
    return (
      <div className="container-x space-y-4 py-14" aria-busy="true">
        <Skeleton className="h-10 w-2/3" /><Skeleton className="h-64 w-full" /><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-4/5" />
      </div>
    );
  }
  if (error?.includes('not found') || error === 'Service not found') return <NotFound />;
  if (error) return <div className="container-x py-20"><ErrorState message={error} onRetry={reload} /></div>;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: s.title,
      description: s.shortDescription || s.description,
      ...(s.image?.url ? { image: s.image.url } : {}),
      provider: { '@type': 'LocalBusiness', name, ...(c.phone ? { telephone: c.phone } : {}) },
      ...(settings?.serviceAreas?.length ? { areaServed: settings.serviceAreas.map((a) => a.name) } : {}),
      ...(s.price?.amount ? { offers: { '@type': 'Offer', priceCurrency: 'INR', price: s.price.amount } } : {}),
    },
    ...(s.faqs?.length
      ? [{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: s.faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
        }]
      : []),
    localBusinessJsonLd(settings),
  ].filter(Boolean);

  return (
    <>
      <Seo
        title={s.seo?.title || `${s.title} | ${name}`}
        description={s.seo?.description || s.shortDescription}
        keywords={s.seo?.keywords}
        image={s.image?.url}
        jsonLd={jsonLd}
      />
      <section className="bg-navy-800 py-10 sm:py-14">
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-slate-300">
            <Link to="/" className="hover:text-aqua-400">Home</Link> / <Link to="/services" className="hover:text-aqua-400">Services</Link> / <span className="text-white">{s.title}</span>
          </nav>
          <h1 className="text-3xl font-extrabold !text-white sm:text-5xl">{s.title}</h1>
          <p className="mt-3 max-w-2xl text-slate-300">{s.shortDescription}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="#book" className="btn-aqua">{s.ctaText || 'Book this service'}</a>
            {c.phone && <a href={telHref(c.phone)} className="btn-ghost-light"><Phone className="h-4 w-4" /> Call Now</a>}
            {c.whatsapp && <a href={whatsappHref(c.whatsapp, `Hello, I would like to know more about ${s.title}.`)} target="_blank" rel="noopener noreferrer" className="btn-ghost-light"><MessageCircle className="h-4 w-4" /> WhatsApp</a>}
          </div>
        </div>
      </section>

      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_400px] lg:py-16">
        <div className="min-w-0 space-y-12">
          <Img src={s.image?.url} alt={`${s.title} by ${name}`} eager className="aspect-[16/9] w-full rounded-3xl object-cover shadow-card" width={1200} sizes="(min-width:1024px) 60vw, 100vw" />

          <section>
            <h2 className="text-2xl font-extrabold">About this service</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600">{s.description}</p>
          </section>

          {s.benefits?.length > 0 && (
            <section>
              <h2 className="text-2xl font-extrabold">Benefits</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {s.benefits.map((b, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-aqua-600" />{b}</li>)}
              </ul>
            </section>
          )}

          {s.process?.length > 0 && (
            <section>
              <h2 className="text-2xl font-extrabold">Our cleaning process</h2>
              <ol className="mt-5 space-y-4">
                {s.process.map((p, i) => (
                  <li key={i} className="card flex gap-4 p-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 font-display font-bold text-white">{i + 1}</span>
                    <div className="min-w-0"><h3 className="font-bold">{p.title}</h3><p className="mt-1 text-sm text-slate-600">{p.description}</p></div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {s.whyChooseUs?.length > 0 && (
            <section className="rounded-3xl bg-navy-800 p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold !text-white">Why choose us</h2>
              <ul className="mt-4 space-y-3">
                {s.whyChooseUs.map((w, i) => <li key={i} className="flex items-start gap-2 text-slate-200"><Icon name="ShieldCheck" className="mt-0.5 h-5 w-5 shrink-0 text-aqua-400" />{w}</li>)}
              </ul>
            </section>
          )}

          {s.faqs?.length > 0 && (
            <section>
              <h2 className="mb-5 text-2xl font-extrabold">Frequently asked questions</h2>
              <FaqAccordion items={s.faqs} />
            </section>
          )}
        </div>

        <aside id="book" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-4 text-xl font-extrabold">Book {s.title}</h2>
          <BookingForm defaultServiceId={s._id} compact />
        </aside>
      </div>

      {others.data?.length > 1 && (
        <section className="section bg-slate-50">
          <div className="container-x">
            <SectionHeading title="Other services you may need" />
            <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
              {others.data.filter((o) => o.slug !== s.slug).slice(0, 8).map((o) => (
                <li key={o._id}><Link to={`/services/${o.slug}`} className="card inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-navy-800 hover:text-brand-600">{o.title} <ArrowRight className="h-4 w-4" /></Link></li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
