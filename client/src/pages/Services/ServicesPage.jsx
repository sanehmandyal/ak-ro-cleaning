import Seo from '../../components/Seo';
import useFetch from '../../hooks/useFetch';
import ServiceCard from '../../components/ServiceCard';
import { CardSkeletons, ErrorState, EmptyState } from '../../components/ui';
import { useSite } from '../../context/SiteContext';

export default function ServicesPage() {
  const { settings } = useSite();
  const { data, loading, error, reload } = useFetch('/services');
  const name = settings?.businessName || 'Aqua Ak Enterprises';
  return (
    <>
      <Seo page="services" title={`Cleaning Services | ${name}`} description="Water tank, RO purifier, bathroom, kitchen, sofa, carpet, home and office cleaning services." />
      <section className="bg-navy-800 py-14 text-center sm:py-20">
        <div className="container-x">
          <h1 className="text-3xl font-extrabold !text-white sm:text-5xl">Our Cleaning Services</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">Professional cleaning for homes and businesses, delivered by trained teams.</p>
        </div>
      </section>
      <section className="section">
        <div className="container-x">
          {loading ? <CardSkeletons count={6} /> : error ? <ErrorState message={error} onRetry={reload} /> : data?.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((s) => <ServiceCard key={s._id} service={s} />)}
            </div>
          ) : <EmptyState title="No services available right now" text="Please check back soon or contact us directly." />}
        </div>
      </section>
    </>
  );
}
